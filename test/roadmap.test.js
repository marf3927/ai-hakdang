const { test } = require("node:test");
const assert = require("node:assert/strict");
const roadmap = require("../data/roadmap.json");
const pinned = require("./roadmap-ids.json");

const stageIds = roadmap.stages.map((s) => s.id);
const conceptIds = roadmap.stages.flatMap((s) => s.concepts.map((c) => c.id));

test("한 번 정한 단계 · 개념 id 는 사라지지 않는다 — 학습자 진도의 키다", () => {
  const now = new Set([...stageIds, ...conceptIds]);
  const missing = pinned.filter((id) => !now.has(id));
  assert.deepEqual(missing, [], `사라진 id: ${missing.join(", ")}. 지우지 말고 옮기는 방법을 먼저 정한다`);
});

test("id 는 겹치지 않는다", () => {
  const all = [...stageIds, ...conceptIds];
  assert.equal(new Set(all).size, all.length);
});

test("모든 단계는 있는 트랙에 속하고, 만들어 볼 것은 있는 단계 뒤에 온다", () => {
  const tracks = new Set(roadmap.tracks.map((t) => t.id));
  for (const s of roadmap.stages) assert.ok(tracks.has(s.track), `${s.id} 의 트랙 ${s.track}`);
  for (const p of roadmap.projects) assert.ok(stageIds.includes(p.after), p.what);
});
