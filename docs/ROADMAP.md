# 路线图

每个里程碑对应一个 GitHub Milestone，下面的条目对应 issue。

## M0 · 骨架（进行中）

- [x] 仓库、README、LICENSE、`package.json`
- [x] CI（typecheck + test）
- [x] issue / PR 模板
- [x] `docs/DESIGN.md`、`docs/WORKFLOW.md`
- [x] 插件入口骨架 + 首个单测
- [x] `dsh-plugin.json` 清单，通过官方 `parseManifest()` 校验
- [x] `tsc -p tsconfig.build.json` 产出 `dist/index.js`

## M1 · 能被加载

**验收**：在测试 profile 里装上，`/restart` 后插件被加载，日志里能看到生命周期，宿主不报准入失败。

- 写 `dsh-plugin.json` 清单，跑通准入
- profile 里注册 bundle
- 打印一条启动日志
- 卸载后无残留

## M2 · 拿得到原文

**验收**：插件收到 `assistant/message` 后，能在日志/文件里看到完整的回答文本（不是摘要）。

- 订阅 `messages.observe`（会话 scope）
- 申请 `messages.observe.read` 授权，写清用途
- 处理会话切换、订阅重建
- 单测：信封解析、空内容、超长文本

## M3 · 送进播放器

**验收**：按快捷键，播放器打开并开始朗读刚才那条回答。

- 注册快捷键（可配置，默认 `Ctrl+Win+R`）
- 写 `~/.cache/ting/inbox.md`
- spawn `ting -f`
- 失败提示：不覆盖剪贴板、不静默

## M4 · 发布

**验收**：别人照 README 能装上并用起来。

- 安装说明（`/plugin install` 或 `dsh plugin add`）
- 卸载与排障
- `CHANGELOG` + tag + Release

## 以后

- 条目渲染器：回答旁边一个「▶」，点了从那段读
- 侧栏播放控制面板
- 多会话：指定读哪一条
