// npm start — 학습 지도를 켠다. 이미 켜져 있으면 영어 오류 대신 한국어로 알려 주고 끝낸다.
import fs from "node:fs";
import net from "node:net";
import { fileURLToPath } from "node:url";
import path from "node:path";

const port = Number(process.env.PORT) || 4321;
const url = `http://localhost:${port}`;
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// 그 포트에 학습 지도가 떠 있으면 어느 폴더의 것인지 돌려준다. 아니면 null.
async function runningStudyMap() {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(1500) });
    const body = res.ok ? await res.json() : null;
    return body?.ok === true ? body.root || "" : null;
  } catch {
    return null;
  }
}

const same = (a, b) => {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return false;
  }
};

function portIsBusy() {
  return new Promise((resolve) => {
    const s = net.createServer().once("error", () => resolve(true)).once("listening", () => s.close(() => resolve(false)));
    s.listen(port, "127.0.0.1");
  });
}

const runningRoot = await runningStudyMap();
if (runningRoot !== null) {
  if (same(runningRoot, root)) {
    console.log(`학습 지도는 이미 켜져 있어요 → ${url}`);
    process.exit(0);
  }
  console.log(`${port} 번 포트에는 다른 폴더(${runningRoot || "알 수 없음"})의 학습 지도가 켜져 있어요. 그 창에서 Ctrl+C 로 끄거나, PORT=4322 npm start 처럼 다른 번호로 켜세요.`);
  process.exit(1);
}
if (await portIsBusy()) {
  console.log(`${port} 번 포트를 다른 프로그램이 쓰고 있어요. 그 프로그램을 끄거나 PORT=4322 npm start 처럼 다른 번호로 켜세요.`);
  process.exit(1);
}

const { createServer } = await import("vite");
const server = await createServer({ root, configFile: path.join(root, "vite.config.mjs"), server: { port } });
await server.listen();
console.log(`\n  내 학습 지도: ${url}  (끄려면 Ctrl+C)\n`);
