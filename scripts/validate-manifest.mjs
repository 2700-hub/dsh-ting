#!/usr/bin/env node
/**
 * 用 dsh-tui 自带的官方校验器校验 dsh-plugin.json。
 *
 * 这个包没有发到 npm，所以从本地已装的 dsh-tui profile 里找：
 *   DSH_MANIFEST_LIB=/path/to/@dsh-std/manifest/lib/index.js node scripts/validate-manifest.mjs
 *
 * 找不到时以退出码 0 跳过（CI 里不影响），并打印一句说明。
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const MANIFEST = new URL("../dsh-plugin.json", import.meta.url);
const VENDOR = [
  "vendor/dsh-std/packages/command/node_modules/@dsh-std/manifest/lib/index.js",
  "vendor/dsh-std/packages/manifest/node_modules/@dsh-std/manifest/lib/index.js",
];

function findLib() {
  if (process.env.DSH_MANIFEST_LIB) return process.env.DSH_MANIFEST_LIB;
  const home = process.env.HOME ?? "";
  const roots = [
    join(home, ".dsh/profiles/dsh-tui/node_modules/@deepseek-harness-tui/dsh-tui"),
    join(home, ".dsh-tui"),
  ];
  for (const root of roots) {
    for (const rel of VENDOR) {
      const p = join(root, rel);
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}

const lib = findLib();
if (lib === undefined) {
  console.log("跳过：没找到 @dsh-std/manifest（设置 DSH_MANIFEST_LIB 可启用校验）");
  process.exit(0);
}

const { parseManifest, projectManifest } = await import(pathToFileURL(lib).href);
const source = readFileSync(MANIFEST, "utf8");
try {
  const manifest = parseManifest(source, { source: "dsh-plugin.json" });
  const projected = projectManifest(manifest);
  console.log(`清单校验通过：${manifest.id}@${manifest.version}`);
  console.log(`facets：${(projected.facets ?? []).map((f) => f.name ?? String(f)).join(", ") || "(无)"}`);
} catch (error) {
  console.error(`清单校验失败：${error.message}`);
  process.exit(1);
}
