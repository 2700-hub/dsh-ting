# 插件 API 实测笔记

从本机 dsh-tui 0.16.1 的安装目录里读出来的**事实**，不是推测。每条都标了出处，
升级后可以照着重查。

出处前缀简写：

- `PKG` = `~/.dsh/profiles/dsh-tui/node_modules/@deepseek-harness-tui/dsh-tui`
- `STD` = `PKG/vendor/dsh-std/packages/command/node_modules/@dsh-std/manifest`

## 1. `dsh-plugin.json` 清单

schema：`STD/schema/dsh-plugin-0.15.schema.json`（v0.15）
校验器：`STD/lib/index.js` 的 `parseManifest()` / `projectManifest()`

必填字段：

| 字段 | 约束 |
| --- | --- |
| `$schema` | 任意绝对 URI（加载时不会去 fetch） |
| `manifestVersion` | 固定 `"0.15"` |
| `id` | `^[a-z][a-z0-9]*(?:[.-][a-z0-9][a-z0-9-]*)+$` |
| `name`、`version` | 非空字符串 |
| `facets.host` | `{ entry, apiVersion }`，`entry` 是相对路径（不能以 `/` 开头、不能含 `..`），`apiVersion` 形如 `v1` |
| `requires.contracts` | 数组，每项 `{ apiVersion, kind }`，如 `messages.dsh/v1alpha1` + `MessageObserver` |
| `permissions` | 每项 `{ name, scope, reason? }`，`name` 也要命名空间形式 |
| `contributes.commands` | 必填（可以为空数组），每项 `{ id, title, description? }` |
| `subscriptions` | 数组，字符串或 `{ apiVersion, kind, scope? }` |

**踩过的坑**：`description` 不是顶层允许字段，写上去直接报
`community v0.15 plugin manifest contains unknown field "description"`。
顶层只允许
`$schema / manifestVersion / id / name / version / facets / requires / permissions / contributes / subscriptions / license / source / artifact / compat / overrides`。

本地校验：

```bash
pnpm manifest      # scripts/validate-manifest.mjs，找不到校验器就跳过
```

## 2. `messages.observe`（接缝：消息观察）

出处：`PKG/lib/types/dsh-adapter/message-observer.d.ts`

```ts
const dispose = ctx.tuiMessageObserver.subscribe(pluginCtx, listener, {
  scope: `session:${sessionId}`,
});
```

- 订阅要**精确 scope**，只收到同 scope 的信封；换会话要重新订阅，并 dispose 旧的。
- 返回的 disposer 调用一次即释放；grant 被撤销时会自动释放并打一条 warning。

信封：

```ts
{
  eventType: "messages.observe",
  eventVersion: "0.15",
  eventId: string,        // `<sessionId>:<seq>`，非法字符被压成 `_`
  scope: string,          // session:<id>
  sequence: number,       // 会话事件自己的 seq
  privacyClass: "sensitive",
  summary: string,        // 前 200 格
  payload: {
    kind: "message.created" | "message.received" | "message.sent",
    messageId?, author?,
    content: Array<{ type: "text"; text: string } | { type: "image"; data; mimeType }>,
    truncated?: boolean,
  },
}
```

映射关系：

| 会话事件 | payload.kind |
| --- | --- |
| `user/message` | `message.received` |
| `assistant/message` | `message.sent` |
| 其余（流式 chunk、tool/*、turn/*） | **不发** |

因此"一条回答"= 一个 `message.sent`，正文在 `content` 的 text 块里（图片走附件）。

硬限制（写代码前必须知道）：

| 限制 | 值 |
| --- | --- |
| 正文上限 | 262144 字符 |
| summary 上限 | 200 格 |
| 单次回调超时 | 1500 ms（超时直接关闭订阅） |
| 每订阅排队回调 | 32 |
| 图片预算 | 每块 192 KiB |

**推论**：回调里不能做耗时操作（比如同步 spawn 播放器等它退出），
要尽快落地文本（写文件/入队），把重活丢给子进程。

## 3. 权限

- `messages.observe.read`：默认拒绝。没批准时订阅是**空操作**（给你一个 no-op disposer + warning），
  不会抛错 —— 排查"为什么收不到消息"时先看这个。
- 撤销授权时订阅被释放，只打一次 warning。

## 4. 安装与生命周期

- 装：`/plugin install <spec>` 或 `dsh plugin add`，写进 profile 的 `dsh.profile.bundles`。
- **装完要 `/restart`**，热装不生效。
- 卸载：`/plugin remove <bundle>`。
- 插件连续崩溃 3 次，本会话禁用它。

## 5. 还没验证的

- 快捷键注册的具体 API（接缝十二）—— 只在文档层面确认是"稳定候选"
- 条目渲染器怎么加点击入口（接缝十三）
- 从插件里 spawn 子进程是否被沙箱限制

这三条是 M1/M3 的待办，验证后补进本文。
