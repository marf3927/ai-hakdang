# me/progress.json 형식

서버가 이 파일을 그대로 읽어 화면에 보여 준다. 고친 뒤 아래 명령으로 JSON 이 깨지지 않았는지 확인한다(깨지면 화면에 경고가 뜬다):

```sh
node -e "JSON.parse(require('fs').readFileSync('me/progress.json','utf8'))" && echo ok
```

```json
{
  "updated": "2026-10-12",
  "learner": {
    "name": "지민",
    "level": "입문",
    "start": "b1",
    "goal": "모임 일정 알려 주는 디스코드 봇",
    "hours": "2–3시간"
  },
  "concepts": {
    "b1-terminal": "learned",
    "b1-project": "learning"
  },
  "stages": {
    "b1": { "checked": "2026-10-12" }
  },
  "lessons": [
    { "n": 1, "title": "터미널과 첫 명령", "file": "me/lessons/0001-terminal.html", "date": "2026-10-10", "stage": "b1", "concepts": ["b1-terminal"] }
  ],
  "next": { "stage": "b1", "title": "프로젝트 · 폴더", "why": "AI가 파일을 어디에 만들었는지 알아야 결과를 확인할 수 있다" }
}
```

- `learner.level`: `입문` | `기초` | `경험`. `learner.start`: 시작 단계 id.
- `concepts` 의 키는 `data/roadmap.json` 의 개념 id 다. 없으면 「아직」. `learning` = 수업 받음, `learned` = 확인 대화에서 증거 나옴.
- `stages.<id>.checked`: 단계 확인을 통과한 날.
- `lessons`: 오래된 것부터. `file` 은 저장소 루트 기준 경로.
- `next.stage` 가 화면에서 현재 단계로 강조된다.
