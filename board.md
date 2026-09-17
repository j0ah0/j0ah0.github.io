---
layout: page
title: Board
permalink: /board/
---

<div id="gb-auth" class="gb-auth"></div>

<div id="gb-app">
  <form id="gb-form" class="gb-form">
    <div class="gb-form-title">GUESTBOOK</div>
    <div class="gb-form-row">
      <input type="text" id="gb-name" placeholder="닉네임" maxlength="20" required>
      <input type="password" id="gb-pw" placeholder="비밀번호 4자리" maxlength="4" inputmode="numeric" pattern="[0-9]{4}" required>
    </div>
    <textarea id="gb-content" placeholder="여러분의 소중한 이야기를 남겨주세요." maxlength="500" required></textarea>
    <div class="gb-form-bottom">
      <label class="gb-secret"><input type="checkbox" id="gb-secret"> 비밀글</label>
      <button type="submit" id="gb-submit">등록</button>
    </div>
  </form>

  <ul id="gb-list" class="gb-list"></ul>
</div>

<div id="gb-lens" class="gb-lens"><div id="gb-lens-inner" class="gb-lens-inner"></div></div>

<style>
  .gb-auth { text-align: right; font-size: 12px; color: var(--muted); margin-bottom: 14px; min-height: 20px; }
  .gb-auth button { font: inherit; font-size: 12px; border: none; background: none; color: var(--muted); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .gb-auth button:hover { color: var(--text); }
  #gb-login { opacity: 0.4; }

  .gb-form { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 48px; }
  .gb-form-title { padding: 10px 0 8px; font-size: 10px; letter-spacing: 0.12em; color: var(--muted); }
  .gb-form-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); }
  .gb-form-row input { width: 100%; box-sizing: border-box; padding: 12px 0; border: none; background: transparent; font: inherit; font-size: 13px; color: var(--text); outline: none; }
  .gb-form-row input:first-child { padding-right: 16px; border-right: 1px solid var(--border); }
  .gb-form-row input:last-child { padding-left: 16px; }
  .gb-form-row input::placeholder, .gb-form textarea::placeholder { color: var(--muted); }
  .gb-form textarea { display: block; width: 100%; min-height: 90px; box-sizing: border-box; padding: 14px 0; border: none; border-top: 1px solid var(--border); background: transparent; font: inherit; font-size: 13px; line-height: 1.8; color: var(--text); resize: vertical; outline: none; }
  .gb-form-bottom { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-top: 1px solid var(--border); }
  .gb-secret { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); cursor: pointer; }
  #gb-submit { padding: 7px 16px; border: 1px solid var(--text); border-radius: 999px; background: var(--text); color: var(--bg); font: inherit; font-size: 12px; cursor: pointer; }
  #gb-submit:hover { opacity: 0.8; }
  #gb-submit:disabled { opacity: 0.4; cursor: default; }

  .gb-list { list-style: none; margin: 0; padding: 0; }
  .gb-empty { padding: 30px 0; color: var(--muted); font-size: 13px; }

  .gb-item { position: relative; display: grid; grid-template-columns: 68px 1fr; column-gap: 24px; padding: 20px 0 26px; border-bottom: 1px solid var(--border); }
  .gb-item:first-child { border-top: 1px solid var(--border); }
  .gb-item-name { display: block; font-size: 13px; font-weight: 600; color: var(--text); }
  .gb-item-date { display: block; margin-top: 4px; font-size: 10px; color: var(--muted); }
  .gb-item-main { min-width: 0; }
  .gb-item-body p { margin: 0 0 1.1em; font-size: 14px; line-height: 1.8; color: var(--text); white-space: pre-wrap; word-break: break-word; }
  .gb-item-body p:last-child { margin-bottom: 0; }

  .gb-del-btn { display: none; position: absolute; right: 0; border: none; background: none; color: var(--muted); font-size: 14px; padding: 2px 4px; cursor: pointer; }
  body.gb-is-owner .gb-del-btn { display: inline-block; }
  .gb-del-btn:hover { color: #c0392b; }
  .gb-item .gb-del-btn { top: 18px; }
  .gb-reply .gb-del-btn { top: 14px; }

  .gb-secret-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-height: 28px; font-size: 13px; color: var(--muted); }
  .gb-reply-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .gb-secret-row input { width: 70px; padding: 5px 8px; font-size: 13px; border: 1px solid var(--border); border-radius: 999px; background: transparent; color: var(--text); outline: none; }
  .gb-secret-row button { padding: 5px 10px; font-size: 12px; border: 1px solid var(--border); border-radius: 999px; background: transparent; color: var(--text); cursor: pointer; }
  .gb-secret-row button:hover { background: var(--border); }

  .gb-replies { list-style: none; margin: 26px 0 0; padding: 0; }
  .gb-reply { position: relative; display: grid; grid-template-columns: 68px 1fr; column-gap: 24px; padding: 16px 0 0; }
  .gb-reply-name { display: block; font-size: 13px; font-weight: 600; color: var(--text); }
  .gb-reply-date { display: block; margin-top: 4px; font-size: 10px; color: var(--muted); }
  .gb-reply-main { min-width: 0; }
  .gb-reply-body p { margin: 0 0 1em; font-size: 13px; line-height: 1.75; color: var(--text); white-space: pre-wrap; word-break: break-word; }
  .gb-reply-body p:last-child { margin-bottom: 0; }

  .gb-images { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; max-width: 480px; }
  .gb-image { display: block; width: 100%; height: auto; border-radius: 2px; background: var(--border); }

  .gb-reply-form { display: none; margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border); }
  body.gb-is-owner .gb-reply-form { display: block; }
  .gb-reply-form textarea { display: block; width: 100%; min-height: 40px; max-height: 160px; box-sizing: border-box; padding: 0 0 8px; border: none; background: transparent; font: inherit; font-size: 13px; line-height: 1.6; color: var(--text); resize: none; overflow: hidden; outline: none; }
  .gb-reply-tools { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border); }
  .gb-reply-file-label { font-size: 11px; color: var(--muted); cursor: pointer; }
  .gb-reply-file-label:hover { color: var(--text); }
  .gb-reply-file-label input { display: none; }
  .gb-reply-submit { padding: 5px 12px; font-size: 11px; border: 1px solid var(--border); border-radius: 999px; background: transparent; color: var(--text); cursor: pointer; }
  .gb-reply-submit:hover { background: var(--border); }
  .gb-reply-submit:disabled { opacity: 0.4; cursor: default; }

  .gb-upload-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .gb-upload-thumb { position: relative; width: 48px; height: 48px; border: 1px solid var(--border); overflow: hidden; }
  .gb-upload-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gb-upload-remove { position: absolute; top: 1px; right: 1px; width: 15px; height: 15px; border: none; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; font-size: 9px; line-height: 15px; text-align: center; cursor: pointer; padding: 0; }

  /* ---- 유리구슬 돋보기: 목록 위에 마우스를 올리면 그 자리만 확대되는 원형 렌즈 ---- */
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
  .gb-lens-inner .gb-item { border-top: none; }
  .gb-lens-inner .gb-del-btn,
  .gb-lens-inner .gb-reply-form,
  .gb-lens-inner .gb-secret-row button,
  .gb-lens-inner .gb-secret-row input { display: none !important; }

  @media (max-width: 700px) {
    .gb-form-row { grid-template-columns: 1fr; }
    .gb-form-row input:first-child { border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; }
    .gb-form-row input:last-child { padding-left: 0; }
    .gb-item, .gb-reply { grid-template-columns: 1fr; row-gap: 6px; }
    .gb-item-name, .gb-reply-name { display: inline; }
    .gb-item-date, .gb-reply-date { display: inline; margin-top: 0; margin-left: 8px; }
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

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  const gbRef = collection(db, "guestbook");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // 빈 줄 기준으로 문단을 나누고 줄바꿈은 <br>로 유지한다. innerHTML을 쓰지 않아
  // 방문자가 입력한 텍스트가 그대로 마크업으로 해석되는 일이 없다.
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("gb-name").value.trim();
    const pw = document.getElementById("gb-pw").value.trim();
    const content = document.getElementById("gb-content").value.trim();
    const secret = document.getElementById("gb-secret").checked;
    if (!name || !/^[0-9]{4}$/.test(pw) || !content) {
      alert("닉네임, 4자리 숫자 비밀번호, 내용을 모두 입력해주세요.");
      return;
    }
    const submitBtn = document.getElementById("gb-submit");
    submitBtn.disabled = true;
    try {
      const passwordHash = await sha256(pw);
      await addDoc(gbRef, { name, passwordHash, content, secret, createdAt: serverTimestamp() });
      form.reset();
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
        const date = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString("ko-KR") : "";

        const li = document.createElement("li");
        li.className = "gb-reply";

        const head = document.createElement("div");
        head.innerHTML = '<span class="gb-reply-name"></span><span class="gb-reply-date"></span>';
        // 과거에 j0ah0로 저장된 답글도 화면에는 항상 하영으로 보이게 한다.
        head.querySelector(".gb-reply-name").textContent = REPLY_NAME;
        head.querySelector(".gb-reply-date").textContent = date;

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

        li.appendChild(head);
        li.appendChild(main);
        li.appendChild(delBtn);
        container.appendChild(li);
      });
      refreshLensIfShowing();
    });
  }

  // ---- 답글 작성 폼 (이름은 항상 하영으로 고정, 사진 여러 장 첨부 가능) ----
  function buildReplyForm(entryId) {
    const wrap = document.createElement("div");
    wrap.className = "gb-reply-form";
    wrap.innerHTML =
      '<textarea class="gb-reply-content" maxlength="500" placeholder="답글을 입력해주세요. (Enter: 등록 / Shift+Enter: 줄바꿈)" rows="1"></textarea>' +
      '<div class="gb-upload-preview"></div>' +
      '<div class="gb-reply-tools">' +
      '<label class="gb-reply-file-label">+ 사진<input type="file" class="gb-reply-file" accept="image/*" multiple></label>' +
      '<button type="button" class="gb-reply-submit">답글 등록</button>' +
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
        // 문서 ID를 먼저 만들어두고 사진을 그 ID 경로로 올린 다음, 완성된 데이터를 한 번에 저장한다.
        // (이미지 URL을 나중에 따로 update하지 않는 이유: Firestore 규칙이 답글 update를
        //  deleted/deletedAt 필드로만 제한해두었기 때문)
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
      if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); submit(); }
    });
    contentInput.addEventListener("input", () => {
      contentInput.style.height = "";
      contentInput.style.height = Math.min(contentInput.scrollHeight, 160) + "px";
    });
    return wrap;
  }

  // ---- 비밀글이 아닌 글(또는 비밀번호가 맞은 글): 본문 + 답글 목록 + 답글 폼 붙이기 ----
  function renderOpen(li, entryId, content) {
    const main = li.querySelector(".gb-item-main");

    const body = document.createElement("div");
    body.className = "gb-item-body";
    renderParagraphs(body, content);
    main.appendChild(body);

    const repliesEl = document.createElement("ul");
    repliesEl.className = "gb-replies";
    main.appendChild(repliesEl);
    attachReplies(entryId, repliesEl);

    main.appendChild(buildReplyForm(entryId));
  }

  // ---- 목록 렌더링 ----
  const list = document.getElementById("gb-list");
  const q = query(gbRef, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.filter((d) => !d.data().deleted);
    if (docs.length === 0) {
      list.innerHTML = '<li class="gb-empty">아직 남긴 글이 없어요. 첫 방명록을 남겨보세요!</li>';
      hideLens();
      return;
    }
    list.innerHTML = "";
    docs.forEach((docSnap) => {
      const d = docSnap.data();
      const entryId = docSnap.id;
      const li = document.createElement("li");
      li.className = "gb-item";
      const date = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString("ko-KR") : "";

      const author = document.createElement("div");
      author.innerHTML = '<span class="gb-item-name"></span><span class="gb-item-date"></span>';
      author.querySelector(".gb-item-name").textContent = d.name;
      author.querySelector(".gb-item-date").textContent = date;

      const main = document.createElement("div");
      main.className = "gb-item-main";

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "gb-del-btn";
      delBtn.title = "삭제";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => handleDelete(entryId));

      li.appendChild(author);
      li.appendChild(main);
      li.appendChild(delBtn);

      if (d.secret) {
        const row = document.createElement("div");
        row.className = "gb-secret-row";
        if (getFailCount(entryId) >= MAX_TRIES) {
          row.textContent = "🔒 비밀번호를 5회 이상 틀려서 더 이상 열람할 수 없습니다.";
        } else {
          row.innerHTML = '🔒 비밀글입니다<span class="gb-reply-dot" style="display:none;" title="답글이 있어요"></span> <input type="password" maxlength="4" inputmode="numeric" placeholder="비밀번호"> <button type="button">확인</button>';
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

  // ---- 유리구슬 돋보기: 데스크톱에서 방명록 위에 마우스를 올리면 그 부분만 확대해 보여준다 ----
  const lens = document.getElementById("gb-lens");
  const lensInner = document.getElementById("gb-lens-inner");
  const LENS_SIZE = 180;
  const LENS_SCALE = 1.6;
  let lensItem = null;
  let lensX = 0;
  let lensY = 0;
  let lensFrame = null;

  function showLens(item, x, y) {
    if (window.innerWidth <= 700 || !item || !item.isConnected) return;
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

  // 답글이 실시간으로 추가/삭제돼 내용이 바뀌면, 지금 보고 있는 렌즈도 최신 내용으로 다시 그린다.
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
