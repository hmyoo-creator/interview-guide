/* 페이지를 그리는 코드예요. 문구 수정은 content 폴더에서 해주세요. */
(function () {
  var root = document.getElementById("app");
  var C = window.COMMON, T = window.TRACK;

  if (!C || !T) {
    var which = !C ? "content/common.js" : "content/" + (document.body.dataset.track || "") + ".js";
    root.innerHTML = '<div class="error"><strong>페이지를 불러오지 못했어요.</strong><br>' + which +
      ' 파일에 쉼표나 따옴표가 빠진 곳이 없는지 확인해주세요.</div>';
    return;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // **굵게**, 줄바꿈(\n) 처리
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }
  function list(a) { return Array.isArray(a) ? a : []; }

  var h = [];

  // 상단
  h.push('<div class="wrap"><div class="top">',
    '<img class="logo" src="../assets/logo.png" alt="OLIVE INTERNATIONAL" width="451" height="150">',
    '<p class="track">' + esc(T.전형이름) + ' 전형</p>',
    '<h1>인터뷰 가이드</h1>',
    '<p class="intro">' + fmt(C.인사말) + '</p>',
    '</div></div>');

  h.push('<main class="wrap">');

  // 진행 방식
  h.push('<section id="process"><h2>' + fmt(T.제목) + '</h2>');
  if (list(T.요약).length) {
    h.push('<div class="facts">' + list(T.요약).map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div>");
  }
  if (list(T.도식).length) {
    h.push('<ol class="flow" aria-label="전형 단계">' + list(T.도식).map(function (x, i) {
      return (i ? '<li class="arrow" aria-hidden="true"></li>' : "") + '<li class="box">' + fmt(x) + "</li>";
    }).join("") + "</ol>");
  }
  h.push('<div class="process">');
  list(T.단계).forEach(function (st) {
    var left = st.누구
      ? '<div><div class="name">' + esc(st.이름) + '</div><div class="who">' + esc(st.누구) + "</div></div>"
      : '<div class="name">' + esc(st.이름) + "</div>";
    var tips = list(st.팁).length
      ? "<ul>" + list(st.팁).map(function (t) { return "<li>" + fmt(t) + "</li>"; }).join("") + "</ul>"
      : "";
    h.push('<div class="prow' + (st.강조 ? " main" : "") + '">' + left +
      '<div class="body"><p>' + fmt(st.설명) + "</p>" + tips + "</div></div>");
  });
  h.push("</div>");
  if (T.추가안내) h.push('<div class="aside">' + fmt(T.추가안내) + "</div>");
  h.push("</section>");

  // 인터뷰 전 준비
  h.push('<section id="prepare"><h2>' + fmt(C.준비_제목) + '</h2><dl class="kv">');
  list(C.준비).forEach(function (r) { h.push("<div><dt>" + esc(r[0]) + "</dt><dd>" + fmt(r[1]) + "</dd></div>"); });
  h.push("</dl></section>");

  // 오시는 길
  h.push('<section id="location"><h2>' + fmt(C.오시는길_제목) + "</h2>",
    '<p class="addr">' + esc(C.주소) + "</p>",
    '<p class="addr-sub">' + esc(C.교통) + "</p>",
    '<div class="actions">',
    C.네이버지도_링크 ? '<a class="act" href="' + esc(C.네이버지도_링크) + '" target="_blank" rel="noopener">네이버 지도</a>' : "",
    C.카카오맵_링크 ? '<a class="act" href="' + esc(C.카카오맵_링크) + '" target="_blank" rel="noopener">카카오맵</a>' : "",
    '<button class="act" type="button" data-copy="' + esc(C.주소) + '">주소 복사</button>',
    "</div>",
    '<figure class="map"><img src="../assets/map.jpg" alt="강남역 8번 출구에서 사무실까지 가는 길" width="1137" height="811">',
    '<figcaption class="cap">' + fmt(C.지도_설명) + "</figcaption></figure></section>");

  // 도착 후
  h.push('<section id="arrival"><h2>' + fmt(C.도착_제목) + '</h2><div class="arrive"><ol class="seq">');
  list(C.도착).forEach(function (x) { h.push("<li><span>" + fmt(x) + "</span></li>"); });
  h.push("</ol>",
    '<figure><img src="../assets/elevator.jpg" alt="' + esc(C.엘리베이터_사진설명) + '" width="800" height="1065">',
    '<figcaption class="cap">' + esc(C.엘리베이터_사진설명) + "</figcaption></figure></div>");
  var tel = String(C.연락처 || "").replace(/[^0-9+]/g, "");
  h.push('<div class="callout"><div><div class="lbl">채용 담당자</div><div class="num">' + esc(C.연락처) + "</div></div>",
    '<div class="actions"><a class="act" href="tel:' + tel + '">전화하기</a>',
    '<button class="act" type="button" data-copy="' + esc(C.연락처) + '">번호 복사</button></div></div>');
  if (C.도착_참고) h.push('<p class="small">' + fmt(C.도착_참고) + "</p>");
  h.push("</section>");

  // FAQ (전형 질문 먼저, 공통 질문 다음)
  var faq = list(T.FAQ).concat(list(C.FAQ));
  if (faq.length) {
    h.push('<section id="faq"><h2>' + fmt(C.FAQ_제목) + '</h2><div class="faq">');
    faq.forEach(function (q) { h.push("<details><summary>" + fmt(q.질문) + "</summary><p>" + fmt(q.답변) + "</p></details>"); });
    h.push("</div></section>");
  }

  // 하단
  h.push("<footer>");
  list(C.하단_문구).forEach(function (x) { h.push("<p>" + fmt(x) + "</p>"); });
  if (C.팀메일) h.push('<p><a href="mailto:' + esc(C.팀메일) + '">' + esc(C.팀메일) + "</a></p>");
  if (C.채용페이지_링크) h.push('<p><a href="' + esc(C.채용페이지_링크) + '" target="_blank" rel="noopener">' + esc(C.채용페이지_이름 || C.채용페이지_링크) + "</a></p>");
  h.push("</footer></main>");
  h.push('<div class="toast" id="toast" role="status" aria-live="polite"></div>');

  root.innerHTML = h.join("");
  document.title = "올리브인터내셔널 인터뷰 가이드 (" + T.전형이름 + ")";

  // 복사 버튼
  var toast = document.getElementById("toast"), timer;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("show"); }, 1800); }
  root.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      try { navigator.clipboard.writeText(v).then(function () { say("복사했어요"); }, function () { say(v); }); }
      catch (e) { say(v); }
    });
  });
})();
