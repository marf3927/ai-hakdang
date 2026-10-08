const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { createApi } = require("../server/api.js");

let root, server, base;

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "hakdang-api-"));
  fs.mkdirSync(path.join(root, "data"));
  fs.mkdirSync(path.join(root, "me"));
  fs.writeFileSync(path.join(root, "data", "roadmap.json"), JSON.stringify({ stages: [] }));
  fs.writeFileSync(path.join(root, "me", "progress.json"), JSON.stringify({ learner: { name: "지민" } }));
  const api = createApi(root);
  server = http.createServer((req, res) => api(req, res, () => res.writeHead(404).end("next")));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test("/api 가 아닌 요청은 다음 처리기로 넘긴다", async () => {
  const res = await fetch(base + "/index.html");
  assert.equal(res.status, 404);
  assert.equal(await res.text(), "next");
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
  const body = { lesson: "me/lessons/0001-a.html", quiz: "q1", concept: "b1-terminal", choice: 2, correct: true };
  const res = await fetch(base + "/api/quiz", { method: "POST", body: JSON.stringify(body) });
  assert.equal(res.status, 204);
  const row = JSON.parse(fs.readFileSync(path.join(root, "me", "quiz-log.jsonl"), "utf8").trim().split("\n").at(-1));
  assert.equal(row.concept, "b1-terminal");
  assert.ok(row.at);
  assert.equal((await (await fetch(base + "/api/state")).json()).quiz.length, 1);
});

test("형식이 맞지 않는 퀴즈 결과는 기록하지 않는다", async () => {
  const log = path.join(root, "me", "quiz-log.jsonl");
  const before = fs.readFileSync(log, "utf8");
  for (const b of [{ lesson: "x" }, { lesson: "a", quiz: "q", choice: "1", correct: true }, "not json"]) {
    const res = await fetch(base + "/api/quiz", { method: "POST", body: typeof b === "string" ? b : JSON.stringify(b) });
    assert.equal(res.status, 400);
  }
  assert.equal(fs.readFileSync(log, "utf8"), before);
});

test("progress.json 이 깨져 있으면 이유를 알려 준다", async () => {
  fs.writeFileSync(path.join(root, "me", "progress.json"), "{ 깨짐");
  const s = await (await fetch(base + "/api/state")).json();
  assert.equal(s.progress, null);
  assert.match(s.errors[0], /progress\.json/);
});
