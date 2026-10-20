# 贡献指南

## 提交信息

Conventional Commits：

```
<type>(<scope>): <一句话>
```

| type | 用在哪 |
| --- | --- |
| `feat` | 新能力 |
| `fix` | 修 bug |
| `docs` | 只动文档 |
| `chore` | 依赖、构建、CI |
| `refactor` | 不改行为 |
| `test` | 只加测试 |

正文（可选）写清"为什么"，不要复述"改了什么"。

## 分支

`feat/12-shortcut`、`fix/31-subscribe` —— 类型 + issue 号 + 简短描述。

## 代码风格

- TypeScript strict，`noUncheckedIndexedAccess` 开着
- 不引运行时依赖，除非有明确理由并在 PR 里说明
- 对外导出的函数必须有测试
- 注释写"为什么"，不写"是什么"

## 本地检查

```bash
pnpm typecheck
pnpm test
```

## PR

- 关联 issue（`Closes #12`）
- 一个 PR 一件事，超过 400 行 diff 先想想能不能拆
- CI 红了不许合
- 合并用 Squash
