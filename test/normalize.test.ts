import assert from "node:assert/strict";
import { test } from "node:test";

import { isNewer, normalizeAnswer, type Answer } from "../src/index.ts";

test("去掉代码围栏，留一句提示", () => {
  const md = "先看这段：\n\n```ts\nconsole.log(1)\n```\n\n然后继续。";
  const out = normalizeAnswer(md);
  assert.match(out, /这里有一段代码，略过/);
  assert.doesNotMatch(out, /console\.log/);
});

test("行内代码和链接只留文字", () => {
  assert.equal(normalizeAnswer("用 `ting -c` 读，见 [文档](https://x.dev/a)"), "用 ting -c 读，见 文档");
});

test("去掉标题和列表符号", () => {
  assert.equal(normalizeAnswer("## 步骤\n\n- 第一步\n- 第二步"), "步骤\n\n第一步\n第二步");
});

test("裸链接替换成「链接」", () => {
  assert.equal(normalizeAnswer("地址是 https://example.com/x?y=1 试试"), "地址是 链接 试试");
});

test("合并多余空行，去掉行尾空格", () => {
  assert.equal(normalizeAnswer("a  \n\n\n\nb"), "a\n\nb");
});

test("同一会话按 seq 判断新旧", () => {
  const a: Answer = { sessionId: "s1", seq: 3, text: "旧" };
  const b: Answer = { sessionId: "s1", seq: 5, text: "新" };
  assert.equal(isNewer(b, a), true);
  assert.equal(isNewer(a, b), false);
  assert.equal(isNewer(a, null), true);
});

test("换了会话也算新", () => {
  const a: Answer = { sessionId: "s1", seq: 9, text: "旧" };
  const b: Answer = { sessionId: "s2", seq: 1, text: "新会话" };
  assert.equal(isNewer(b, a), true);
});

test("空字符串还是空字符串", () => {
  assert.equal(normalizeAnswer(""), "");
});

test("只有空白就清成空串", () => {
  assert.equal(normalizeAnswer("  \n\n \t "), "");
});

test("只有代码块时留一句提示，不返回空", () => {
  assert.equal(normalizeAnswer("```ts\nconsole.log(1)\n```"), "（这里有一段代码，略过）");
});
