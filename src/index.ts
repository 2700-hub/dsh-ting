/**
 * dsh-ting 插件入口。
 *
 * M0：先落地与 TUI 无关的纯逻辑（回答文本归一化），并写单测。
 * M1 之后再接 messages.observe 与快捷键 —— 见 docs/ROADMAP.md。
 */

/** 一条回答的最小信息，插件从 messages.observe 的信封里取。 */
export interface Answer {
  /** 会话 id（scope 用） */
  sessionId: string;
  /** 会话内序号，用来判断新旧 */
  seq: number;
  /** 回答正文（Markdown 原文） */
  text: string;
}

/** 代码围栏 */
const FENCE = /```[\s\S]*?```/g;
/** 行内代码 */
const INLINE_CODE = /`([^`]*)`/g;
/** 图片 */
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g;
/** 链接，保留文字 */
const LINK = /\[([^\]]+)\]\([^)]*\)/g;
/** 裸链接 */
const URL = /https?:\/\/\S+/g;
/** 标题、引用、列表、有序列表的行首标记 */
const LINE_MARKS = /^(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+[.)、]\s+)/gm;

/**
 * 把 Markdown 压成适合朗读的纯文本。
 *
 * 规则：代码围栏整体丢掉（念代码没意义），行内代码/链接只留文字，
 * 去掉标题和列表符号，合并多余空行。
 */
export function normalizeAnswer(markdown: string): string {
  return markdown
    .replace(FENCE, "\n（这里有一段代码，略过）\n")
    .replace(INLINE_CODE, "$1")
    .replace(IMAGE, "")
    .replace(LINK, "$1")
    .replace(URL, "链接")
    .replace(LINE_MARKS, "")
    .replace(/\*\*|__/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * 判断两条消息谁更新：sequence 大的是新的；跨会话不算。
 */
export function isNewer(candidate: Answer, current: Answer | null): boolean {
  if (current === null) return true;
  if (candidate.sessionId !== current.sessionId) return true;
  return candidate.seq > current.seq;
}
