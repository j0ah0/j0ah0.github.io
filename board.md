---
layout: page
title: Board
permalink: /board/
---

<div id="gb-auth" class="gb-auth"></div>

<div id="gb-app">
  <div class="gb-list-tools">
    <button type="button" id="gb-lens-toggle" class="gb-lens-toggle"></button>
  </div>

  <ul id="gb-list" class="gb-list"></ul>

  <!-- 작성 폼 = 대화의 다음 화자 한 줄 -->
  <form id="gb-form" class="gb-form">
    <input type="text" id="gb-name" class="gb-form-name" placeholder="이름" maxlength="20" required aria-label="닉네임">
    <div class="gb-form-main">
      <div class="gb-form-content-row">
        <textarea id="gb-content" placeholder="content" maxlength="500" rows="1" required aria-label="내용"></textarea>
        <label class="gb-secret" title="비밀글"><input type="checkbox" id="gb-secret" aria-label="비밀글"><span aria-hidden="true">🔒</span><span class="gb-secret-label">secret?</span></label>
      </div>
      <div class="gb-form-bottom">
        <input type="password" id="gb-pw" placeholder="password" maxlength="4" inputmode="numeric" pattern="[0-9]{4}" aria-label="비밀번호 4자리 숫자" title="비밀번호 4자리 숫자">
        <button type="submit" id="gb-submit" aria-label="등록">→</button>
      </div>
    </div>
  </form>
</div>

<div id="gb-lens" class="gb-lens"><div id="gb-lens-inner" class="gb-lens-inner"></div></div>

<style>
  /* 한 곳에서 조절:
     --gb-who 이름 칸 너비 / --gb-measure 본문 폭(모든 글이 이 폭으로 통일) /
     --gb-size 글자 크기 / --gb-lh 줄 간격 (세트 사이 간격도 이 한 줄 높이 기준) */
  #gb-app { --gb-who: 84px; --gb-gap: 14px; --gb-measure: 460px; --gb-size: 14px; --gb-lh: 1.7; --gb-set-gap: 1.25em; --gb-item-gap: 1.75em; }

  .gb-auth { text-align: right; font-size: 12px; color: var(--muted); margin-bottom: 14px; min-height: 20px; }
  .gb-auth button { font: inherit; font-size: 12px; border: none; background: none; color: var(--muted); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .gb-auth button:hover { color: var(--text); }
  #gb-login { opacity: 0.4; }

  .gb-list-tools { display: flex; justify-content: flex-end; margin-bottom: 18px; }
  .gb-lens-toggle { border: none; background: none; padding: 2px 0; font: inherit; font-size: 10px; letter-spacing: 0.06em; color: var(--muted); cursor: pointer; }
  .gb-lens-toggle:hover { color: var(--text); }
  .gb-lens-toggle .gb-lens-dot { display: inline-block; margin-right: 5px; font-size: 8px; vertical-align: 1px; }

  /* ---- 대화 목록 ---- */
  .gb-list,
  .gb-form { max-width: calc(var(--gb-who) + var(--gb-gap) + var(--gb-measure)); }
  .gb-list { list-style: none; margin: 0; padding: 0; }
  .gb-empty { color: var(--muted); font-size: var(--gb-size); }

  .gb-item,
  .gb-reply {
    position: relative;
    display: grid;
    grid-template-columns: var(--gb-who) minmax(0, var(--gb-measure));
    column-gap: var(--gb-gap);
    font-size: var(--gb-size);
    line-height: var(--gb-lh);
  }

  /* 세트(글 + 답글) 사이는 정확히 한 줄만큼 띄움 → 줄 격자가 안 깨짐 */
  /* 다른 사람의 글(세트) 사이는 넓게, 같은 세트 안(글+답글)은 좁게 띄워서 구분이 잘 되게 */
  .gb-item { margin: 0 0 var(--gb-item-gap); }

  /* 이름은 한 줄 고정. 길면 말줄임, 마우스 올리면 전체 이름 */
  .gb-item-name,
  .gb-reply-name { font-weight: 400; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .gb-item-main,
  .gb-reply-main { min-width: 0; }

  /* 칼각: 양쪽 정렬 + 문단 사이 여백 없음 (줄 간격이 전부 똑같이) */
  .gb-item-body p,
  .gb-reply-body p {
    margin: 0;
    color: var(--text);
    text-align: justify;
    text-justify: inter-character;
    word-break: normal;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  /* 답글은 세트 안에서 바로 다음 줄에 붙음 */
  .gb-replies { grid-column: 1 / -1; list-style: none; margin: var(--gb-set-gap) 0 0; padding: 0; }
  .gb-reply + .gb-reply { margin-top: var(--gb-set-gap); }

  .gb-del-btn { display: none; position: absolute; top: 0; right: -28px; border: none; background: none; color: var(--muted); font-size: 12px; padding: 2px 4px; cursor: pointer; }
  body.gb-is-owner .gb-del-btn { display: inline-block; }
  .gb-del-btn:hover { color: #c0392b; }

  /* ---- 비밀글 ---- */
  .gb-secret-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; color: var(--muted); }
  .gb-reply-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .gb-secret-row input { width: 64px; padding: 0; border: none; background: transparent; font: inherit; color: var(--text); outline: none; }
  .gb-secret-row input::placeholder { color: var(--muted); opacity: 0.6; }
  .gb-secret-row button { padding: 0; border: none; background: none; font: inherit; color: var(--text); cursor: pointer; }
  .gb-secret-row button:hover { text-decoration: underline; text-underline-offset: 3px; }

  /* ---- 답글 사진 ---- */
  .gb-images { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; max-width: 480px; }
  .gb-image { display: block; width: 100%; height: auto; border-radius: 2px; background: var(--border); }

  /* ---- 관리자 답글 폼 (선 없이) ---- */
  .gb-reply-form { display: none; grid-column: 2; margin: var(--gb-set-gap) 0 0; }
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

  /* ---- 작성 폼: 마지막 화자 다음 줄 ---- */
  .gb-form {
    display: grid;
    grid-template-columns: var(--gb-who) minmax(0, var(--gb-measure));
    column-gap: var(--gb-gap);
    margin-top: calc(var(--gb-lh) * 1em);
    font-size: var(--gb-size);
    line-height: var(--gb-lh);
  }
  .gb-form input,
  .gb-form textarea { padding: 0; border: none; background: transparent; font: inherit; color: var(--text); outline: none; }
  .gb-form input::placeholder,
  .gb-form textarea::placeholder { color: var(--muted); opacity: 0.6; }
  .gb-form-name { width: 100%; font-weight: 400; }
  .gb-form textarea { display: block; width: 100%; min-height: 1.7em; max-height: 240px; resize: none; overflow: hidden; }

  /* content와 secret? 토글을 한 줄에 나란히 */
  .gb-form-content-row { display: flex; align-items: flex-start; gap: 14px; }
  .gb-form-content-row textarea { flex: 1; }

  .gb-form-bottom { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; margin-top: 6px; font-size: 11px; color: var(--muted); }
  /* secret?가 켜졌을 때만 비밀번호 입력칸이 나타남 */
  .gb-form-bottom input[type="password"] { display: none; width: 92px; font-size: 12px; letter-spacing: 0.04em; }
  .gb-form-main:has(#gb-secret:checked) .gb-form-bottom input[type="password"] { display: inline-block; }

  /* 비밀글: 체크박스 대신 자물쇠를 눌러 켜고 끔 (꺼지면 흐리게) */
  .gb-secret { position: relative; display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; padding-top: 0.15em; font-size: 12px; cursor: pointer; filter: grayscale(1); opacity: 0.3; transition: opacity 120ms ease; }
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

  /* ---- 유리구슬 돋보기 ---- */
  .gb-lens {
    position: fixed; z-index: 500; left: 0; top: 0; width: 180px; height: 180px;
    border-radius: 50%; overflow: hidden; pointer-events: none; opacity: 0;
    background:
      radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.12) 16%, rgba(255,255,255,0) 32%),
      var(--bg);
    box-shadow: 0 8px 26px rgba(0,0,0,0.16), inset 0 0 0 1px rgba(255,255,255,0.8), inset 0 0 20px rgba(255,255,255,0.2);
    transform: translate(-50%, -50%) scale(0.7);
    transition: opacity 160ms ease, transform 220ms cubic-bezier(.2,.8,.2,1);
  }
  .gb-lens::before {
    content: ""; position: absolute; inset: 0; border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.9), inset 0 -8px 20px rgba(0,0,0,0.08);
    pointer-events: none;
  }
  .gb-lens.is-visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  .gb-lens-inner { position: absolute; left: 0; top: 0; transform-origin: 0 0; pointer-events: none; }
  .gb-lens-inner .gb-del-btn,
  .gb-lens-inner .gb-reply-form,
  .gb-lens-inner .gb-secret-row button,
  .gb-lens-inner .gb-secret-row input { display: none !important; }

  @media (prefers-reduced-motion: reduce) {
    .gb-lens { transition: none; }
  }

  @media (max-width: 700px) {
    #gb-app { --gb-who: 64px; --gb-gap: 10px; --gb-size: 13px; }
    .gb-list, .gb-form { max-width: none; }
    .gb-item, .gb-reply, .gb-form { grid-template-columns: var(--gb-who) minmax(0, 1fr); }
    .gb-del-btn { right: 0; }
    .gb-list-tools { display: none; }
    .gb-lens { display: none; }
  }
</style>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc, setDoc, doc, updateDoc,
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

  // 사이트 테마가 <p>에만 따로 서체를 지정하고 있어서, 본문 문단과 똑같은 구조의 임시 <p>를 만들어
  // 실제 적용되는 서체를 읽은 뒤 방명록 전체(이름, 입력칸 포함)에 같은 값을 넣는다.
  (function syncGuestbookFont() {
    const gbApp = document.getElementById("gb-app");
    const probeWrap = document.createElement("div");
    probeWrap.className = "gb-item-body";
    probeWrap.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
    const probe = document.createElement("p");
    probe.textContent = "가";
    probeWrap.appendChild(probe);
    document.getElementById("gb-list").appendChild(probeWrap);
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
  });

  // ---- 새 글 등록 ----
  const form = document.getElementById("gb-form");
  const mainTextarea = document.getElementById("gb-content");
  const secretCheckbox = document.getElementById("gb-secret");
  const pwInput = document.getElementById("gb-pw");
  mainTextarea.addEventListener("input", () => autoGrow(mainTextarea, 240));

  // 비밀번호칸은 secret?이 켜졌을 때만 보이고 필요하다 (CSS가 숨김/표시를 담당).
  // 꺼지면 입력해둔 값도 지워서 다음에 다시 켰을 때 헷갈리지 않게 한다.
  secretCheckbox.addEventListener("change", () => {
    if (!secretCheckbox.checked) pwInput.value = "";
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
    } catch (err) {
      alert("등록에 실패했어요: " + err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---- 글 삭제 (soft delete, 관리자만) ----
  async function handleDelete(entryId) {
    if (!isOwner) return;
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await updateDoc(doc(db, "guestbook", entryId), { deleted: true, deletedAt: serverTimestamp() });
    } catch (err) {
      alert("삭제에 실패했어요: " + err.message);
    }
  }

  // ---- 답글 삭제 (soft delete, 관리자만) ----
  async function handleDeleteReply(entryId, replyId) {
    if (!isOwner) return;
    if (!confirm("답글을 삭제하시겠습니까?")) return;
    try {
      await updateDoc(doc(db, "guestbook", entryId, "replies", replyId), { deleted: true, deletedAt: serverTimestamp() });
    } catch (err) {
      alert("답글 삭제에 실패했어요: " + err.message);
    }
  }

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
      wrap.appendChild(img);
    });
    container.appendChild(wrap);
  }

  // ---- 답글 목록 실시간 렌더링 ----
  function attachReplies(entryId, container) {
    const repliesRef = collection(db, "guestbook", entryId, "replies");
    const rq = query(repliesRef, orderBy("createdAt", "asc"));
    onSnapshot(rq, (snap) => {
      container.innerHTML = "";
      snap.forEach((r) => {
        const d = r.data();
        if (d.deleted) return;
        const replyId = r.id;

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

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "gb-del-btn";
        delBtn.title = "삭제";
        delBtn.textContent = "✕";
        delBtn.addEventListener("click", () => handleDeleteReply(entryId, replyId));

        li.appendChild(name);
        li.appendChild(main);
        li.appendChild(delBtn);
        container.appendChild(li);
      });
      container.style.display = container.children.length ? "" : "none";
      refreshLensIfShowing();
    });
  }

  // ---- 답글 작성 폼 (이름은 항상 하영으로 고정, 사진 여러 장 첨부 가능) ----
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
    attachReplies(entryId, repliesEl);

    li.appendChild(buildReplyForm(entryId));
  }

  // ---- 목록 렌더링 (오래된 글 → 최신 글) ----
  const list = document.getElementById("gb-list");
  const q = query(gbRef, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.filter((d) => !d.data().deleted);
    if (docs.length === 0) {
      list.innerHTML = '<li class="gb-empty">아직 남긴 글이 없어요. 아래에 첫 이야기를 남겨보세요.</li>';
      hideLens();
      return;
    }
    list.innerHTML = "";
    docs.forEach((docSnap) => {
      const d = docSnap.data();
      const entryId = docSnap.id;
      const li = document.createElement("li");
      li.className = "gb-item";

      const name = document.createElement("span");
      name.className = "gb-item-name";
      name.textContent = d.name;
      name.title = d.name;

      const main = document.createElement("div");
      main.className = "gb-item-main";

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "gb-del-btn";
      delBtn.title = "삭제";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => handleDelete(entryId));

      li.appendChild(name);
      li.appendChild(main);
      li.appendChild(delBtn);

      if (d.secret) {
        const row = document.createElement("div");
        row.className = "gb-secret-row";
        if (getFailCount(entryId) >= MAX_TRIES) {
          row.textContent = "🔒 비밀번호를 5회 이상 틀려서 더 이상 열람할 수 없습니다.";
        } else {
          row.innerHTML = '<span title="비밀글">🔒</span><span class="gb-reply-dot" style="display:none;" title="답글이 있어요"></span><input type="password" maxlength="4" inputmode="numeric" placeholder="····" aria-label="비밀번호"><button type="button" aria-label="열기">→</button>';
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
              renderOpen(li, entryId, d.content);
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
        renderOpen(li, entryId, d.content);
      }
      list.appendChild(li);
    });
    attachLensEvents();
  }, (err) => {
    list.innerHTML = '<li class="gb-empty">방명록을 불러오지 못했어요: ' + err.message + '</li>';
  });

  // ---- 유리구슬 돋보기 ----
  const lens = document.getElementById("gb-lens");
  const lensInner = document.getElementById("gb-lens-inner");
  const lensToggle = document.getElementById("gb-lens-toggle");
  const LENS_SIZE = 180;
  const LENS_SCALE = 1.6;
  let lensItem = null;
  let lensX = 0;
  let lensY = 0;
  let lensFrame = null;

  let lensEnabled = false;
  try { lensEnabled = localStorage.getItem("gb_lens_enabled") === "1"; } catch (e) {}

  function updateLensToggleUI() {
    lensToggle.innerHTML = '<span class="gb-lens-dot">' + (lensEnabled ? "●" : "○") + '</span>lens';
    lensToggle.title = lensEnabled ? "off" : "magnify";
  }
  updateLensToggleUI();

  lensToggle.addEventListener("click", () => {
    lensEnabled = !lensEnabled;
    try { localStorage.setItem("gb_lens_enabled", lensEnabled ? "1" : "0"); } catch (e) {}
    updateLensToggleUI();
    if (!lensEnabled) hideLens();
  });

  function showLens(item, x, y) {
    if (!lensEnabled || window.innerWidth <= 700 || !item || !item.isConnected) return;
    lensItem = item;
    lensX = x;
    lensY = y;

    const rect = item.getBoundingClientRect();
    const clone = item.cloneNode(true);
    clone.style.width = rect.width + "px";
    clone.style.boxSizing = "border-box";
    lensInner.innerHTML = "";
    lensInner.appendChild(clone);

    const center = LENS_SIZE / 2;
    const localX = x - rect.left;
    const localY = y - rect.top;
    lensInner.style.left = (center - localX * LENS_SCALE) + "px";
    lensInner.style.top = (center - localY * LENS_SCALE) + "px";
    lensInner.style.transform = "scale(" + LENS_SCALE + ")";

    lens.style.left = x + "px";
    lens.style.top = y + "px";
    lens.classList.add("is-visible");
  }

  function hideLens() {
    lensItem = null;
    lens.classList.remove("is-visible");
  }

  function refreshLensIfShowing() {
    if (lensItem && lensItem.isConnected) showLens(lensItem, lensX, lensY);
  }

  function moveLens(item, x, y) {
    if (lensFrame) cancelAnimationFrame(lensFrame);
    lensFrame = requestAnimationFrame(() => {
      showLens(item, x, y);
      lensFrame = null;
    });
  }

  function attachLensEvents() {
    if (window.innerWidth <= 700) return;
    document.querySelectorAll(".gb-item").forEach((item) => {
      if (item.dataset.lensReady) return;
      item.dataset.lensReady = "true";
      item.addEventListener("mouseenter", (e) => showLens(item, e.clientX, e.clientY));
      item.addEventListener("mousemove", (e) => moveLens(item, e.clientX, e.clientY));
      item.addEventListener("mouseleave", hideLens);
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 700) hideLens();
  });
</script>
