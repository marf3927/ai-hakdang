// 수업용 퀴즈 컴포넌트. 사용법:
// <div class="quiz" data-id="q1" data-concept="s0-path" data-answer="1" data-why="정답 해설">
//   <p>질문</p>
//   <div class="opts"><button>보기 A</button><button>보기 B</button></div>
// </div>
// data-answer 는 0부터 센다. 한 번 고르면 정답과 해설을 보여 주고, 서버로 열었으면 결과를 me/quiz-log.jsonl 에 남긴다.
document.querySelectorAll(".quiz").forEach((q, index) => {
  const answer = Number(q.dataset.answer);
  const buttons = [...q.querySelectorAll(".opts button")];
  buttons.forEach((b, i) =>
    b.addEventListener("click", () => {
      if (q.dataset.done) return;
      q.dataset.done = "1";
      buttons[answer].classList.add("right");
      if (i !== answer) b.classList.add("wrong");
      const why = document.createElement("p");
      why.className = "why";
      why.textContent = (i === answer ? "맞았어요. " : "아쉬워요. ") + (q.dataset.why || "");
      q.appendChild(why);

      if (location.protocol === "file:") return;
      fetch("/api/quiz", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lesson: location.pathname.replace(/^\//, ""),
          quiz: q.dataset.id || `q${index + 1}`,
          concept: q.dataset.concept || undefined,
          choice: i,
          correct: i === answer,
        }),
      }).catch(() => {});
    })
  );
});
