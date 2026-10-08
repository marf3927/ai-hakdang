(function () {
  const R = window.ROADMAP;
  const P = window.PROGRESS || {};
  const conceptState = P.concepts || {};
  const stageState = P.stages || {};
  const lessons = P.lessons || [];

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const LABEL = { todo: "아직", learning: "배우는 중", learned: "이해함" };
  const stateOf = (id) => conceptState[id] || "todo";

  function stageCounts(stage) {
    const total = stage.concepts.length;
    const learned = stage.concepts.filter((c) => stateOf(c.id) === "learned").length;
    const learning = stage.concepts.filter((c) => stateOf(c.id) === "learning").length;
    return { total, learned, learning };
  }

  function bar(learned, learning, total) {
    const a = total ? (learned / total) * 100 : 0;
    const b = total ? (learning / total) * 100 : 0;
    return `<div class="bar" role="img" aria-label="${learned}/${total} 이해함">
      <span class="bar-learned" style="width:${a}%"></span><span class="bar-learning" style="width:${b}%"></span></div>`;
  }

  $("title").textContent = R.title;
  $("intro").textContent = R.intro;

  // 내 상태
  const all = R.stages.flatMap((s) => s.concepts);
  const learnedAll = all.filter((c) => stateOf(c.id) === "learned").length;
  const learningAll = all.filter((c) => stateOf(c.id) === "learning").length;
  const L = P.learner;
  $("me").innerHTML = L
    ? `<div class="me-grid">
        <div>
          <h2>${esc(L.name)}님의 학습</h2>
          <p class="muted">수준: ${esc(L.level)} · 시작 단계: ${esc(stageTitle(L.start))}${L.hours ? ` · 주 ${esc(L.hours)}` : ""}</p>
          ${L.goal ? `<p>만들고 싶은 것: <strong>${esc(L.goal)}</strong></p>` : ""}
        </div>
        <div class="me-num"><span class="big">${learnedAll}</span><span class="muted">/ ${all.length} 개념 이해</span></div>
      </div>
      ${bar(learnedAll, learningAll, all.length)}
      ${P.next ? `<p class="next">다음 수업: <strong>${esc(P.next.title)}</strong>${P.next.why ? ` — <span class="muted">${esc(P.next.why)}</span>` : ""}</p>` : ""}
      ${P.updated ? `<p class="muted small">갱신: ${esc(P.updated)}</p>` : ""}`
    : `<h2>아직 시작 전</h2>
       <p>이 폴더에서 AI(Claude Code 또는 Codex)를 열고 <code>/hakdang</code> 또는 <code>$hakdang</code>을 입력하세요. 첫 수업이 끝나면 여기에 진도가 나타납니다.</p>`;

  function stageTitle(id) {
    const s = R.stages.find((x) => x.id === id);
    return s ? `${s.id.slice(1)}. ${s.title}` : "—";
  }

  // 단계
  $("stages").innerHTML = R.stages
    .map((s) => {
      const n = stageCounts(s);
      const checked = stageState[s.id] && stageState[s.id].checked;
      const current = L && P.next && P.next.stage === s.id;
      return `<article class="stage${current ? " current" : ""}" id="${s.id}">
        <header class="stage-head">
          <h2><span class="num">${s.id.slice(1)}</span>${esc(s.title)}</h2>
          <span class="badge${checked ? " done" : ""}">${checked ? `확인 통과 · ${esc(checked)}` : `${n.learned}/${n.total}`}</span>
        </header>
        ${bar(n.learned, n.learning, n.total)}
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

  // 만들어 볼 것
  $("projects").innerHTML = `<h2>단계별로 만들어 볼 것</h2><ol class="projects">${R.projects
    .map((p) => {
      const done = stageState[p.after] && stageState[p.after].checked;
      return `<li class="${done ? "done" : ""}"><span class="muted">${esc(stageTitle(p.after))} 이후</span> ${esc(p.what)}</li>`;
    })
    .join("")}</ol>`;

  // 수업 목록
  $("lessons").innerHTML = lessons.length
    ? `<h2>내 수업</h2><ol class="lessons">${lessons
        .slice()
        .reverse()
        .map(
          (l) =>
            `<li><a href="${esc(l.file)}">${esc(l.title)}</a> <span class="muted">${esc(l.date || "")} · ${esc(stageTitle(l.stage))}</span></li>`
        )
        .join("")}</ol>`
    : "";
})();
