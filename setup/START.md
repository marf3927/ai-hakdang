# AI 학당 시작하기 — AI가 따라 하는 안내

이 파일은 학습자가 아니라 **AI가 읽고 진행하는 안내**다. 학습자는 README 의 시작 프롬프트를 붙여 넣었을 뿐이고, 개발이 처음일 수 있다. 각 단계에서 무엇을 왜 하는지 한두 문장으로 쉽게 말하고, 설치 · 로그인처럼 학습자 컴퓨터를 바꾸는 일은 허락을 받고 한다.

- 원본 주소: `https://github.com/marf3927/ai-hakdang`
- 만들 위치: 홈 폴더 아래 `workspace/ai-hakdang` (macOS · Linux `~/workspace/ai-hakdang`, Windows `%USERPROFILE%\workspace\ai-hakdang`)

모든 단계가 끝나면 학습자의 GitHub 계정에 **비공개 저장소** `ai-hakdang` 이 생기고, 그 복사본이 위 위치에 있고, 설문 결과가 `me/PROFILE.md` 에 저장된 상태다.

## 1. 설문

설치보다 먼저 한다. 답에 따라 이후 안내를 얼마나 자세히 할지 정한다.

설문 결과는 학습자 본인의 비공개 저장소에만 저장된다는 것을 먼저 알린다.

- **자유 입력 문항(1번 이름 · 7번 만들고 싶은 것)은 선택지 도구로 묻지 않는다.** 대화로 한 문항씩 묻고 학습자가 직접 쓰게 한다. 선택지를 주면 학습자가 보기 중에서 고르느라 자기 말을 쓰지 않는다.
- 7번 답이 "모르겠다"에 가까우면 바로 넘어가지 말고, 평소 불편했던 일 · 자주 하는 반복 작업 · 만들어 보고 싶은 화면을 한두 번 물어 한 줄로 함께 정한다. 그래도 없으면 "첫 앱은 나를 소개하는 웹 페이지로 시작하고 나중에 바꾼다"로 둔다.
- 나머지 선택형 문항(2–6 · 8번)은 선택지로 묻는 도구(Claude Code 의 AskUserQuestion 등)가 있으면 그것으로 한 번에 최대 4문항씩 묻는다. 없으면 번호 목록으로 한 번에 묻고 "2-b, 3-a 처럼 답해 주세요"라고 한다.

1. 뭐라고 부르면 될까요? (자유 입력)
2. 터미널(검은 화면에 명령을 입력하는 창)을 써 본 적이 있나요? — a. 처음 / b. 따라 해 본 적 있음 / c. 자주 씀
3. 코딩 경험은? — a. 없음 / b. 강의 · 튜토리얼을 따라 해 봄 / c. 혼자 작은 것을 만들어 봄 / d. 일로 함
4. Git · GitHub 는? — a. 처음 들음 / b. 계정만 있음 / c. 커밋 · PR 을 해 봄
5. 웹이 동작하는 방식(HTTP · API · 서버)은? — a. 처음 들음 / b. 들어 봄 / c. 남에게 설명할 수 있음
6. AI 도구는 어떻게 써 봤나요? — a. 채팅으로 질문만 / b. 코드를 받아 붙여 넣어 봄 / c. 코딩 에이전트(Claude Code · Codex)로 작업해 봄
7. 이 공부로 만들고 싶은 것은? (자유 입력. 막연해도 괜찮다고 말한다. 예: "모임 일정 알려 주는 디스코드 봇", "내 포트폴리오 사이트")
8. 일주일에 공부할 수 있는 시간은? — a. 1시간 이하 / b. 2–3시간 / c. 4시간 이상

### 수준과 시작 단계

| 수준 | 조건 | 시작 단계 |
|---|---|---|
| 입문 | 2 가 a, 또는 3 이 a | `b1` 내 컴퓨터의 작업 환경 (b0 AI와 일하는 법은 함께 간다) |
| 기초 | 입문이 아니고 5 가 a · b | `b2` 웹 서비스의 구조 |
| 경험 | 3 이 c · d 이고 4 가 c 이고 5 가 c | `b3` 데이터와 권한 — 앞 단계는 단계 확인으로 빠르게 넘긴다 |

결과를 학습자에게 한 문단으로 알려 주고("○○님은 '입문'으로, 기본 1장부터 시작해요"), 다르게 하고 싶으면 바꿀 수 있다고 말한다. 설문 결과는 4단계에서 파일로 저장할 때까지 기억해 둔다.

**입문** 수준이면 이후 단계에서 명령을 실행하기 전마다 "이 명령은 ~을 합니다"라고 한 줄씩 설명한다.

## 2. 준비물 확인

운영체제를 확인하고(`uname -s`, Windows 는 PowerShell `$env:OS`), 아래가 있는지 하나씩 본다. 없는 것만 설치를 제안한다.

| 무엇 | 확인 | 설치 |
|---|---|---|
| Git | `git --version` | macOS: `xcode-select --install` (창이 뜨면 학습자가 '설치'를 누른다) · Windows: `winget install --id Git.Git -e` |
| Node.js | `node --version` (20.19 이상) | macOS: Homebrew 가 있으면 `brew install node`, 없으면 https://nodejs.org 에서 LTS 설치 파일 · Windows: `winget install --id OpenJS.NodeJS.LTS -e` |
| GitHub CLI | `gh --version` | macOS: Homebrew 가 있으면 `brew install gh`, 없으면 https://cli.github.com 에서 내려받기 · Windows: `winget install --id GitHub.cli -e` |
| GitHub 계정 | 학습자에게 묻는다 | 없으면 https://github.com/signup 에서 만들게 하고 기다린다 |

Windows 에서 설치 직후 명령을 못 찾으면 터미널을 새로 열어야 한다고 안내한다.

## 3. GitHub 로그인

`gh auth status` 로 확인한다. 로그인이 안 되어 있으면, 이 단계는 학습자가 직접 해야 한다(브라우저에서 승인해야 해서 AI가 대신 못 한다).

- Claude Code: 입력창에 `! gh auth login` 을 입력하게 한다.
- Codex 등 그 밖: 터미널 창을 하나 더 열고 `gh auth login` 을 실행하게 한다.

선택지는 GitHub.com → HTTPS → "Login with a web browser" 를 고르고, 화면에 나온 코드를 브라우저에 입력하면 된다고 알려 준다. 끝나면 `gh auth status` 로 다시 확인한다.

## 4. 내 공부 저장소 만들기

1. 홈 폴더 아래 `workspace` 폴더를 만든다(이미 있으면 그대로 쓴다). 여기에 앞으로 모든 프로젝트를 모은다고 설명한다.
2. `workspace` 폴더 안에서 원본을 템플릿으로 삼아 비공개 저장소를 만들고 내려받는다:

   ```sh
   gh repo create ai-hakdang --template marf3927/ai-hakdang --private --clone
   ```

   같은 이름이 이미 있으면 학습자에게 알리고, 그 저장소를 쓸지(`gh repo clone ai-hakdang`) 다른 이름으로 만들지 묻는다.
3. `ai-hakdang` 폴더에서 `npm install` 로 학습 지도 화면에 필요한 부품을 설치한다(1–2분, 처음 한 번). 무엇을 하는 명령인지 한 줄로 설명한다.
4. 원본을 `upstream` 으로 등록한다(나중에 로드맵 업데이트를 받는 통로): `git remote add upstream https://github.com/marf3927/ai-hakdang.git`
5. 설문 결과를 `me/PROFILE.md` 로 저장한다:

   ```md
   # 내 프로필

   - 이름: …
   - 수준: 입문 | 기초 | 경험
   - 시작 단계: b1 …
   - 만들고 싶은 것: …
   - 주당 시간: …
   - 운영체제: macOS | Windows | Linux
   - AI 도구: Claude Code | Codex

   ## 설문 답 (원문)
   1. … 
   ```

6. `me/progress.json` 의 `learner` 를 채우고 `updated` 에 오늘 날짜를 넣는다(형식은 `.agents/skills/hakdang/PROGRESS-FORMAT.md`). `next` 에 시작 단계의 첫 개념을 넣는다.
7. `git add me && git commit -m "시작: 설문 결과" && git push`

## 5. 마무리 — 설명보다 첫 수업

긴 사용법 설명을 하지 않는다(체험에서 "너무 복잡한데 니가 해줘" 가 나왔다).

1. 학습 지도를 켜고 브라우저로 열어 준다(`npm start` → http://localhost:4321). 한 줄로만 말한다: "이게 ○○님의 학습 지도예요. 공부한 만큼 여기에 쌓여요."
2. 바로 첫 수업을 시작한다 — `ai-hakdang/.agents/skills/hakdang/SKILL.md` 를 읽고 그대로 따른다. 묻지 말고 "첫 수업을 바로 시작할게요"로 넘어간다.
3. 다음에 공부를 다시 시작하는 방법(이 폴더에서 AI를 열고 "공부하자"라고 말하기)은 첫 수업이 끝날 때 한 번만 알려 준다.
