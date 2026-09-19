# j0ah0.github.io

GitHub Pages(Jekyll) 기반 개인 블로그. https://j0ah0.github.io

## 메뉴 구조

- **Main** (`index.md`) — 첫 페이지
- **I am** (`i-am.md`) — 자기소개
- **Log** (`log.md`) — 글 목록 (자동으로 `_posts/` 글이 나열됨)
- **Board** (`board.md`) — 방명록 (giscus, GitHub Discussions 기반 무료 댓글)
- **Mail to** — `mailto:` 링크 (헤더 nav, 별도 페이지 없음)

## 새 글 쓰는 법

날짜(월/일)는 글을 올린 날 기준(서울 시간, `Asia/Seoul`)으로 파일명 날짜에서 자동으로 표시됨. 글에 날짜를 따로 적지 않음.

1. 터미널에서 `./new-post.sh "글 제목"` 실행 → 오늘(서울) 날짜로 `_posts/YYYY-MM-DD-….md` 가 만들어짐
2. 그 파일 아래쪽에 마크다운으로 본문 작성
3. `git add`, `git commit`, `git push` 하면 몇 분 안에 https://j0ah0.github.io 에 자동 반영됨

## Board(방명록) 최초 설정 (한 번만)

1. https://github.com/apps/giscus/installations/new 접속
2. `j0ah0.github.io` 저장소 선택 후 설치 승인
3. 이후 `/board/` 페이지에서 GitHub 로그인한 사람이면 누구나 댓글(방명록) 작성 가능
