# AI 학당 학습 저장소

학습자 한 명의 공부 공간이다. 학습자는 개발 입문자일 수 있다 — 한국어로, 짧은 문장으로, 처음 나오는 용어는 그 자리에서 풀어 말한다.

- 공부 · 수업 · 진도 · 복습 · 단계 확인 · 로드맵 업데이트는 `hakdang` 스킬(`.agents/skills/hakdang/SKILL.md`)로 진행한다.
- `me/PROFILE.md` 가 없으면 아직 설정 전이다 — `setup/START.md` 를 따른다.
- 학습 기록은 `me/` 에만 쓴다. `data/` · `assets/` · `index.html` · `server.js` · `test/` · `setup/` · `.agents/` · `.claude/` 는 원본에서 업데이트로 덮이는 곳이라 고치지 않는다.
- `data/roadmap.json` 의 개념 id 는 `me/progress.json` 이 진도를 기록하는 키다. 원본에서 로드맵을 고칠 때 한 번 정한 id 는 바꾸지 않는다.
- 학습 지도는 `npm start` 로 켜는 로컬 서버(http://localhost:4321)다. 서버 코드를 고치면 `npm test` 를 돌린다.
- 비밀값(API 키 · 토큰 · 비밀번호)은 어떤 파일에도 쓰지 않는다.
