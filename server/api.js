// 학습 지도 API. Vite 개발 서버에 미들웨어로 붙는다(vite.config.js). 외부 패키지 없이 Node 내장 모듈만 쓴다.
// 화면이 고치는 파일은 me/quiz-log.jsonl 하나뿐이다. 진도 · 기록은 AI(hakdang 스킬)만 고친다.
const fs = require("node:fs");
const path = require("node:path");

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

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
}

// /api/* 만 처리하고 나머지는 next() 로 넘긴다.
function createApi(root) {
  const meDir = path.join(root, "me");
  const quizLog = path.join(meDir, "quiz-log.jsonl");

  return (req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/")) return next();

    if (url.pathname === "/api/health") return send(res, 200, { ok: true });

    if (url.pathname === "/api/state" && req.method === "GET") {
      const errors = [];
      return send(res, 200, {
        roadmap: readJson(path.join(root, "data", "roadmap.json"), errors),
        progress: readJson(path.join(meDir, "progress.json"), errors),
        quiz: readQuizLog(quizLog),
        errors,
      });
    }

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

    send(res, 404, { error: "없는 API" });
  };
}

module.exports = { createApi };
