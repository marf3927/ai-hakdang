const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { execFile } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");

function fakeServer(root) {
  return http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, root }));
  });
}

function runStart(port) {
  return new Promise((resolve) =>
    execFile(process.execPath, [path.join(repoRoot, "bin", "start.mjs")], { env: { ...process.env, PORT: String(port) }, timeout: 10000 }, (err, stdout) =>
      resolve({ code: err ? err.code : 0, stdout })
    )
  );
}

test("같은 폴더의 학습 지도가 이미 켜져 있으면 한국어로 알려 주고 정상 종료한다", async () => {
  const running = fakeServer(repoRoot);
  await new Promise((r) => running.listen(0, "127.0.0.1", r));
  const port = running.address().port;
  let r;
  try {
    r = await runStart(port);
  } finally {
    running.close();
  }
  assert.equal(r.code, 0);
  assert.match(r.stdout, /이미 켜져 있어요/);
  assert.match(r.stdout, new RegExp(`localhost:${port}`));
});

test("다른 폴더의 학습 지도가 그 포트를 쓰고 있으면 그 폴더를 알려 주고 실패로 끝낸다", async () => {
  const running = fakeServer("/somewhere/else/ai-hakdang");
  await new Promise((r) => running.listen(0, "127.0.0.1", r));
  const port = running.address().port;
  let r;
  try {
    r = await runStart(port);
  } finally {
    running.close();
  }
  assert.notEqual(r.code, 0);
  assert.match(r.stdout, /다른 폴더/);
  assert.match(r.stdout, /\/somewhere\/else\/ai-hakdang/);
});
