// 내 학습 지도 서버. 외부 패키지 없이 Node 내장 모듈만 쓴다 — 입문자가 npm install 없이 바로 띄우게.
// 화면이 고치는 파일은 me/quiz-log.jsonl 하나뿐이다. 진도 · 기록은 AI(hakdang 스킬)만 고친다.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

function readJson(file, errors) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") errors.push(`${path.basename(file)} 을 읽지 못했습니다: ${e.message}`);
    return null;
  }
}

function readQuizLog(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

function validQuiz(b) {
  const str = (v) => typeof v === "string" && v.length > 0 && v.length <= 200;
  return (
    b &&
    typeof b === "object" &&
    str(b.lesson) &&
    str(b.quiz) &&
    (b.concept === undefined || str(b.concept)) &&
    Number.isInteger(b.choice) &&
    typeof b.correct === "boolean"
  );
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function createServer(root) {
  const meDir = path.join(root, "me");
  const quizLog = path.join(meDir, "quiz-log.jsonl");

  function state() {
    const errors = [];
    return {
      roadmap: readJson(path.join(root, "data", "roadmap.json"), errors),
      progress: readJson(path.join(meDir, "progress.json"), errors),
      quiz: readQuizLog(quizLog),
      errors,
    };
  }

  function staticFile(urlPath, res) {
    let rel;
    try {
      rel = decodeURIComponent(urlPath);
    } catch {
      return send(res, 400, { error: "잘못된 주소" });
    }
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.resolve(root, "." + path.posix.normalize("/" + rel));
    const inside = file.startsWith(root + path.sep);
    const hidden = path.relative(root, file).split(path.sep).some((seg) => seg.startsWith("."));
    if (!inside || hidden || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return send(res, 404, "찾을 수 없습니다", "text/plain; charset=utf-8");
    }
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
  }

  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/api/health") return send(res, 200, { ok: true });
    if (url.pathname === "/api/state" && req.method === "GET") return send(res, 200, state());

    if (url.pathname === "/api/quiz" && req.method === "POST") {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
        if (raw.length > 4096) req.destroy();
      });
      req.on("end", () => {
        let body;
        try {
          body = JSON.parse(raw);
        } catch {
          return send(res, 400, { error: "JSON 이 아닙니다" });
        }
        if (!validQuiz(body)) return send(res, 400, { error: "lesson · quiz · choice · correct 가 필요합니다" });
        const row = { at: new Date().toISOString(), lesson: body.lesson, quiz: body.quiz, concept: body.concept, choice: body.choice, correct: body.correct };
        fs.mkdirSync(meDir, { recursive: true });
        fs.appendFileSync(quizLog, JSON.stringify(row) + "\n");
        res.writeHead(204).end();
      });
      return;
    }

    if (req.method !== "GET") return send(res, 405, { error: "지원하지 않는 요청" });
    staticFile(url.pathname, res);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4321;
  const server = createServer(__dirname);
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log(`이미 ${port} 번 포트에서 무언가 실행 중입니다. 학습 지도가 이미 켜져 있다면 http://localhost:${port} 을 여세요.`);
      process.exit(0);
    }
    throw e;
  });
  // 127.0.0.1 에만 연다 — 같은 와이파이의 다른 컴퓨터에서는 내 기록을 볼 수 없다.
  server.listen(port, "127.0.0.1", () => {
    console.log(`내 학습 지도: http://localhost:${port}  (끄려면 Ctrl+C)`);
  });
}

module.exports = { createServer };
