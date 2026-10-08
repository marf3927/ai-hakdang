import { test } from "node:test";
import assert from "node:assert/strict";
import { shapeState, lessonFromHash } from "../src/shape.mjs";

const roadmap = {
  title: "t",
  tracks: [{ id: "basic", title: "기본" }, { id: "advanced", title: "심화" }],
  stages: [
    { id: "b1", track: "basic", title: "작업 환경", concepts: [{ id: "b1-a" }, { id: "b1-b" }], terms: [] },
    { id: "a1", track: "advanced", title: "요청 흐름", concepts: [{ id: "a1-a" }], terms: [] },
  ],
  projects: [],
};

test("단계를 트랙별 편으로 나누고, 장 번호는 id 의 숫자다", () => {
  const s = shapeState({ roadmap, progress: null, quiz: [], errors: [] });
  assert.deepEqual(s.parts.map((p) => [p.track.id, p.stages.map((x) => x.id)]), [["basic", ["b1"]], ["advanced", ["a1"]]]);
  assert.equal(s.stages[0].no, "1");
  assert.equal(s.stageName("a1"), "심화 1장 요청 흐름");
});

test("개념 상태를 한 번만 세어 단계 · 전체 합계를 만든다", () => {
  const s = shapeState({ roadmap, progress: { concepts: { "b1-a": "learned", "a1-a": "learning" }, stages: { b1: { checked: "2026-10-11" } } }, quiz: [{ correct: true }, { correct: false }], errors: [] });
  assert.deepEqual([s.stages[0].learned, s.stages[0].learning, s.stages[0].checked], [1, 0, "2026-10-11"]);
  assert.deepEqual(s.totals, { concepts: 3, learned: 1, learning: 1, quiz: 2, right: 1 });
});

test("지금 단계는 next → 시작 단계 → 첫 단계 순으로 정한다", () => {
  assert.equal(shapeState({ roadmap, progress: { next: { stage: "a1" } }, quiz: [], errors: [] }).currentStage, "a1");
  assert.equal(shapeState({ roadmap, progress: { learner: { start: "b1" } }, quiz: [], errors: [] }).currentStage, "b1");
  assert.equal(shapeState({ roadmap, progress: null, quiz: [], errors: [] }).currentStage, "b1");
});

test("수업 주소(#/lesson/…)는 me/lessons 안의 html 만 받는다", () => {
  assert.equal(lessonFromHash("#/lesson/me/lessons/0001-a.html"), "me/lessons/0001-a.html");
  assert.equal(lessonFromHash("#/lesson/me/lessons/../../.env"), null);
  assert.equal(lessonFromHash("#/lesson/https://evil.example/x.html"), null);
  assert.equal(lessonFromHash("#/lesson/me/lessons/a.js"), null);
  assert.equal(lessonFromHash(""), null);
});
