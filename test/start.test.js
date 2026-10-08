const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const { execFile } = require("node:child_process");

test("학습 지도가 이미 켜져 있으면 한국어로 알려 주고 정상 종료한다", async () => {
  const running = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  });
  await new Promise((r) => running.listen(0, "127.0.0.1", r));
  const port = running.address().port;
  let out;
  try {
    out = await new Promise((resolve, reject) =>
      execFile(process.execPath, [path.join(__dirname, "..", "bin", "start.mjs")], { env: { ...process.env, PORT: String(port) }, timeout: 10000 }, (err, stdout) =>
        err ? reject(err) : resolve(stdout)
      )
    );
  } finally {
    running.close();
  }
  assert.match(out, /이미 켜져 있어요/);
  assert.match(out, new RegExp(`localhost:${port}`));
});
