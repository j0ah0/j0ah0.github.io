---
layout: default
title: Board
permalink: /board/
---

<div id="gb-auth" class="gb-auth"></div>

<div id="gb-app">
  <!-- gb-pages는 비어서 시작한다. JS가 글/답글을 화면 높이 기준 "페이지"
       (.gb-flow) 단위로 나눠서 채운다 - 한 페이지의 단을 위→아래로 다 채운 뒤에야
       다음 단으로, 그것도 다 차면 다음 페이지로 넘어가는 잡지 지면 방식.
       (모바일에서는 --gb-cols:1 + height:auto라 사실상 그냥 이어지는 세로 스크롤이 된다.) -->
  <div id="gb-pages" class="gb-pages"></div>

  <!-- 작성 폼: 더 이상 글 목록의 일부가 아니라 화면 하단에 항상 고정된다
       (아이메시지 같은 대화창 느낌). #gb-app의 자식으로 둬서 --gb-nav-space 같은
       CSS 변수는 그대로 물려받지만, 실제 화면 위치는 position:fixed로 따로 잡는다.
       관리자로 로그인하면 숨겨진다 - 방문자용 글쓰기라서 본인이 쓸 일이 없다. -->
  <form id="gb-form" class="gb-form" autocomplete="off">
    <!-- autocomplete="off" 만으로는 크롬이 "name" 같은 흔한 필드는 계속 무시하고
         자동완성 후보창을 띄운다. readonly로 시작해서 실제로 포커스가 들어온
         순간에만 편집 가능하게 풀어주면 - 크롬이 페이지 로드 시점에 읽기전용으로
         본 필드는 자동완성 대상에서 아예 제외한다.
         (진단 결과 이 트릭은 흰 화면의 원인이 아닌 것으로 확인돼서 복원함.) -->
    <input type="text" id="gb-name" class="gb-form-name" placeholder="name" maxlength="20" required aria-label="닉네임" autocomplete="off" readonly onfocus="this.removeAttribute('readonly')">
    <div class="gb-form-main">
      <div class="gb-form-content-row">
        <textarea id="gb-content" placeholder="content" maxlength="500" rows="1" required aria-label="내용" autocomplete="off" readonly onfocus="this.removeAttribute('readonly')"></textarea>
        <button type="submit" id="gb-submit" aria-label="등록">→</button>
      </div>
      <div class="gb-form-bottom">
        <label class="gb-secret" title="비밀글"><input type="checkbox" id="gb-secret" aria-label="비밀글"><span aria-hidden="true">🔒</span><span class="gb-secret-label">secret?</span></label>
        <!-- type="password"를 쓰면 크롬/사파리가 이 form을 로그인/회원가입 폼으로
             오인해서 이름/내용 칸에도 자동완성·저장된 비밀번호 제안을 띄운다. 실제로는
             4자리 숫자 PIN일 뿐이라 type="text" + -webkit-text-security로 점(dot)
             마스킹만 흉내낸다. autocomplete="off"는 사파리가 그냥 무시하고 자기
             나름대로 "이건 비밀번호칸"이라고 추측해버리는 경우가 있어서, 대신 "이건
             일회성 숫자 코드칸"이라는 뜻의 정식 값인 one-time-code를 준다 - 사파리가
             비밀번호 자동완성 시트 대신 훨씬 가벼운 문자 코드 제안만 하거나 아예
             아무것도 안 띄우게 된다. -->
        <input type="text" id="gb-code" class="gb-pin-mask" placeholder="····" maxlength="4" inputmode="numeric" pattern="[0-9]{4}" autocomplete="one-time-code" aria-label="4자리 숫자 코드" title="4자리 숫자 코드">
      </div>
    </div>
  </form>
</div>

<style>
  /* 한 곳에서 조절:
     --gb-edge 화면 가장자리 여백(코너 nav와 같은 28px) / --gb-who 이름 칸 너비 /
     --gb-cols 한 페이지의 단 수 / --gb-colgap 단 사이 간격 /
     --gb-size 글자 크기 / --gb-lh 줄 간격 /
     --gb-nav-space, --gb-form-space는 안전한 기본값일 뿐 - JS(measureReservedSpace)가
     실제 코너 네비 높이와 입력창 높이를 매번 측정해서 정확한 값으로 덮어쓴다. */
  #gb-app { --gb-edge: 28px; --gb-who: 66px; --gb-gap: 10px; --gb-cols: 4; --gb-colgap: 40px; --gb-size: 12px; --gb-lh: 1.35; --gb-item-gap: 1.2em; --gb-nav-space: 60px; --gb-form-space: 90px; --gb-top-space: 40px; }

  /* 테마의 가운데 정렬 컨테이너(.wrap, max-width 720px)를 뚫고 화면 양끝까지 채운다.
     margin만으로는 부모가 flex/grid일 때 자식이 shrink-to-fit으로 굳을 수 있어서
     width: 100vw를 직접 박아 폭을 강제하고, 가장자리 여백은 padding으로 준다.
     코너 nav(Main/I am/Log...)가 뷰포트 기준 28px에 고정돼 있어서 --gb-edge를 맞춰뒀다. */
  .gb-auth,
  #gb-app {
    box-sizing: border-box;
    width: 100vw;
    max-width: 100vw;
    margin-inline: calc(50% - 50vw);
    padding-inline: var(--gb-edge);
  }
  body { overflow-x: clip; }

  .gb-auth { text-align: right; font-size: 12px; color: var(--muted); margin-bottom: 14px; min-height: 20px; }
  .gb-auth button { font: inherit; font-size: 12px; border: none; background: none; color: var(--muted); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .gb-auth button:hover { color: var(--text); }
  /* 완전히 안 보이게 - 글씨색을 배경색과 똑같이 만들어서 존재만 하고 안 보인다.
     opacity:0은 아니라서 클릭(=로그인)은 여전히 된다. */
  #gb-login { color: var(--bg); text-decoration: none; }

  /* ---- 대화 목록: 신문/잡지 지면처럼, 화면 높이만큼을 한 "페이지"로 써서
     단을 위→아래로 다 채운 뒤 다음 단으로, 페이지가 다 차면 다음 페이지로 ----
     .gb-flow는 JS(paginate)가 필요한 만큼 여러 개 만들어 #gb-pages 아래에 쌓는다.
     창 너비 1000px 이상 4단 / 700~999px 2단 / 700px 미만(모바일) 1단. */
  .gb-flow {
    column-count: var(--gb-cols);
    column-gap: var(--gb-colgap);
    column-fill: auto;
    /* 지면 높이 = 화면 높이 - (지면이 시작하는 위쪽 여백: 관리자 로그인 바 등)
       - 하단 코너 네비 - 고정 입력창. 그래서 글이 딱 이 높이까지만 차고
       넘치면 다음 지면(.gb-flow)으로 넘어간다. */
    height: calc(100vh - var(--gb-top-space) - var(--gb-nav-space) - var(--gb-form-space));
    overflow: hidden;
  }
  .gb-flow + .gb-flow { margin-top: var(--gb-item-gap); }
  .gb-empty { color: var(--muted); font-size: var(--gb-size); }

  .gb-item,
  .gb-reply {
    position: relative;
    display: grid;
    grid-template-columns: var(--gb-who) minmax(0, 1fr);
    column-gap: var(--gb-gap);
    font-size: var(--gb-size);
    line-height: var(--gb-lh);
  }

  /* 하나의 방명록을 '글 + 내 답글' 하나의 세트로 본다.
     세트 내부의 글과 답글은 가깝게 붙이고, 세트와 세트 사이에만 확실한 간격을 둔다.
     break-inside: avoid를 안 걸어서 긴 세트는 단 경계에서 자연스럽게 잘려 다음 단으로 이어진다
     (잡지가 실제로 하는 방식) - 그래야 가장 큰 세트 하나 때문에 뒤 단이 통째로 비지 않는다. */
  .gb-reply { margin-top: 3px; }
  .gb-item { margin: 0 0 var(--gb-item-gap); }

  /* 이름은 한 줄 고정. 길면 말줄임, 마우스 올리면 전체 이름 */
  .gb-item-name,
  .gb-reply-name { font-weight: 400; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .gb-item-main,
  .gb-reply-main { min-width: 0; }

  /* 칼각: 양쪽 정렬 + 문단 사이 여백 없음 (줄 간격이 전부 똑같이).
     #gb-app를 앞에 붙여 테마가 p에 직접 거는 font-size/line-height보다 우선하게 한다
     (상속만으로는 테마의 p 규칙에 밀릴 수 있어서 여기서 직접 값을 준다). */
  #gb-app .gb-item-body p,
  #gb-app .gb-reply-body p {
    margin: 0;
    font-size: var(--gb-size);
    line-height: var(--gb-lh);
    color: var(--text);
    text-align: justify;
    text-justify: inter-character;
    word-break: normal;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  /* 답글은 세트 안에서 바로 다음 줄에 붙음 (세트 내부는 줄 간격만으로 붙이고,
     세트끼리는 --gb-item-gap으로 확실히 띄운다) */
  .gb-replies { grid-column: 1 / -1; list-style: none; margin: 0; padding: 0; }

  /* ---- 비밀글 ---- */
  .gb-secret-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; color: var(--muted); }
  .gb-reply-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .gb-secret-row input { width: 64px; padding: 0; border: none; background: transparent; font: inherit; color: var(--text); outline: none; }
  .gb-secret-row input::placeholder { color: var(--muted); opacity: 0.6; }
  .gb-secret-row button { padding: 0; border: none; background: none; font: inherit; color: var(--text); cursor: pointer; }
  .gb-secret-row button:hover { text-decoration: underline; text-underline-offset: 3px; }

  /* ---- 답글 사진 (이미 올라간 사진을 보여주기만 함) ---- */
  .gb-images { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; max-width: 480px; }
  .gb-image { display: block; width: 100%; height: auto; border-radius: 2px; background: var(--border); }

  /* ---- 관리자 답글 폼: 글 하나당 답글은 1개만 허용한다 (1질문 1답글이면 보통
     해결되니까). 이미 답글이 달린 글에는 JS가 이 폼을 display:none으로 숨긴다. ---- */
  .gb-reply-form { display: none; grid-column: 2; margin: 0; }
  body.gb-is-owner .gb-reply-form { display: block; }
  .gb-reply-form textarea { display: block; width: 100%; min-height: 1.7em; max-height: 160px; box-sizing: border-box; padding: 0; border: none; background: transparent; font: inherit; font-size: 13px; line-height: 1.6; color: var(--text); resize: none; overflow: hidden; outline: none; }
  .gb-reply-form textarea::placeholder { color: var(--muted); opacity: 0.6; }
  .gb-reply-tools { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
  .gb-reply-file-label,
  .gb-reply-submit { padding: 0; border: none; background: none; font: inherit; font-size: 15px; line-height: 1; color: var(--muted); cursor: pointer; }
  .gb-reply-submit { margin-left: auto; }
  .gb-reply-file-label:hover,
  .gb-reply-submit:hover { color: var(--text); }
  .gb-reply-file-label input { display: none; }
  .gb-reply-submit:disabled { opacity: 0.4; cursor: default; }

  .gb-upload-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .gb-upload-preview:empty { display: none; }
  .gb-upload-thumb { position: relative; width: 48px; height: 48px; overflow: hidden; }
  .gb-upload-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gb-upload-remove { position: absolute; top: 1px; right: 1px; width: 15px; height: 15px; border: none; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; font-size: 9px; line-height: 15px; text-align: center; cursor: pointer; padding: 0; }

  /* ---- 작성 폼: 아이메시지처럼 화면 하단에 항상 고정 (name/content 칸) ---- */
  .gb-form {
    position: fixed;
    left: var(--gb-edge);
    right: var(--gb-edge);
    bottom: var(--gb-nav-space);
    /* default.html이 모바일에서 코너 네비 위에 깔아주는 페이드 그라데이션(z-index:999)
       보다 높아야, 그 반투명 배경에 입력창 글씨가 흐려 보이지 않는다. */
    z-index: 1001;
    display: grid;
    grid-template-columns: var(--gb-who) minmax(0, 1fr);
    align-items: start;
    column-gap: var(--gb-gap);
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 8px;
    font-size: var(--gb-size);
    line-height: var(--gb-lh);
  }
  /* 관리자로 로그인하면 방문자용 글쓰기 폼은 보이지 않는다 (본인은 쓸 일이 없어서) */
  body.gb-is-owner .gb-form { display: none; }
  .gb-form input,
  .gb-form textarea { padding: 0; border: none; background: transparent; font: inherit; font-size: 16px; line-height: var(--gb-lh); color: var(--text); outline: none; }
  .gb-form input::placeholder,
  .gb-form textarea::placeholder { color: var(--muted); opacity: 0.6; }
  .gb-form-name { width: 100%; font-weight: 400; }
  .gb-form textarea { display: block; width: 100%; min-height: 1.7em; max-height: 240px; resize: none; overflow: hidden; }

  /* content와 전송 화살표를 한 줄에 (메시지 보내기 느낌), secret?/password는 그 아래 */
  .gb-form-content-row { display: flex; align-items: flex-start; gap: 14px; }
  .gb-form-content-row textarea { flex: 1; }

  .gb-form-bottom { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; margin-top: 6px; font-size: 11px; color: var(--muted); }
  /* secret?가 켜졌을 때만 비밀번호 입력칸이 나타남 (더 이상 type="password"가 아니라
     #gb-code로 직접 지정 - 크롬 자동완성 오작동을 피하려고 type="text"로 바꿨다) */
  #gb-code { display: none; width: 92px; font-size: 12px; letter-spacing: 0.04em; }
  .gb-form-main:has(#gb-secret:checked) #gb-code { display: inline-block; }
  /* 실제 계정 비밀번호가 아닌 4자리 PIN이라 type="password" 대신 이걸로 점(dot) 마스킹만
     흉내낸다 - 크롬이 로그인 폼으로 오인해 이름/내용 칸까지 자동완성 뜨게 하던 걸 방지 */
  .gb-pin-mask { -webkit-text-security: disc; }

  /* 비밀글: 체크박스 대신 자물쇠를 눌러 켜고 끔 (꺼지면 흐리게) */
  .gb-secret { position: relative; display: inline-flex; align-items: center; gap: 4px; font-size: 15px; cursor: pointer; filter: grayscale(1); opacity: 0.3; transition: opacity 120ms ease; }
  .gb-secret:hover { opacity: 0.6; }
  .gb-secret:has(input:checked) { filter: none; opacity: 1; }
  .gb-secret input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
  .gb-secret:has(input:focus-visible) { outline: 1px solid var(--muted); outline-offset: 2px; }

  #gb-submit { margin-left: auto; padding: 0 2px; border: none; background: none; font: inherit; font-size: 18px; line-height: 1; color: var(--text); cursor: pointer; transition: transform 120ms ease; }
  #gb-submit:hover { transform: translateX(3px); }
  #gb-submit:disabled { opacity: 0.3; cursor: default; transform: none; }

  .gb-form input:focus-visible,
  .gb-form textarea:focus-visible,
  .gb-reply-form textarea:focus-visible { box-shadow: 0 1px 0 var(--muted); }

  /* ---- 서체 통일: 방명록 본문 문장 서체를 이름·입력칸·비밀글 줄까지 똑같이 ---- */
  #gb-app .gb-item-name,
  #gb-app .gb-reply-name,
  #gb-app .gb-empty,
  #gb-app .gb-secret-row,
  #gb-app .gb-secret-row input,
  #gb-app .gb-secret-row button,
  #gb-app .gb-form input,
  #gb-app .gb-form textarea,
  #gb-app .gb-reply-form textarea {
    font-family: var(--gb-font, inherit);
    letter-spacing: var(--gb-ls, normal);
  }

  /* 창이 1000px 이상일 때만 4단, 700~1000px는 2단, 700px 미만(진짜 모바일)은
     1단 - 타이포그래피/스크롤 방식도 그 아래에서 더 바뀐다. */
  @media (max-width: 1000px) {
    #gb-app { --gb-cols: 2; }
  }

  @media (max-width: 700px) {
    #gb-app { --gb-edge: 16px; --gb-who: 64px; --gb-gap: 10px; --gb-size: 13px; --gb-cols: 1; }

    /* 노치가 있는 폰의 하단 제스처 영역까지 고려해서 입력창을 코너 네비보다
       조금 더 띄운다 (네비 자체는 건드리지 않고, 방명록 쪽에서만 여유를 둔다). */
    .gb-form { bottom: calc(var(--gb-nav-space) + env(safe-area-inset-bottom, 0px)); }

    /* name/content는 이제 화면 크기와 상관없이 항상 16px (데스크톱/모바일
       동일) - iOS Safari의 자동 확대(입력칸 글자가 16px 미만이면 포커스 시
       화면이 확대됨)도 자연스럽게 방지된다. */

    /* 모바일에서는 "지면" 개념을 풀어서 그냥 계속 이어지는 세로 스크롤로 만든다.
       height 제한과 overflow:hidden을 없애면 --gb-cols:1이라 자연스럽게 한 흐름이 된다. */
    .gb-flow {
      height: auto;
      overflow: visible;
      /* 고정 입력창 + 코너 네비에 마지막 글이 가려지지 않도록 바닥 여백을 확보한다.
         JS가 매번 정확히 재는 --gb-form-space/--gb-nav-space에 기대지 않고, 이 값
         하나는 넉넉한 고정값으로 박아둔다 - 계산이 어떤 이유로든 틀어져도(측정 시점
         문제, 느린 기기 등) 절대 네비와 안 겹치도록 하는 최후의 안전장치다.
         관리자가 아닐 땐 입력창(name/content/secret)까지 화면 하단에 같이 떠
         있어서 네비만 있을 때보다 훨씬 더 넓게 잡아야 한다. */
      padding-bottom: calc(230px + env(safe-area-inset-bottom, 0px));
    }

    /* default.html의 페이드 그라데이션은 코너 네비 기준(90px)으로 잡혀 있는데,
       방명록은 관리자가 아닐 땐 그 위에 입력창까지 떠 있어서 가릴 영역이 더 크다.
       이 페이지에서만 더 큰 값으로 덮어쓴다.
       (진단 결과 이 레이어는 흰 화면의 원인이 아닌 것으로 확인돼서 복원함.) */
    body:has(#gb-app)::after {
      height: 220px;
      background: linear-gradient(to bottom, rgba(253,253,253,0) 0%, var(--bg) 45%);
    }
  }
</style>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc, setDoc, doc,
    query, orderBy, onSnapshot, serverTimestamp
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import {
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import {
    getStorage, ref as storageRef, uploadBytes, getDownloadURL
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAhTbvjRr06MX21Tau2X1o1OQvqHV9xWvI",
    authDomain: "pppppppp-2d15f.firebaseapp.com",
    projectId: "pppppppp-2d15f",
    storageBucket: "pppppppp-2d15f.firebasestorage.app",
    messagingSenderId: "204873249546",
    appId: "1:204873249546:web:92941490d06fea41c0c0f3"
  };

  const OWNER_EMAIL = "hayoungjo.work@gmail.com";
  // 비밀글 열람용 (삭제와는 무관, 참고용 보조 비밀번호)
  const MASTER_HASH = "939331a7a3c0eaef4a7490e6ce1bf375893e179b60b688411373676c39bc2bc0";
  // 관리자 답글은 화면 표시뿐 아니라 Firestore에 저장되는 name 값도 항상 이 값으로 고정된다.
  // 작성 권한 자체는 코드가 아니라 Firestore 규칙(email == 관리자 계정)이 막아준다.
  const REPLY_NAME = "하영";
  const MAX_IMAGES_PER_REPLY = 6;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  const gbApp = document.getElementById("gb-app");

  // 사이트 테마가 <p>에만 따로 서체를 지정하고 있어서, 본문 문단과 똑같은 구조의 임시 <p>를 만들어
  // 실제 적용되는 서체를 읽은 뒤 방명록 전체(이름, 입력칸 포함)에 같은 값을 넣는다.
  (function syncGuestbookFont() {
    const probeWrap = document.createElement("div");
    probeWrap.className = "gb-item-body";
    probeWrap.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
    const probe = document.createElement("p");
    probe.textContent = "가";
    probeWrap.appendChild(probe);
    document.body.appendChild(probeWrap);
    const cs = getComputedStyle(probe);
    gbApp.style.setProperty("--gb-font", cs.fontFamily);
    gbApp.style.setProperty("--gb-ls", cs.letterSpacing);
    probeWrap.remove();
  })();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const gbRef = collection(db, "guestbook");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // 빈 줄 기준으로 문단을 나누고 줄바꿈은 <br>로 유지한다.
  function renderParagraphs(container, text) {
    container.innerHTML = "";
    String(text || "").replace(/\r\n/g, "\n").split(/\n{2,}/).forEach((para) => {
      const p = document.createElement("p");
      para.split("\n").forEach((line, i) => {
        if (i > 0) p.appendChild(document.createElement("br"));
        p.appendChild(document.createTextNode(line));
      });
      container.appendChild(p);
    });
  }

  // textarea가 내용에 맞춰 늘어나게
  function autoGrow(el, max) {
    el.style.height = "";
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  }

  // ---- 비밀글 비밀번호 시도 횟수 제한 (이 브라우저 기준) ----
  const MAX_TRIES = 5;
  function getFailCount(entryId) {
    try {
      return parseInt(localStorage.getItem("gb_fail_" + entryId) || "0", 10);
    } catch (e) {
      return 0;
    }
  }
  function incrementFailCount(entryId) {
    const next = getFailCount(entryId) + 1;
    try {
      localStorage.setItem("gb_fail_" + entryId, String(next));
    } catch (e) { /* localStorage 사용 불가 시 이번 시도만 카운트 안 됨 */ }
    return next;
  }

  // ---- 관리자 로그인 (구글) ----
  let isOwner = false;
  const authBar = document.getElementById("gb-auth");

  function renderAuthBar(user) {
    if (user && user.email === OWNER_EMAIL) {
      authBar.innerHTML = '관리자로 로그인됨 · <button type="button" id="gb-logout">로그아웃</button>';
    } else if (user) {
      authBar.innerHTML = user.email + ' (관리자 아님) · <button type="button" id="gb-logout">로그아웃</button>';
    } else {
      authBar.innerHTML = '<button type="button" id="gb-login">관리자 로그인</button>';
    }
    const loginBtn = document.getElementById("gb-login");
    const logoutBtn = document.getElementById("gb-logout");
    if (loginBtn) loginBtn.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (err) {
        alert("로그인 실패: " + err.message);
      }
    });
    if (logoutBtn) logoutBtn.addEventListener("click", () => signOut(auth));
  }
  renderAuthBar(null);

  onAuthStateChanged(auth, (user) => {
    isOwner = !!(user && user.email === OWNER_EMAIL);
    document.body.classList.toggle("gb-is-owner", isOwner);
    renderAuthBar(user);
    if (latestSnapshot) renderList(latestSnapshot);
    scheduleLayoutFlow();
  });

  // ---- 새 글 등록 (방문자용, 관리자로 로그인하면 CSS가 이 폼을 숨긴다) ----
  const form = document.getElementById("gb-form");
  const mainTextarea = document.getElementById("gb-content");
  const secretCheckbox = document.getElementById("gb-secret");
  const pwInput = document.getElementById("gb-code");

  // (진단용으로 넣었던 스크롤 강제 고정 코드 - touchstart/focus마다 스크롤
  // 위치를 저장해뒀다가 600ms 동안 계속 되돌리던 것 - 는 삭제함. 사파리가
  // 키보드 때문에 화면을 재배치하려는 동안 이 코드가 계속 "아니 원래대로"
  // 하고 맞서 싸운 게 오히려 흰 화면/깜빡임의 원인이었을 가능성이 있어서,
  // 원인이 맞는지 확인하는 중.)

  // textarea가 늘어나거나 줄어들면 입력창 높이가 바뀌어 페이지가 다시 계산돼야 한다.
  mainTextarea.addEventListener("input", () => {
    autoGrow(mainTextarea, 240);
    scheduleLayoutFlow();
  });

  // 비밀번호칸은 secret?이 켜졌을 때만 보이고 필요하다 (CSS가 숨김/표시를 담당).
  // 꺼지면 입력해둔 값도 지워서 다음에 다시 켰을 때 헷갈리지 않게 한다.
  secretCheckbox.addEventListener("change", () => {
    if (!secretCheckbox.checked) pwInput.value = "";
    // 비밀번호칸이 나타나거나 사라지면서 입력창 전체 높이가 바뀐다.
    scheduleLayoutFlow();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("gb-name").value.trim();
    const content = mainTextarea.value.trim();
    const secret = secretCheckbox.checked;
    const pw = pwInput.value.trim();
    if (!name || !content) {
      alert("이름과 내용을 입력해주세요.");
      return;
    }
    if (secret && !/^[0-9]{4}$/.test(pw)) {
      alert("비밀글은 4자리 숫자 비밀번호가 필요해요.");
      return;
    }
    const submitBtn = document.getElementById("gb-submit");
    submitBtn.disabled = true;
    try {
      const passwordHash = secret ? await sha256(pw) : "";
      await addDoc(gbRef, { name, passwordHash, content, secret, createdAt: serverTimestamp() });
      form.reset();
      mainTextarea.style.height = "";
      scheduleLayoutFlow();
    } catch (err) {
      alert("등록에 실패했어요: " + err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  function safeFileName(name) {
    return String(name).replace(/[^a-zA-Z0-9가-힣._-]/g, "_").slice(0, 100);
  }

  // 답글 사진은 Firebase Storage에 올라간다 (Storage가 Blaze 요금제로 켜진 뒤부터 동작).
  async function uploadReplyImages(entryId, replyId, files) {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `guestbook/${entryId}/replies/${replyId}/${Date.now()}_${i}_${safeFileName(file.name)}`;
      const snap = await uploadBytes(storageRef(storage, path), file, { contentType: file.type });
      urls.push(await getDownloadURL(snap.ref));
    }
    return urls;
  }

  function renderImages(container, images) {
    if (!Array.isArray(images) || images.length === 0) return;
    const wrap = document.createElement("div");
    wrap.className = "gb-images";
    images.forEach((url) => {
      if (!url) return;
      const img = document.createElement("img");
      img.className = "gb-image";
      img.src = url;
      img.loading = "lazy";
      img.alt = "답글에 첨부된 사진";
      img.addEventListener("load", scheduleLayoutFlow);
      wrap.appendChild(img);
    });
    container.appendChild(wrap);
  }

  // ---- 답글 목록 실시간 렌더링. 삭제 UI는 없다 (필요하면 Firebase 콘솔에서 직접).
  // 답글은 글 하나당 1개만 허용하므로, 이미 답글이 있으면 replyForm을 숨긴다. ----
  function attachReplies(entryId, container, replyForm) {
    const repliesRef = collection(db, "guestbook", entryId, "replies");
    const rq = query(repliesRef, orderBy("createdAt", "asc"));
    onSnapshot(rq, (snap) => {
      container.innerHTML = "";
      let hasReply = false;
      snap.forEach((r) => {
        const d = r.data();
        if (d.deleted) return;
        hasReply = true;

        const li = document.createElement("li");
        li.className = "gb-reply";

        const name = document.createElement("span");
        name.className = "gb-reply-name";
        // 과거에 j0ah0로 저장된 답글도 화면에는 항상 하영으로 보이게 한다.
        name.textContent = REPLY_NAME;
        name.title = REPLY_NAME;

        const main = document.createElement("div");
        main.className = "gb-reply-main";
        const body = document.createElement("div");
        body.className = "gb-reply-body";
        renderParagraphs(body, d.content);
        main.appendChild(body);
        renderImages(main, d.images);

        li.appendChild(name);
        li.appendChild(main);
        container.appendChild(li);
      });
      container.style.display = container.children.length ? "" : "none";
      if (replyForm) replyForm.style.display = hasReply ? "none" : "";
      scheduleLayoutFlow();
    });
  }

  // ---- 답글 작성 폼 (이름은 항상 하영으로 고정, 사진 여러 장 첨부 가능, 글 하나당 1회) ----
  function buildReplyForm(entryId) {
    const wrap = document.createElement("div");
    wrap.className = "gb-reply-form";
    wrap.innerHTML =
      '<textarea class="gb-reply-content" maxlength="500" placeholder="…" rows="1" aria-label="답글" title="Enter 등록 / Shift+Enter 줄바꿈"></textarea>' +
      '<div class="gb-upload-preview"></div>' +
      '<div class="gb-reply-tools">' +
      '<label class="gb-reply-file-label" title="사진 첨부">+<input type="file" class="gb-reply-file" accept="image/*" multiple aria-label="사진 첨부"></label>' +
      '<button type="button" class="gb-reply-submit" aria-label="답글 등록">→</button>' +
      '</div>';

    const contentInput = wrap.querySelector(".gb-reply-content");
    const fileInput = wrap.querySelector(".gb-reply-file");
    const preview = wrap.querySelector(".gb-upload-preview");
    const btn = wrap.querySelector(".gb-reply-submit");
    let selectedFiles = [];

    function renderPreview() {
      preview.innerHTML = "";
      selectedFiles.forEach((file, index) => {
        const thumb = document.createElement("div");
        thumb.className = "gb-upload-thumb";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "gb-upload-remove";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
          selectedFiles.splice(index, 1);
          renderPreview();
        });
        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        preview.appendChild(thumb);
      });
    }

    fileInput.addEventListener("change", () => {
      const incoming = Array.from(fileInput.files || []);
      if (selectedFiles.length + incoming.length > MAX_IMAGES_PER_REPLY) {
        alert("사진은 답글 하나당 최대 " + MAX_IMAGES_PER_REPLY + "장까지 첨부할 수 있어요.");
      } else {
        for (const file of incoming) {
          if (!file.type.startsWith("image/")) { alert("이미지 파일만 첨부할 수 있어요."); continue; }
          if (file.size > MAX_IMAGE_SIZE) { alert(file.name + "은 10MB보다 커서 제외했어요."); continue; }
          selectedFiles.push(file);
        }
      }
      fileInput.value = "";
      renderPreview();
    });

    const submit = async () => {
      if (!isOwner) {
        alert("답글은 관리자만 작성할 수 있어요.");
        return;
      }
      const content = contentInput.value.trim();
      if (!content) {
        alert("답글 내용을 입력해주세요.");
        return;
      }
      btn.disabled = true;
      try {
        // 문서 ID를 먼저 만들고 사진을 그 경로로 올린 뒤, 완성된 데이터를 한 번에 저장한다.
        const replyRef = doc(collection(db, "guestbook", entryId, "replies"));
        let images = [];
        if (selectedFiles.length > 0) {
          images = await uploadReplyImages(entryId, replyRef.id, selectedFiles);
        }
        await setDoc(replyRef, { name: REPLY_NAME, content, images, createdAt: serverTimestamp() });
        contentInput.value = "";
        contentInput.style.height = "";
        selectedFiles = [];
        renderPreview();
      } catch (err) {
        alert("답글 등록에 실패했어요: " + err.message);
      } finally {
        btn.disabled = false;
      }
    };
    btn.addEventListener("click", submit);
    contentInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); submit(); }
    });
    contentInput.addEventListener("input", () => autoGrow(contentInput, 160));
    return wrap;
  }

  // ---- 공개 글(또는 비밀번호가 맞은 글): 본문 + 답글 + 답글 폼 ----
  // 답글과 답글 폼은 본문 칸 안이 아니라 li 바로 아래에 붙여서, 이름 칸이 세로로 한 줄에 정렬되게 한다.
  function renderOpen(li, entryId, content) {
    const main = li.querySelector(".gb-item-main");

    const body = document.createElement("div");
    body.className = "gb-item-body";
    renderParagraphs(body, content);
    main.appendChild(body);

    const repliesEl = document.createElement("ul");
    repliesEl.className = "gb-replies";
    repliesEl.style.display = "none";
    li.appendChild(repliesEl);

    const replyForm = buildReplyForm(entryId);
    li.appendChild(replyForm);

    attachReplies(entryId, repliesEl, replyForm);
  }

  // ---- 목록 렌더링 (오래된 글 → 최신 글). 삭제 UI는 없다 (필요하면 Firebase 콘솔에서 직접) ----
  // 관리자로 로그인하면 latestSnapshot을 다시 그려서, 이미 잠겨 있던 비밀글도
  // 새로고침 없이 바로 비밀번호 없이 열리게 한다.
  // renderList는 DOM 노드를 만들어 currentNodes에 채우기만 하고, 실제 화면
  // 배치(페이지 나누기)는 paginate()가 별도로 맡는다 - 화면 크기가 바뀌거나
  // 사진이 늦게 로드돼서 높이가 바뀔 때도 currentNodes를 다시 만들지 않고
  // paginate()만 다시 돌리면 되게 하기 위해서다.
  const pagesContainer = document.getElementById("gb-pages");
  let latestSnapshot = null;
  let currentNodes = [];

  function renderList(snapshot) {
    const docs = snapshot.docs.filter((d) => !d.data().deleted);
    const nodes = [];

    if (docs.length === 0) {
      const empty = document.createElement("div");
      empty.className = "gb-empty";
      empty.textContent = "아직 남긴 글이 없어요. 아래에 첫 이야기를 남겨보세요.";
      nodes.push(empty);
    }

    docs.forEach((docSnap) => {
      const d = docSnap.data();
      const entryId = docSnap.id;
      const item = document.createElement("div");
      item.className = "gb-item";

      const name = document.createElement("span");
      name.className = "gb-item-name";
      name.textContent = d.name;
      name.title = d.name;

      const main = document.createElement("div");
      main.className = "gb-item-main";

      item.appendChild(name);
      item.appendChild(main);

      if (d.secret && !isOwner) {
        const row = document.createElement("div");
        row.className = "gb-secret-row";
        if (getFailCount(entryId) >= MAX_TRIES) {
          row.textContent = "🔒 비밀번호를 5회 이상 틀려서 더 이상 열람할 수 없습니다.";
        } else {
          row.innerHTML = '<span title="비밀글">🔒</span><span class="gb-reply-dot" style="display:none;" title="답글이 있어요"></span><input type="text" class="gb-pin-mask" maxlength="4" inputmode="numeric" placeholder="····" autocomplete="one-time-code" aria-label="4자리 숫자 코드"><button type="button" aria-label="열기">→</button>';
          const input = row.querySelector("input");
          const btn = row.querySelector("button");
          const replyDot = row.querySelector(".gb-reply-dot");
          onSnapshot(collection(db, "guestbook", entryId, "replies"), (rSnap) => {
            const hasReply = rSnap.docs.some((r) => !r.data().deleted);
            replyDot.style.display = hasReply ? "inline-block" : "none";
          });
          const reveal = async () => {
            const hash = await sha256(input.value.trim());
            if (hash === d.passwordHash || hash === MASTER_HASH) {
              row.remove();
              renderOpen(item, entryId, d.content);
              scheduleLayoutFlow();
            } else {
              const fails = incrementFailCount(entryId);
              if (fails >= MAX_TRIES) {
                row.textContent = "🔒 비밀번호를 5회 이상 틀려서 더 이상 열람할 수 없습니다.";
              } else {
                alert("비밀번호가 틀렸습니다. (남은 시도: " + (MAX_TRIES - fails) + "회)");
              }
            }
          };
          btn.addEventListener("click", reveal);
          input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); reveal(); } });
        }
        main.appendChild(row);
      } else {
        renderOpen(item, entryId, d.content);
      }
      nodes.push(item);
    });

    currentNodes = nodes;
  }

  // ---- 화면에 실제로 남기는 여백 측정: 코너 네비(고정) + 입력창(고정)이
  // 차지하는 화면 공간을 재서 --gb-nav-space/--gb-form-space에 반영한다.
  // 값을 추측해서 박아두는 대신 매 레이아웃마다 실측하므로, 코너 네비 디자인이
  // 바뀌거나 입력창이 늘어나도(비밀번호칸 등장, textarea 여러 줄) 항상 정확하다. ----
  const cornerNav = document.querySelector(".corner-nav");
  const cornerBrand = document.querySelector(".corner-brand");

  function measureReservedSpace() {
    let navSpace = 0;
    [cornerNav, cornerBrand].forEach((el) => {
      if (!el) return;
      const fromBottom = window.innerHeight - el.getBoundingClientRect().top;
      if (fromBottom > navSpace) navSpace = fromBottom;
    });
    navSpace += 10;

    // 관리자로 로그인해서 입력창이 숨겨지면 offsetHeight가 0이 되고,
    // 그만큼 지면을 더 넓게 쓸 수 있다.
    const formSpace = form.offsetHeight + (form.offsetHeight > 0 ? 20 : 0);

    // #gb-pages 앞에 있는 관리자 로그인 바 등 때문에 첫 지면도 화면 맨 위(0px)가
    // 아니라 그만큼 내려온 지점에서 시작한다. rect.top은 스크롤에 따라 바뀌므로
    // scrollY를 더해 스크롤과 무관한 값으로 고정한다.
    const topSpace = pagesContainer.getBoundingClientRect().top + window.scrollY;

    gbApp.style.setProperty("--gb-nav-space", navSpace + "px");
    gbApp.style.setProperty("--gb-form-space", formSpace + "px");
    gbApp.style.setProperty("--gb-top-space", topSpace + "px");
  }

  // ---- 페이지 나누기: 화면 높이(.gb-flow)를 한 지면으로 보고, 단을 위→아래로
  // 채운 뒤 다음 단으로, 페이지 하나가 다 차면 새 페이지를 만들어 이어 붙인다.
  // 이미 만들어둔 노드(currentNodes)를 옮겨 붙이기만 하므로 답글/폼의 상태와
  // 이벤트 리스너는 그대로 유지된다. 작성 폼은 더 이상 이 안에 들어가지 않는다
  // (항상 고정된 별도의 요소). ----
  function newPage() {
    const flow = document.createElement("div");
    flow.className = "gb-flow";
    pagesContainer.appendChild(flow);
    return flow;
  }

  function paginate() {
    measureReservedSpace();
    pagesContainer.innerHTML = "";
    let flow = newPage();
    currentNodes.forEach((node) => {
      flow.appendChild(node);
      if (flow.scrollWidth > flow.clientWidth + 1) {
        flow.removeChild(node);
        flow = newPage();
        flow.appendChild(node);
      }
    });
  }

  let layoutFrame = null;
  function scheduleLayoutFlow() {
    if (layoutFrame) cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(paginate);
  }

  const q = query(gbRef, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    latestSnapshot = snapshot;
    renderList(snapshot);
    scheduleLayoutFlow();
  }, (err) => {
    const errNode = document.createElement("div");
    errNode.className = "gb-empty";
    errNode.textContent = "방명록을 불러오지 못했어요: " + err.message;
    currentNodes = [errNode];
    scheduleLayoutFlow();
  });

  window.addEventListener("resize", () => {
    scheduleLayoutFlow();
  });
  window.addEventListener("orientationchange", () => {
    scheduleLayoutFlow();
  });
  // 진단 결과 키보드 따라가기 자체는 흰 화면의 원인이 아닌 것으로 확인돼서
  // 다시 켠다 (모바일은 height:auto라 repaginate는 여전히 안 돌린다).
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", positionFormAboveKeyboard);
    window.visualViewport.addEventListener("scroll", positionFormAboveKeyboard);
  }

  // ---- 모바일 키보드가 뜨면 고정 입력창이 키보드에 가려지는 문제 ----
  // window.innerHeight(레이아웃 뷰포트)는 키보드가 떠도 안 바뀌지만,
  // visualViewport.height(실제 보이는 영역)는 키보드가 뜬 만큼 줄어든다.
  // 그 차이(= 키보드 높이)를 입력창의 bottom으로 직접 줘서 키보드 바로 위에
  // 붙인다. 키보드가 닫히면(차이가 거의 없으면) 원래 CSS 값(코너 네비 위)으로
  // 되돌린다.
  function positionFormAboveKeyboard() {
    if (!window.visualViewport) return;
    const vv = window.visualViewport;
    const keyboardInset = window.innerHeight - vv.height - vv.offsetTop;
    if (keyboardInset > 60) {
      form.style.bottom = keyboardInset + "px";
    } else {
      form.style.bottom = "";
    }
  }
</script>
