# 10 天开发计划

给"你"看的：每天做什么、交什么、代码放哪。
按每天 2–3 小时估，赶时间可以两天并一天，但**不要跳过 PR 和自审**——那正是这个项目要练的东西。

仓库：`https://github.com/2700-hub/dsh-ting`（本地在 `~/Code/dsh-ting`）

---

## 每天固定动作

**开工**

```bash
git switch main && git pull          # 拿最新
git switch -c feat/day3-load          # 一天一个分支
```

**收工**

```bash
git add -p                            # 挑着暂存，别一把梭
git commit -m "feat(load): ..."       # 见 CONTRIBUTING 的类型表
git push -u origin HEAD
gh pr create --fill                   # 或网页上开
```

**代码交到哪里**：全部走 **PR → `main`**。不要直接往 `main` 推；
每天的分支就是当天的"作业"，PR 描述就是"作业说明"，CI 绿了才算交完，合并后分支删掉。

---

## Day 0 · 把门打开（30 分钟，一次性）

| 任务 | 产出 | 验收 |
| --- | --- | --- |
| 完成 GitHub 设备码授权，或自己建空仓库 `dsh-ting` | 仓库能 push | `git push` 不报权限错 |
| `git clone` 到本地，`pnpm install` | 本地能跑 | `pnpm typecheck` 通过 |
| 跑 `pnpm test` | 7 条测试全绿 | 输出 `pass 7` |
| 浏览 README / docs/WORKFLOW.md | 知道流程 | 能说出"issue→分支→PR→CI→合并" |

**交付**：仓库里 `main` 有 6 个提交，CI 徽章是绿的。

---

## Day 1 · 读懂现有代码（2 小时）

| 任务 | 产出 |
| --- | --- |
| 读 `src/index.ts`，画出 `normalizeAnswer` 的处理顺序 | 一页笔记（贴到 PR 描述或 issue 里） |
| 读 `test/normalize.test.ts`，给每条测试标"它防的是哪种回归" | 同上 |
| 加 3 条新测试：空字符串、纯空白、只有代码块 | `test/normalize.test.ts` +3 |
| 跑 `pnpm test` | 10 条全绿 |

**分支**：`test/day1-more-cases`
**PR 标题**：`test(text): 补空串/空白/纯代码块三种边界`
**交到哪**：PR → `main`，CI 绿后 squash 合并。

---

## Day 2 · 认识接缝（2 小时，只读不写）

| 任务 | 产出 |
| --- | --- |
| 读 `docs/PLUGIN-API-NOTES.md`，特别是"硬限制"那节 | 能回答：回调为什么不能做耗时操作 |
| 在你本机 dsh-tui 安装目录里找到 `message-observer.d.ts`，确认笔记没写错 | 有出入就改笔记 |
| 读 `docs/ADRs`，想清楚"为什么不用外部脚本" | 在 issue 里回一句你的理解 |

**分支**：`docs/day2-verify-notes`
**PR 标题**：`docs(plugin): 核对 observer 类型定义`
**交到哪**：同上。这天可能只改一两行——**小 PR 也是 PR**。

---

## Day 3 · M1：让插件被加载（3 小时，第一块硬骨头）

| 任务 | 产出 |
| --- | --- |
| 建测试 profile `~/.dsh/profiles/ting-test` | 目录 + `package.json` |
| 把 `dsh-ting` 作为 bundle 注册进去 | 配置片段（写进 PR 描述） |
| `src/index.ts` 加一个 `apply(ctx)`，打印启动日志 | 代码 |
| `/restart` 后确认日志出现、宿主无准入失败 | 截图或日志贴 PR |

**分支**：`feat/3-load-in-profile`
**PR 标题**：`feat(load): 插件在测试 profile 中加载并打印启动日志`
**交到哪**：PR → `main`。**这天大概率会卡**，卡住就把报错贴进 issue，别硬扛超过 40 分钟。

---

## Day 4 · M1 收尾（2 小时）

| 任务 | 产出 |
| --- | --- |
| 从 profile 移除 bundle，`/restart` 确认插件消失且无残留 | 验证记录 |
| 把"怎么装/怎么卸/怎么排障"写进 `docs/INSTALL.md` | 新文档 |
| 更新 `docs/PLUGIN-API-NOTES.md` 第 5 节"还没验证的" | 划掉已确认项 |

**分支**：`docs/4-install-guide`
**PR 标题**：`docs(install): 测试 profile 的装载与卸载`
**交到哪**：PR → `main`。

---

## Day 5 · M2：拿到回答原文（3 小时）

| 任务 | 产出 |
| --- | --- |
| `ctx.tuiMessageObserver.subscribe(..., { scope })` 订阅当前会话 | 代码 |
| 申请 `messages.observe.read` 授权，写清用途 | 授权记录截图 |
| 收到 `message.sent` 后写进 `~/.cache/ting/last-envelope.json` | 一个真实信封样例（脱敏后放进 `test/fixtures/`） |
| 写解析函数 + 单测 | `src/envelope.ts` + `test/envelope.test.ts` |

**分支**：`feat/5-observe`
**PR 标题**：`feat(observe): 订阅 assistant/message 并解析正文`
**交到哪**：PR → `main`。**注意**：正文上限 262144 字符，回调 1500ms 超时。

---

## Day 6 · M2 边界（2 小时）

| 任务 | 产出 |
| --- | --- |
| 会话切换时重建订阅、dispose 旧的 | 代码 + 测试 |
| 空内容、只有图片、超长文本三种情况 | 3 条测试 |
| 授权被撤销时会怎样（读文档确认，写进注释） | 注释 + 笔记 |

**分支**：`fix/6-observe-edge-cases`
**PR 标题**：`fix(observe): 会话切换与空内容边界`
**交到哪**：PR → `main`。

---

## Day 7 · M3：送进播放器（3 小时）

| 任务 | 产出 |
| --- | --- |
| 注册快捷键（默认 `Ctrl+Win+R`） | 代码 |
| 写 `~/.cache/ting/inbox.md`，`spawn('ting', ['-f', inbox])` | 代码 |
| 手动验证：按快捷键 → 播放器打开并朗读 | 录屏或截图 |
| 失败路径：播放器不存在时给提示 | 代码 + 测试 |

**分支**：`feat/7-hand-off-to-player`
**PR 标题**：`feat(handoff): 快捷键把回答交给 ting 播放器`
**交到哪**：PR → `main`。**这是整个项目的验收点。**

---

## Day 8 · 打磨（2 小时）

| 任务 | 产出 |
| --- | --- |
| 连续按两次快捷键会不会开两个播放器？定行为 | 决定写进 ADR |
| inbox 文件并发覆盖 | 代码或文档说明 |
| 日志：插件只记一条"已送交"，不记正文（隐私） | 代码 |

**分支**：`refactor/8-handoff-polish`
**PR 标题**：`refactor(handoff): 并发与日志脱敏`
**交到哪**：PR → `main`。

---

## Day 9 · 文档与发布准备（2 小时）

| 任务 | 产出 |
| --- | --- |
| README 补安装、授权、排障三节 | `README.md` |
| `CHANGELOG.md` 把 Unreleased 收口成 `0.1.0` | `CHANGELOG.md` |
| 跑一遍"照 README 从零装" | 验证记录 |

**分支**：`docs/9-release-notes`
**PR 标题**：`docs: 安装、授权与排障`
**交到哪**：PR → `main`。

---

## Day 10 · 发版与复盘（1.5 小时）

| 任务 | 产出 |
| --- | --- |
| 打 tag、发 Release | `v0.1.0` |
| 把 10 天里踩的坑写进 `docs/PLUGIN-API-NOTES.md` | 更新 |
| 复盘：哪一步最耗时、下次怎么改 | 一段话贴进 Release 说明 |

```bash
git tag -a v0.1.0 -m "首个可用版本：回答直接进播放器"
git push origin v0.1.0
gh release create v0.1.0 --notes-file CHANGELOG.md
```

---

## 代码交到哪里（汇总）

| 东西 | 位置 |
| --- | --- |
| 源码 | `src/`，只改这里 |
| 测试 | `test/`，改名 `*.test.ts` 自动被 `pnpm test` 捡到 |
| 文档 | `docs/`，架构 `DESIGN.md`、决策 `adr/`、流程 `WORKFLOW.md` |
| 每日作业 | 分支 `feat|fix|docs/dayN-xxx` → PR |
| 合并后 | `main` 永远可运行：`typecheck` 绿、`test` 绿 |
| 发布 | tag `v0.1.0` + GitHub Release |

## 三条纪律

1. **一天一个 PR**，超过 400 行就拆。
2. **卡住 40 分钟就开 issue**，把报错原样贴进去，别硬扛。
3. **合并前自己看一遍 diff**——这是最容易被跳过、也最有用的一步。
