# me/progress.js 형식

`index.html` 이 `<script>` 로 읽는 파일이다(브라우저가 file:// 에서 JSON 을 못 읽어서 `.js` 다). `window.PROGRESS = {...};` 한 문장만 둔다. 고친 뒤 아래 명령으로 문법을 확인한다(node 가 없으면 대시보드를 열어 진도가 보이는지로 확인):

```sh
node -e "global.window={};require('./me/progress.js');console.log(Object.keys(window.PROGRESS))"
```

```js
window.PROGRESS = {
  updated: "2026-10-12",                // 마지막으로 고친 날
  learner: {
    name: "지민",
    level: "입문",                      // 입문 | 기초 | 경험
    start: "s0",                        // 시작 단계 id
    goal: "모임 일정 알려 주는 디스코드 봇",
    hours: "2–3시간",
  },
  concepts: {                           // 키는 data/roadmap.js 의 개념 id. 없으면 「아직」
    "s0-terminal": "learned",           // learning = 수업 받음, learned = 확인 대화에서 증거 나옴
    "s0-path": "learning",
  },
  stages: {
    s0: { checked: "2026-10-12" },      // 단계 확인 통과한 날
  },
  lessons: [                            // 오래된 것부터
    { n: 1, title: "터미널과 첫 명령", file: "me/lessons/0001-terminal.html", date: "2026-10-10", stage: "s0", concepts: ["s0-terminal"] },
  ],
  next: { stage: "s0", title: "경로: 파일의 주소", why: "명령이 '파일 없음'으로 실패한 이유가 여기에 있다" },
};
```

- `file` 은 저장소 루트 기준 경로다(대시보드가 루트에 있다).
- `next.stage` 가 대시보드에서 현재 단계로 강조된다.
