(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const LABEL = { todo: "아직", learning: "배우는 중", learned: "이해함" };

  if (location.protocol === "file:") {
    $("me").innerHTML = `<h2>학습 지도 서버를 켜 주세요</h2>
      <p>이 화면은 서버로 열어야 내 기록이 보입니다. 터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행하고 <a href="http://localhost:4321">http://localhost:4321</a> 을 여세요.</p>`;
    return;
  }

  function bar(learned, learning, total) {
    const a = total ? (learned / total) * 100 : 0;
    const b = total ? (learning / total) * 100 : 0;
    return `<div class="bar" role="img" aria-label="${learned}/${total} 이해함">
      <span class="bar-learned" style="width:${a}%"></span><span class="bar-learning" style="width:${b}%"></span></div>`;
  }

  function render({ roadmap: R, progress, quiz, errors }) {
    if (!R) {
      $("me").innerHTML = `<h2>로드맵을 읽지 못했습니다</h2><p>${esc(errors.join(" "))}</p>`;
      return;
    }
    const P = progress || {};
    const conceptState = P.concepts || {};
    const stageState = P.stages || {};
    const lessons = P.lessons || [];
    const stateOf = (id) => conceptState[id] || "todo";
    const stageTitle = (id) => {
      const s = R.stages.find((x) => x.id === id);
      return s ? `${s.id.slice(1)}. ${s.title}` : "—";
    };

    $("title").textContent = R.title;
    $("intro").textContent = R.intro;

    const all = R.stages.flatMap((s) => s.concepts);
    const learnedAll = all.filter((c) => stateOf(c.id) === "learned").length;
    const learningAll = all.filter((c) => stateOf(c.id) === "learning").length;
    const right = quiz.filter((q) => q.correct).length;
    const L = P.learner;
    const warn = errors.length ? `<p class="next">${esc(errors.join(" "))} — AI에게 "progress.json 고쳐 줘"라고 말해 보세요.</p>` : "";

    $("me").innerHTML = L
      ? `<div class="me-grid">
          <div>
            <h2>${esc(L.name)}님의 학습</h2>
            <p class="muted">수준: ${esc(L.level)} · 시작 단계: ${esc(stageTitle(L.start))}${L.hours ? ` · 주 ${esc(L.hours)}` : ""}</p>
            ${L.goal ? `<p>만들고 싶은 것: <strong>${esc(L.goal)}</strong></p>` : ""}
          </div>
          <div class="me-num"><span class="big">${learnedAll}</span><span class="muted">/ ${all.length} 개념 이해</span>
            ${quiz.length ? `<p class="muted small">퀴즈 ${quiz.length}문제 · 정답 ${right}</p>` : ""}</div>
        </div>
        ${bar(learnedAll, learningAll, all.length)}
        ${P.next ? `<p class="next">다음 수업: <strong>${esc(P.next.title)}</strong>${P.next.why ? ` — <span class="muted">${esc(P.next.why)}</span>` : ""}</p>` : ""}
        ${P.updated ? `<p class="muted small">갱신: ${esc(P.updated)}</p>` : ""}${warn}`
      : `<h2>아직 시작 전</h2>
         <p>이 폴더에서 AI(Claude Code 또는 Codex)를 열고 <code>/hakdang</code> 또는 <code>$hakdang</code>을 입력하세요. 첫 수업이 끝나면 여기에 진도가 나타납니다.</p>${warn}`;

    $("stages").innerHTML = R.stages
      .map((s) => {
        const total = s.concepts.length;
        const learned = s.concepts.filter((c) => stateOf(c.id) === "learned").length;
        const learning = s.concepts.filter((c) => stateOf(c.id) === "learning").length;
        const checked = stageState[s.id] && stageState[s.id].checked;
        const current = P.next && P.next.stage === s.id;
        return `<article class="stage${current ? " current" : ""}" id="${s.id}">
          <header class="stage-head">
            <h2><span class="num">${s.id.slice(1)}</span>${esc(s.title)}</h2>
            <span class="badge${checked ? " done" : ""}">${checked ? `확인 통과 · ${esc(checked)}` : `${learned}/${total}`}</span>
          </header>
          ${bar(learned, learning, total)}
          ${s.goal ? `<p class="muted">${esc(s.goal)}</p>` : ""}
          <ul class="concepts">
            ${s.concepts
              .map((c) => {
                const st = stateOf(c.id);
                return `<li class="c ${st}">
                  <span class="dot" title="${LABEL[st]}"></span>
                  <div><strong>${esc(c.name)}</strong> <span class="state">${LABEL[st]}</span>
                  <p>${esc(c.desc)}</p>
                  <p class="q">검색어: ${esc(c.q)}</p></div></li>`;
              })
              .join("")}
          </ul>
          <details><summary>더 알아둘 용어 ${s.terms.length}개</summary><p class="terms">${s.terms.map(esc).join(" · ")}</p></details>
          <p class="check"><span>확인</span>${esc(s.check)}</p>
        </article>`;
      })
      .join("");

    $("projects").innerHTML = `<h2>단계별로 만들어 볼 것</h2><ol class="projects">${R.projects
      .map((p) => {
        const done = stageState[p.after] && stageState[p.after].checked;
        return `<li class="${done ? "done" : ""}"><span class="muted">${esc(stageTitle(p.after))} 이후</span> ${esc(p.what)}</li>`;
      })
      .join("")}</ol>`;

    $("lessons").innerHTML = lessons.length
      ? `<h2>내 수업</h2><ol class="lessons">${lessons
          .slice()
          .reverse()
          .map((l) => `<li><a href="/${esc(l.file)}">${esc(l.title)}</a> <span class="muted">${esc(l.date || "")} · ${esc(stageTitle(l.stage))}</span></li>`)
          .join("")}</ol>`
      : "";
  }

  async function load() {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      render(await res.json());
    } catch {
      $("me").innerHTML = `<h2>학습 지도 서버가 꺼져 있습니다</h2><p>터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행한 뒤 이 페이지를 새로 고치세요.</p>`;
    }
  }

  load();
  window.addEventListener("focus", load);
})();
