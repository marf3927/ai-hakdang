// 실제 Vite 개발 서버를 임시 폴더 위에 띄워, API 연결과 숨김 경로 차단을 확인한다.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

let root, server, base;

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "hakdang-vite-"));
  fs.mkdirSync(path.join(root, "data"));
  fs.mkdirSync(path.join(root, "me", "lessons"), { recursive: true });
  fs.mkdirSync(path.join(root, ".git"));
  fs.writeFileSync(path.join(root, ".git", "config"), "secret");
  fs.writeFileSync(path.join(root, ".env"), "SECRET=1");
  fs.writeFileSync(path.join(root, "index.html"), "<h1>지도</h1>");
  fs.writeFileSync(path.join(root, "data", "roadmap.json"), JSON.stringify({ stages: [] }));
  fs.writeFileSync(path.join(root, "me", "lessons", "0001-a.html"), "<p>수업</p>");
  const { createServer } = await import("vite");
  server = await createServer({
    configFile: path.join(__dirname, "..", "vite.config.mjs"),
    root,
    logLevel: "silent",
    server: { port: 0, strictPort: false },
  });
  await server.listen();
  base = `http://127.0.0.1:${server.httpServer.address().port}`;
});

after(() => server.close());

test("API 가 개발 서버에 붙어 있다", async () => {
  const res = await fetch(base + "/api/health");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test("화면과 수업 파일을 보여 준다", async () => {
  assert.equal((await fetch(base + "/")).status, 200);
  assert.equal((await fetch(base + "/me/lessons/0001-a.html")).status, 200);
});

test(".git · .env 같은 숨김 파일은 보여 주지 않는다", async () => {
  for (const p of ["/.git/config", "/.env", "/@fs" + path.join(root, ".git", "config"), "/@fs" + path.join(root, ".env")]) {
    const res = await fetch(base + p);
    const text = await res.text();
    assert.ok(!text.includes("secret") && !text.includes("SECRET=1"), `${p} 가 노출됨 (${res.status})`);
  }
});
