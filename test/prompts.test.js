const { test } = require("node:test");
const assert = require("node:assert/strict");
const prompts = require("../data/prompts.json");

test("복사용 문장은 id 가 겹치지 않고 비어 있지 않다", () => {
  const all = [...prompts.open.commands, ...prompts.say];
  assert.equal(new Set(all.map((p) => p.id)).size, all.length);
  for (const p of all) assert.ok(p.text.trim().length > 0, p.id);
});

test("폴더로 가는 명령은 실제 폴더 경로({root})를 채울 자리가 있다", () => {
  for (const c of prompts.open.commands) assert.match(c.text, /\{root\}/, c.id);
});
