# AI 학당 — 내 학습 지도

AI 학당 멤버가 개발 기초를 **AI 선생님과 함께** 혼자 공부하는 저장소입니다.

- 로드맵: 컴퓨터 → 웹 → 코드 → Git → 데이터 → 배포 → 자동화, 그리고 처음부터 함께 가는 「AI와 개발」까지 8단계
- 수업: AI가 내 수준과 만들고 싶은 것에 맞춰 10–15분짜리 수업을 하나씩 만들어 줍니다
- 진도: `npm start` 로 내 컴퓨터에 작은 서버를 켜고 http://localhost:4321 을 열면 내가 어디까지 왔는지 보입니다. 수업 속 퀴즈 결과도 기록됩니다

이 저장소는 **템플릿**입니다. 각자 자기 GitHub 계정에 비공개 복사본을 만들어 쓰고, 공부 기록은 거기에 쌓입니다.

## 시작하기

### 1. AI 코딩 도구 설치

둘 중 하나를 설치하고 로그인합니다.

- **Claude Code** — https://code.claude.com/docs/en/setup (Claude Pro 이상 구독 필요)
- **Codex** — https://developers.openai.com/codex/cli (ChatGPT 계정으로 로그인)

### 2. 시작 프롬프트 붙여 넣기

터미널을 열고 `claude` 또는 `codex` 를 실행한 뒤, 아래를 그대로 붙여 넣습니다.

```text
AI 학당 공부를 시작하려고 해. https://raw.githubusercontent.com/marf3927/ai-hakdang/main/setup/START.md 를 내려받아 읽고(curl 이나 웹 읽기 도구로), 거기 적힌 순서대로 나와 함께 진행해 줘. 나는 개발이 처음일 수 있으니 쉬운 말로 설명해 줘.
```

AI가 먼저 간단한 설문으로 수준을 확인하고, 필요한 프로그램을 확인하고, `~/workspace/ai-hakdang` 에 내 공부 저장소를 만들어 줍니다. GitHub 로그인 한 번은 직접 해야 합니다 — AI가 방법을 알려 줍니다.

### 3. 공부하기

```sh
cd ~/workspace/ai-hakdang
npm start   # 학습 지도 켜기 → http://localhost:4321 (AI가 대신 켜 주기도 합니다)
claude      # 그리고 /hakdang
codex       # 또는 이것, 그리고 $hakdang
```

"공부하자", "다음 수업", "이 단계 확인해 줘", "복습하고 싶어"처럼 말해도 됩니다.

## 폴더 구조

```
ai-hakdang/
  server.js         학습 지도 서버 (npm start → http://localhost:4321)
  index.html        내 학습 지도 화면
  data/roadmap.json 로드맵 — 단계 · 개념 · 용어 · 확인 기준
  me/               내 공부 기록 — 설문, 진도, 수업, 용어집
  setup/START.md    처음 설정할 때 AI가 읽는 안내
  .agents/skills/hakdang   AI 선생님 스킬 (Claude Code 는 .claude/skills 를 거쳐 읽음)
```

## 로드맵 업데이트 받기

AI에게 "로드맵 업데이트 받아 줘"라고 하면 원본에서 로드맵 · 화면 · 스킬만 받아오고 `me/` 의 기록은 그대로 둡니다.

## 만든 방식

수업 진행 방식은 Matt Pocock 의 [`teach` 스킬](https://github.com/mattpocock/skills)을 참고해 AI 학당 로드맵에 맞게 다시 썼습니다.
