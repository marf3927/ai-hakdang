const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createServer } = require("../server.js");

let root, server, base;

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "hakdang-"));
  fs.mkdirSync(path.join(root, "data"));
  fs.mkdirSync(path.join(root, "me", "lessons"), { recursive: true });
  fs.mkdirSync(path.join(root, ".git"));
  fs.writeFileSync(path.join(root, "index.html"), "<h1>지도</h1>");
  fs.writeFileSync(path.join(root, ".git", "config"), "secret");
  fs.writeFileSync(path.join(root, "data", "roadmap.json"), JSON.stringify({ stages: [] }));
  fs.writeFileSync(path.join(root, "me", "progress.json"), JSON.stringify({ learner: { name: "지민" } }));
  fs.writeFileSync(path.join(root, "me", "lessons", "0001-a.html"), "<p>수업</p>");
  server = createServer(root);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("루트는 index.html 을 보여 준다", async () => {
  const res = await fetch(base + "/");
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.equal(await res.text(), "<h1>지도</h1>");
});

test("수업 파일을 보여 준다", async () => {
  const res = await fetch(base + "/me/lessons/0001-a.html");
  assert.equal(res.status, 200);
});

test("점으로 시작하는 경로와 저장소 밖 경로는 막는다", async () => {
  assert.equal((await fetch(base + "/.git/config")).status, 404);
  assert.equal((await fetch(base + "/%2e%2e/%2e%2e/etc/passwd")).status, 404);
  assert.equal((await fetch(base + "/me/../.git/config")).status, 404);
});

test("상태 API 는 로드맵 · 진도 · 퀴즈 기록을 매번 파일에서 읽는다", async () => {
  const a = await (await fetch(base + "/api/state")).json();
  assert.equal(a.progress.learner.name, "지민");
  assert.deepEqual(a.quiz, []);
  fs.writeFileSync(path.join(root, "me", "progress.json"), JSON.stringify({ learner: { name: "민수" } }));
  const b = await (await fetch(base + "/api/state")).json();
  assert.equal(b.progress.learner.name, "민수");
});

test("퀴즈 결과를 me/quiz-log.jsonl 에 한 줄씩 덧붙인다", async () => {
  const body = { lesson: "me/lessons/0001-a.html", quiz: "q1", concept: "s0-path", choice: 2, correct: true };
  const res = await fetch(base + "/api/quiz", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  assert.equal(res.status, 204);
  const lines = fs.readFileSync(path.join(root, "me", "quiz-log.jsonl"), "utf8").trim().split("\n");
  const row = JSON.parse(lines.at(-1));
  assert.equal(row.concept, "s0-path");
  assert.equal(row.correct, true);
  assert.ok(row.at);
  const state = await (await fetch(base + "/api/state")).json();
  assert.equal(state.quiz.length, 1);
});

test("형식이 맞지 않는 퀴즈 결과는 기록하지 않는다", async () => {
  const before = fs.readFileSync(path.join(root, "me", "quiz-log.jsonl"), "utf8");
  const bad = [{ lesson: "x" }, { lesson: "a", quiz: "q", choice: "1", correct: true }, "not json"];
  for (const b of bad) {
    const res = await fetch(base + "/api/quiz", { method: "POST", body: typeof b === "string" ? b : JSON.stringify(b) });
    assert.equal(res.status, 400);
  }
  assert.equal(fs.readFileSync(path.join(root, "me", "quiz-log.jsonl"), "utf8"), before);
});

test("progress.json 이 깨져 있으면 이유를 알려 준다", async () => {
  fs.writeFileSync(path.join(root, "me", "progress.json"), "{ 깨짐");
  const res = await fetch(base + "/api/state");
  assert.equal(res.status, 200);
  const s = await res.json();
  assert.equal(s.progress, null);
  assert.match(s.errors[0], /progress\.json/);
});
