# dsh-ting

> 让 dsh-tui 会说话：每条回答直接送进播放器，点哪句，从哪句读。

[![CI](https://github.com/2700-hub/dsh-ting/actions/workflows/ci.yml/badge.svg)](https://github.com/2700-hub/dsh-ting/actions/workflows/ci.yml)
![status](https://img.shields.io/badge/status-M0%20%E9%AA%A8%E6%9E%B6-yellow)

## 这是什么

一个 **dsh-tui 插件**，加上一个本地播放器 `ting`。

插件跑在 dsh-tui 进程内，订阅 `assistant/message` 事件，**直接拿到回答原文**；
按一下快捷键，文本被交给播放器，于是有了语速、进度条、逐句点亮、点哪句读哪句。

## 为什么不做成外部脚本

外部程序看不到终端里的字，只能绕：

| 办法 | 问题 |
| --- | --- |
| 拖选复制 | 长回答要拖很久 |
| 截图 + OCR | 会把工具调用、状态栏一起念出来 |
| 读会话 JSONL | 会话文件退出时才落盘，当前这条读不到 |
| 手动存文本 | 靠人记，忘了就"写死" |

插件在进程内，这些绕路全都不需要。

## 架构

```
assistant/message ──► 插件 (messages.observe)
                          │  原文 + 元信息
                          ▼
                    ~/.cache/ting/inbox.md
                          │  spawn
                          ▼
                    ting 播放器（GTK4 + GStreamer）
                          │
                          ▼
                    扬声器：语速 / 进度 / 逐句点亮
```

细节见 [docs/DESIGN.md](docs/DESIGN.md)；
"为什么不用外部脚本""为什么用文件交接"这类取舍记在 [docs/adr/](docs/adr/)。

## 当前状态

M0 · 仓库骨架、文档、CI。插件本体还没接上（见 [docs/ROADMAP.md](docs/ROADMAP.md)）。

## 开发

```bash
git clone git@github.com:2700-hub/dsh-ting.git
cd dsh-ting
pnpm install
pnpm typecheck
pnpm test
```

工作流（分支、提交、PR、评审）见 [docs/WORKFLOW.md](docs/WORKFLOW.md)，
提交规范见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

[MIT](LICENSE)
