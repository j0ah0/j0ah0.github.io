---
layout: page
title: Board
permalink: /board/
---

<div id="gb-auth" class="gb-auth"></div>

<div id="gb-app">
  <form id="gb-form" class="gb-form">
    <div class="gb-row">
      <input type="text" id="gb-name" placeholder="이름" maxlength="20" required>
      <input type="password" id="gb-pw" placeholder="비밀번호" maxlength="4" inputmode="numeric" pattern="[0-9]{4}" required>
    </div>
    <textarea id="gb-content" placeholder="여러분의 소중한 댓글을 입력해주세요." maxlength="500" required></textarea>
    <div class="gb-row gb-row-bottom">
      <label class="gb-secret"><input type="checkbox" id="gb-secret"> 비밀글</label>
      <button type="submit" id="gb-submit">등록</button>
    </div>
  </form>

  <ul id="gb-list" class="gb-list"></ul>
</div>

<style>
  .gb-auth { text-align: right; font-size: 13px; color: var(--muted); margin-bottom: 10px; min-height: 26px; }
  .gb-auth button {
    font-size: 13px; padding: 5px 12px; border: 1px solid var(--border); border-radius: 4px;
    background: #fff; cursor: pointer; color: var(--text);
  }
  .gb-auth button:hover { background: #f2f2f2; }
  #gb-login { opacity: 0; border-color: transparent; background: transparent; }
  #gb-login:hover { background: transparent; }
  .gb-form { border: 1px solid var(--border); border-radius: 6px; overflow: hidden; margin-bottom: 30px; }
  .gb-row { display: flex; }
  .gb-row input[type="text"], .gb-row input[type="password"] {
    flex: 1; border: none; border-bottom: 1px solid var(--border); padding: 14px; font-size: 15px;
    font-family: inherit; background: transparent; color: var(--text);
  }
  .gb-row input[type="text"] { border-right: 1px solid var(--border); }
  .gb-form textarea {
    width: 100%; min-height: 90px; border: none; padding: 14px; font-size: 15px;
    font-family: inherit; resize: vertical; box-sizing: border-box; background: transparent; color: var(--text);
  }
  .gb-row-bottom { align-items: center; justify-content: space-between; padding: 10px 14px; border-top: 1px solid var(--border); }
  .gb-secret { font-size: 14px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  #gb-submit {
    background: #222; color: #fff; border: none; padding: 10px 22px; border-radius: 4px;
    font-size: 14px; cursor: pointer;
  }
  #gb-submit:hover { background: #000; }
  .gb-list { list-style: none; padding: 0; margin: 0; }
  .gb-item { border-bottom: 1px solid var(--border); padding: 14px 0; }
  .gb-item-head { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
  .gb-item-head-left { display: flex; align-items: baseline; gap: 8px; }
  .gb-item-name { font-weight: 600; color: var(--text); }
  .gb-del-btn { display: none; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 15px; line-height: 1; padding: 2px 4px; }
  body.gb-is-owner .gb-del-btn { display: inline-block; }
  .gb-del-btn:hover { color: #c0392b; }
  .gb-item-body { font-size: 15px; white-space: pre-wrap; word-break: break-word; }
  .gb-secret-row { display: flex; gap: 8px; align-items: center; color: var(--muted); font-size: 14px; }
  .gb-secret-row input { width: 70px; padding: 4px 8px; font-size: 13px; }
  .gb-secret-row button { font-size: 13px; padding: 4px 10px; cursor: pointer; }
  .gb-empty { color: var(--muted); font-size: 14px; padding: 10px 0; }

  .gb-replies { list-style: none; margin: 10px 0 0 20px; padding: 0; border-left: 2px solid var(--border); }
  .gb-reply { padding: 8px 0 8px 12px; }
  .gb-reply-head { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted); margin-bottom: 3px; }
  .gb-reply-name { font-weight: 600; color: var(--text); margin-right: 6px; }
  .gb-reply-body { font-size: 14px; white-space: pre-wrap; word-break: break-word; }
  .gb-reply-form { display: none; gap: 6px; margin: 10px 0 0 20px; }
  body.gb-is-owner .gb-reply-form { display: flex; }
  .gb-reply-form input[type="text"] { width: 90px; font-size: 13px; padding: 6px 8px; border: 1px solid var(--border); border-radius: 4px; }
  .gb-reply-form input[type="text"].gb-reply-content { flex: 1; width: auto; }
  .gb-reply-form button { font-size: 13px; padding: 6px 12px; border: 1px solid var(--border); border-radius: 4px; background: #fff; cursor: pointer; }
  .gb-reply-form button:hover { background: #f2f2f2; }
</style>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc, doc, deleteDoc,
    query, orderBy, onSnapshot, serverTimestamp
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import {
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const gbRef = collection(db, "guestbook");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
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
      alert("이름, 4자리 숫자 비밀번호, 내용을 모두 입력해주세요.");
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

  // ---- 글 삭제 (관리자 로그인 상태에서만 버튼이 보임 + Firestore 규칙에서도 이중 확인) ----
  async function handleDelete(entryId) {
    if (!isOwner) return;
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "guestbook", entryId));
    } catch (err) {
      alert("삭제에 실패했어요: " + err.message);
    }
  }

  // ---- 답글 삭제 (관리자만) ----
  async function handleDeleteReply(entryId, replyId) {
    if (!isOwner) return;
    if (!confirm("답글을 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "guestbook", entryId, "replies", replyId));
    } catch (err) {
      alert("답글 삭제에 실패했어요: " + err.message);
    }
  }

  // ---- 답글 목록 실시간 렌더링 ----
  function attachReplies(entryId, container) {
    const repliesRef = collection(db, "guestbook", entryId, "replies");
    const rq = query(repliesRef, orderBy("createdAt", "asc"));
    onSnapshot(rq, (snap) => {
      container.innerHTML = "";
      snap.forEach((r) => {
        const d = r.data();
        const replyId = r.id;
        const date = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString("ko-KR") : "";
        const li = document.createElement("li");
        li.className = "gb-reply";
        const head = document.createElement("div");
        head.className = "gb-reply-head";
        head.innerHTML =
          '<span><span class="gb-reply-name"></span><span class="gb-reply-date"></span></span>' +
          '<button type="button" class="gb-del-btn" title="삭제">✕</button>';
        head.querySelector(".gb-reply-name").textContent = d.name;
        head.querySelector(".gb-reply-date").textContent = date;
        head.querySelector(".gb-del-btn").addEventListener("click", () => handleDeleteReply(entryId, replyId));
        const body = document.createElement("div");
        body.className = "gb-reply-body";
        body.textContent = d.content;
        li.appendChild(head);
        li.appendChild(body);
        container.appendChild(li);
      });
    });
  }

  // ---- 답글 작성 폼 (이름은 항상 j0ah0로 고정) ----
  const REPLY_NAME = "j0ah0";
  function buildReplyForm(entryId) {
    const wrap = document.createElement("div");
    wrap.className = "gb-reply-form";
    wrap.innerHTML =
      '<input type="text" class="gb-reply-content" placeholder="답글을 입력해주세요.">' +
      '<button type="button">답글 등록</button>';
    const contentInput = wrap.querySelector(".gb-reply-content");
    const btn = wrap.querySelector("button");
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
        await addDoc(collection(db, "guestbook", entryId, "replies"), {
          name: REPLY_NAME, content, createdAt: serverTimestamp()
        });
        contentInput.value = "";
      } catch (err) {
        alert("답글 등록에 실패했어요: " + err.message);
      } finally {
        btn.disabled = false;
      }
    };
    btn.addEventListener("click", submit);
    contentInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); submit(); } });
    return wrap;
  }

  // ---- 비밀글이 아닌 글: 본문 + 답글 목록 + 답글 폼 붙이기 ----
  function renderOpen(li, entryId, content) {
    const body = document.createElement("div");
    body.className = "gb-item-body";
    body.textContent = content;
    li.appendChild(body);

    const repliesEl = document.createElement("ul");
    repliesEl.className = "gb-replies";
    li.appendChild(repliesEl);
    attachReplies(entryId, repliesEl);

    li.appendChild(buildReplyForm(entryId));
  }

  // ---- 목록 렌더링 ----
  const list = document.getElementById("gb-list");
  const q = query(gbRef, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      list.innerHTML = '<li class="gb-empty">아직 남긴 글이 없어요. 첫 방명록을 남겨보세요!</li>';
      return;
    }
    list.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const entryId = docSnap.id;
      const li = document.createElement("li");
      li.className = "gb-item";
      const date = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString("ko-KR") : "";

      const head = document.createElement("div");
      head.className = "gb-item-head";
      head.innerHTML =
        '<span class="gb-item-head-left"><span class="gb-item-name"></span><span class="gb-item-date"></span></span>' +
        '<button type="button" class="gb-del-btn" title="삭제">✕</button>';
      head.querySelector(".gb-item-name").textContent = d.name;
      head.querySelector(".gb-item-date").textContent = date;
      head.querySelector(".gb-del-btn").addEventListener("click", () => handleDelete(entryId));
      li.appendChild(head);

      if (d.secret) {
        const row = document.createElement("div");
        row.className = "gb-secret-row";
        if (getFailCount(entryId) >= MAX_TRIES) {
          row.textContent = "🔒 비밀번호를 5회 이상 틀려서 더 이상 열람할 수 없습니다.";
        } else {
          row.innerHTML = '🔒 비밀글입니다 <input type="password" maxlength="4" inputmode="numeric" placeholder="비밀번호"> <button type="button">확인</button>';
          const input = row.querySelector("input");
          const btn = row.querySelector("button");
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
        li.appendChild(row);
      } else {
        renderOpen(li, entryId, d.content);
      }
      list.appendChild(li);
    });
  }, (err) => {
    list.innerHTML = '<li class="gb-empty">방명록을 불러오지 못했어요: ' + err.message + '</li>';
  });
</script>
