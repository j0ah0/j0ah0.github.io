---
layout: default
title: Main
permalink: /
---
<div class="main-page">
<p>Main - 지금 보고 있는 이 휑한 페이지</p>

<p>I am - 저는 이런 사람입니다</p>

<p>Log - 일상 게시판</p>

<p>Board - 방명록</p>

<p>Mail to - 메일을 자주 확인하는 건 아니지만 할 말이 있으면 보내주세요</p>
</div>

<style>
  /* /i-am/ 프로필 글과 같은 폰트 (log-app-src/src/App.jsx FONT_URL 과도 동일) */
  @font-face {
    font-family: 'Inter';
    src: url('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff') format('woff');
    font-weight: 400; font-display: swap;
  }

  .main-page { margin-top: 35vh; margin-left: -10px; font-family: 'Inter', -apple-system, "Helvetica Neue", Arial, sans-serif; }
  @media (max-width: 700px) {
    /* 데스크톱용 -10px 왼쪽 이동이 모바일 좁은 화면에서는 그대로 더해져
       텍스트가 눈에 띄게 왼쪽으로 치우쳐 보였다 — 모바일에서만 원래
       위치(0)로 되돌리고 살짝 더 오른쪽(6px)으로 준다. */
    .main-page { margin-top: 25vh; margin-left: 6px; }
  }
  .main-page p { font-size: 12px; line-height: 1.7; margin: 0 0 16px; }
</style>
