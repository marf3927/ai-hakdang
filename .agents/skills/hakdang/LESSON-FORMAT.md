# 수업 HTML 형식

수업 하나 = `me/lessons/NNNN-<영문-소문자-슬러그>.html` 파일 하나. 번호는 기존 최댓값 + 1.

## 담을 것 (이 순서로)

1. **왜 지금** — 학습자의 「만들고 싶은 것」과 이 개념이 어떻게 이어지는지 2–3문장.
2. **구조도** — 이 개념이 큰 그림의 어디에 있는지 보여 주는 그림 하나(인라인 SVG 상자 · 화살표, 또는 표). 그다음 꼭 필요한 만큼만 설명. 주장마다 출처 링크.
3. **해 보기** — 코딩이 아니라 관찰 · 그리기 · 맡겨 보기 중 하나. 예: 브라우저 개발자 도구로 요청 구경하기, 자주 쓰는 서비스의 구조를 종이에 그리기, AI에게 작은 것을 만들게 하고 "어떤 부품으로 나눴는지 설명해 줘"라고 묻기. 명령이 필요하면 복사할 수 있게 `<pre><code>` 로 주고 무엇을 하는 명령인지 한 줄만. 무엇이 보이면 성공인지 적는다.
4. **퀴즈** — 2–4문제, `assets/quiz.js` 사용. 문제마다 `data-id`(q1, q2 …)와 그 문제가 확인하는 개념 id 를 `data-concept` 에 단다 — 결과가 `me/quiz-log.jsonl` 에 그 개념으로 쌓인다. 보기들은 길이와 말투를 맞춰서 모양으로 정답이 드러나지 않게 한다. 외운 것을 고르는 문제보다 상황에 적용하는 문제.
5. **원문 읽기** — 이 주제의 가장 좋은 1차 자료 하나(`class="source"`).
6. **물어보기** — "모르는 부분은 AI에게 그대로 물어보세요. 예: '…'" 처럼 이 수업에 맞는 질문 예시 하나(`class="ask"`).
7. 이전 · 다음 수업과 대시보드(`../../index.html`) 링크.

## 뼈대

공용 스타일과 컴포넌트를 쓴다. 색 · 글꼴 · 간격은 저장소 루트 `design.md` 의 학당 디자인 시스템을 따르고, 값은 `assets/tokens.css` 의 이름(`var(--color-lavender)` 등)으로만 쓴다. 새로 필요한 컴포넌트가 다음 수업에도 쓰일 만하면 `assets/` 에 따로 만들지 말고 학습자 저장소의 `me/assets/` 에 만든다(`assets/` 는 업데이트 때 원본으로 덮인다).

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>0001 · 터미널과 첫 명령</title>
  <link rel="icon" href="../../assets/brand/favicon.png">
  <script src="../../assets/theme.js"></script>
  <link rel="stylesheet" href="../../assets/style.css">
</head>
<body>
<header class="night lesson-top">
  <div class="wrap">
    <img src="../../assets/brand/icon.png" alt="" width="40" height="40">
    <p class="crumbs"><a href="../../index.html">내 학습 지도</a> · 0단계 컴퓨터와 작업 환경</p>
  </div>
</header>
<article class="lesson">
  <h1>터미널과 첫 명령</h1>

  <h2>왜 지금</h2>
  <p>…</p>

  <h2>해 보기</h2>
  <ol><li>…<pre><code>pwd</code></pre></li></ol>

  <div class="quiz" data-id="q1" data-concept="b1-terminal" data-answer="1" data-why="…">
    <p>…</p>
    <div class="opts"><button>…</button><button>…</button><button>…</button></div>
  </div>

  <div class="source"><strong>원문 읽기</strong> <a href="…">…</a></div>
  <div class="ask"><strong>물어보기</strong> …</div>

  <p class="lesson-nav"><a href="../../index.html">← 학습 지도</a><a href="0002-….html">다음 수업 →</a></p>
</article>
<script src="../../assets/quiz.js"></script>
</body>
</html>
```
