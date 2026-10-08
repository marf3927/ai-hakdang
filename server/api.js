// 학습 지도 API. Vite 개발 서버에 미들웨어로 붙는다(vite.config.mjs). 외부 패키지 없이 Node 내장 모듈만 쓴다.
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

// 점(.)으로 시작하는 경로(.env · .git · .npmrc …)는 보여 주지 않는다. Vite 내부 경로 /@… 와 의존성 캐시 node_modules/.vite 만 예외다.
function hiddenGuard(req, res, next) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const segments = pathname.split("/").filter(Boolean);
  const hidden = segments.some((seg, i) => seg.startsWith(".") && !(seg === ".vite" && segments[i - 1] === "node_modules"));
  if (hidden) {
    res.writeHead(404).end();
    return;
  }
  next();
}

function createApi(root) {
  const meDir = path.join(root, "me");
  const quizLog = path.join(meDir, "quiz-log.jsonl");

  return (req, res, next) => {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/")) return next();

    // root: 같은 포트를 다른 폴더의 학습 지도가 쓰는지 bin/start.mjs 가 가린다(127.0.0.1 에서만 열린다).
    if (url.pathname === "/api/health") return send(res, 200, { ok: true, root });

    if (url.pathname === "/api/state" && req.method === "GET") {
      const errors = [];
      return send(res, 200, {
        root,
        roadmap: readJson(path.join(root, "data", "roadmap.json"), errors),
        prompts: readJson(path.join(root, "data", "prompts.json"), errors),
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

module.exports = { createApi, hiddenGuard };
