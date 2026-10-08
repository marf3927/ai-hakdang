(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const LABEL = { todo: "아직", learning: "배우는 중", learned: "이해함" };
  const SPARK = `<svg class="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"/></svg>`;
  const CURSOR = `<svg class="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 9-7 2 4 8-3 1.5-4-8-5 5z"/></svg>`;
  const CHEV = `<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  $("legend-spark").innerHTML = SPARK;

  const offline = (title, body) => {
    $("next").innerHTML = `<p class="label">${CURSOR}시작하기</p><h2>${title}</h2><p class="how">${body}</p>`;
    $("me").innerHTML = `<h2>내 기록</h2><p class="muted">서버가 켜지면 여기에 진도가 나타납니다.</p>`;
  };

  if (location.protocol === "file:") {
    offline("학습 지도 서버를 켜 주세요", `터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행하고 <a href="http://localhost:4321">localhost:4321</a> 을 여세요.`);
    return;
  }

  function bar(learned, learning, total, label) {
    const a = total ? (learned / total) * 100 : 0;
    const b = total ? (learning / total) * 100 : 0;
    return `<div class="bar" role="img" aria-label="${esc(label)}"><span class="b-learned" style="width:${a}%"></span><span class="b-learning" style="width:${b}%"></span></div>`;
  }

  function render({ roadmap: R, progress, quiz, errors }) {
    if (!R) {
      offline("로드맵을 읽지 못했습니다", esc(errors.join(" ")));
      return;
    }
    const P = progress || {};
    const cs = P.concepts || {};
    const ss = P.stages || {};
    const lessons = P.lessons || [];
    const stateOf = (id) => cs[id] || "todo";
    const stageName = (id) => {
      const s = R.stages.find((x) => x.id === id);
      return s ? `${s.id.slice(1)}단계 ${s.title}` : "";
    };

    $("title").textContent = R.title;
    $("intro").textContent = R.intro;

    const all = R.stages.flatMap((s) => s.concepts);
    const nLearned = all.filter((c) => stateOf(c.id) === "learned").length;
    const nLearning = all.filter((c) => stateOf(c.id) === "learning").length;
    const right = quiz.filter((q) => q.correct).length;
    const L = P.learner;
    const warn = errors.length ? `<p class="notice">${esc(errors.join(" "))} — AI에게 "progress.json 고쳐 줘"라고 말해 보세요.</p>` : "";

    $("next").innerHTML = P.next
      ? `<p class="label">${CURSOR}다음 수업 · ${esc(stageName(P.next.stage))}</p>
         <h2>${esc(P.next.title)}</h2>
         ${P.next.why ? `<p>${esc(P.next.why)}</p>` : ""}
         <p class="how">AI에게 "다음 수업"이라고 말하면 시작합니다.</p>`
      : `<p class="label">${CURSOR}첫 수업</p>
         <h2>AI 선생님을 불러 보세요</h2>
         <p class="how">이 폴더에서 Claude Code 는 <code>/hakdang</code>, Codex 는 <code>$hakdang</code>.</p>`;

    $("me").innerHTML = L
      ? `<h2>${esc(L.name)}님의 기록</h2>
         <p class="muted small">${esc(L.level)} · 주 ${esc(L.hours || "—")}</p>
         ${L.goal ? `<p class="small">만들고 싶은 것 <b>${esc(L.goal)}</b></p>` : ""}
         <p class="me-num"><strong>${nLearned}</strong><span class="muted">/ ${all.length} 개념 이해</span></p>
         ${bar(nLearned, nLearning, all.length, `전체 ${all.length}개 중 ${nLearned}개 이해함`)}
         <p class="muted small">${quiz.length ? `퀴즈 ${quiz.length}문제 중 ${right}문제 정답` : "아직 푼 퀴즈 없음"}${P.updated ? ` · 갱신 ${esc(P.updated)}` : ""}</p>${warn}`
      : `<h2>아직 시작 전</h2><p class="small">첫 수업이 끝나면 여기에 진도가 쌓입니다.</p>${warn}`;

    const currentId = (P.next && P.next.stage) || (L && L.start) || R.stages[0].id;
    const milestones = (id) =>
      R.projects
        .filter((p) => p.after === id)
        .map((p) => {
          const done = ss[p.after] && ss[p.after].checked;
          return `<li class="milestone${done ? " is-done" : ""}"><span class="pin" aria-hidden="true"></span><p><b>${done ? "만들 수 있어요" : "여기까지 오면"}</b> · ${esc(p.what)}</p></li>`;
        })
        .join("");

    $("path").innerHTML = R.stages
      .map((s) => {
        const total = s.concepts.length;
        const learned = s.concepts.filter((c) => stateOf(c.id) === "learned").length;
        const learning = s.concepts.filter((c) => stateOf(c.id) === "learning").length;
        const checked = ss[s.id] && ss[s.id].checked;
        const current = s.id === currentId;
        const cls = `${current ? " is-current" : ""}${checked ? " is-checked" : ""}`;
        return `<li class="stop${cls}" id="${s.id}">
          <span class="node" aria-hidden="true">${checked ? SPARK : s.id.slice(1)}</span>
          <details class="stage"${current ? " open" : ""}>
            <summary>
              <h3>${esc(s.title)}${current ? '<span class="sr-only"> (지금 단계)</span>' : ""}</h3>
              <span class="count${checked ? " is-pass" : ""}">${checked ? `${SPARK} 통과 ${esc(checked)}` : `${learned}/${total}`} ${CHEV}</span>
              ${bar(learned, learning, total, `${total}개 중 ${learned}개 이해함`)}
            </summary>
            <div class="stage-body">
              ${s.goal ? `<p class="goal">${esc(s.goal)}</p>` : ""}
              <ul class="concepts">${s.concepts
                .map((c) => {
                  const st = stateOf(c.id);
                  return `<li class="c ${st}"><span class="dot">${st === "learned" ? SPARK : ""}</span>
                    <div><strong>${esc(c.name)}</strong><span class="state">${LABEL[st]}</span>
                    <p>${esc(c.desc)}</p><p class="q">검색어 · ${esc(c.q)}</p></div></li>`;
                })
                .join("")}</ul>
              <p class="terms"><b>더 알아둘 용어</b>${s.terms.map(esc).join(" · ")}</p>
              <p class="check"><b>확인</b>${esc(s.check)}</p>
            </div>
          </details>
        </li>${milestones(s.id)}`;
      })
      .join("");

    $("lessons").innerHTML = `<h2>내 수업</h2>${
      lessons.length
        ? `<ol class="ledger">${lessons
            .slice()
            .reverse()
            .map((l) => `<li><a href="/${esc(l.file)}">${esc(l.title)}</a><span class="muted small">${esc(l.date || "")} · ${esc(stageName(l.stage))}</span></li>`)
            .join("")}</ol>`
        : `<p class="muted small">아직 없어요. 첫 수업이 여기에 쌓입니다.</p>`
    }`;
  }

  async function load() {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      render(await res.json());
    } catch {
      offline("학습 지도 서버가 꺼져 있습니다", `터미널에서 이 폴더로 가서 <code>npm start</code> 를 실행한 뒤 새로 고치세요.`);
    }
  }

  load();
  window.addEventListener("focus", load);
})();
