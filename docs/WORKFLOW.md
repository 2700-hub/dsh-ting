# 标准工作流

这份文档是这个项目的"做法说明书"，也是一份可以照着练的 GitHub 工作流。

## 一句话版本

> **每个改动都从 issue 开始，走分支，进 PR，过 CI，被人（或自己）看过，再合并。**

## 1. Issue 先行

没有 issue 的 PR 不接。issue 要写清三件事：

- 现象 / 需求
- 验收标准（怎么算做完）
- 边界（明确不做什么）

## 2. 分支

从最新的 `main` 切，命名带类型和 issue 号：

```bash
git switch main && git pull
git switch -c feat/12-shortcut
```

| 前缀 | 用途 |
| --- | --- |
| `feat/` | 新功能 |
| `fix/` | 修 bug |
| `docs/` | 只改文档 |
| `chore/` | 构建、依赖、CI |
| `refactor/` | 不改行为的重构 |

## 3. 提交

用 Conventional Commits，一条提交只做一件事：

```
feat(shortcut): 注册 Ctrl+Win+R 触发朗读
fix(observer): 会话切换后订阅没有重建
docs(design): 补上插件与播放器的契约
```

好提交的判断标准：**只看这条提交的 message，能知道改了什么、为什么。**

## 4. PR

- 标题同提交规范
- 正文用模板：做了什么 / 关联 issue / 怎么自测
- 小步快跑：一个 PR 最好 < 400 行 diff
- 自己先看一遍 diff 再开

开 PR 后 CI 会自动跑（见 `.github/workflows/ci.yml`）：
`pnpm typecheck` + `pnpm test`。**红了不许合。**

## 5. 评审

自己开发时也走这一步：开 PR 后隔一会儿再看 diff，通常能发现"当时觉得没问题"的地方。

评审关注：

- 边界情况（没有消息、会话切换、取消播放）
- 错误处理（spawn 失败、文件写不进去）
- 有没有测试

## 6. 合并

- 用 **Squash and merge**：一个 PR 压成一个提交，`main` 历史干净
- 合并后删掉远端分支
- PR 里写 `Closes #12`，issue 自动关闭

## 7. 发布

- `CHANGELOG.md` 记 `Unreleased`，发版时改成版本号
- 打 tag：`git tag -a v0.1.0 -m "..."`，推上去
- GitHub Release 里写清安装方式和破坏性变更

## 常用命令

```bash
git switch -c feat/3-observe      # 开分支
git add -p                        # 挑着暂存，别一把梭
git commit -m "feat(observe): ..."# 提交
git push -u origin HEAD           # 推分支
gh pr create --fill               # 开 PR（gh 已登录时）
gh pr checks                      # 看 CI
gh pr merge --squash --delete-branch
```

## 这个项目要练到的点

- [x] 仓库骨架、README、LICENSE
- [x] Issue / PR 模板，CI
- [ ] 用 issue 拆里程碑
- [ ] 分支 + 小步提交
- [ ] PR + 自审 + CI 通过
- [ ] tag + Release
