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

  .main-page { margin-top: 22vh; font-family: 'Inter', -apple-system, "Helvetica Neue", Arial, sans-serif; }
  .main-page p { font-size: 13px; line-height: 1.7; margin: 0 0 16px; }
</style>
