---
layout: page
title: Board
permalink: /board/
---

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
  .gb-item-head { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
  .gb-item-name { font-weight: 600; color: var(--text); margin-right: 8px; }
  .gb-item-body { font-size: 15px; white-space: pre-wrap; word-break: break-word; }
  .gb-secret-row { display: flex; gap: 8px; align-items: center; color: var(--muted); font-size: 14px; }
  .gb-secret-row input { width: 70px; padding: 4px 8px; font-size: 13px; }
  .gb-secret-row button { font-size: 13px; padding: 4px 10px; cursor: pointer; }
  .gb-empty { color: var(--muted); font-size: 14px; padding: 10px 0; }
</style>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAhTbvjRr06MX21Tau2X1o1OQvqHV9xWvI",
    authDomain: "pppppppp-2d15f.firebaseapp.com",
    projectId: "pppppppp-2d15f",
    storageBucket: "pppppppp-2d15f.firebasestorage.app",
    messagingSenderId: "204873249546",
    appId: "1:204873249546:web:92941490d06fea41c0c0f3"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const gbRef = collection(db, "guestbook");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

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
      const li = document.createElement("li");
      li.className = "gb-item";
      const date = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString("ko-KR") : "";
      const head = document.createElement("div");
      head.className = "gb-item-head";
      head.innerHTML = '<span><span class="gb-item-name"></span></span><span></span>';
      head.querySelector(".gb-item-name").textContent = d.name;
      head.lastElementChild.textContent = date;
      li.appendChild(head);

      if (d.secret) {
        const row = document.createElement("div");
        row.className = "gb-secret-row";
        row.innerHTML = '🔒 비밀글입니다 <input type="password" maxlength="4" inputmode="numeric" placeholder="비밀번호"> <button type="button">확인</button>';
        const input = row.querySelector("input");
        const btn = row.querySelector("button");
        const reveal = async () => {
          const hash = await sha256(input.value.trim());
          if (hash === d.passwordHash) {
            const body = document.createElement("div");
            body.className = "gb-item-body";
            body.textContent = d.content;
            row.replaceWith(body);
          } else {
            alert("비밀번호가 틀렸습니다.");
          }
        };
        btn.addEventListener("click", reveal);
        input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); reveal(); } });
        li.appendChild(row);
      } else {
        const body = document.createElement("div");
        body.className = "gb-item-body";
        body.textContent = d.content;
        li.appendChild(body);
      }
      list.appendChild(li);
    });
  }, (err) => {
    list.innerHTML = '<li class="gb-empty">방명록을 불러오지 못했어요: ' + err.message + '</li>';
  });
</script>
