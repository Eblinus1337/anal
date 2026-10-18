/* vbiverr · common.js — полный: шапка, подвал, модалка, настройки, курсор, снег, стекло, лого */
(function () {
  "use strict";

  window.CD_LOGO = {
    siteName: "vbiverr",
    weekday: "◈",
    weekend: "✦",
    weekdayImg: "/logo-week.png",
    weekendImg: "/logo-weekend.png"
  };
  function isWeekend() { var d = new Date().getDay(); return d === 0 || d === 6; }
  function cdLogoHTML() {
    var w = isWeekend();
    var img = w ? window.CD_LOGO.weekendImg : window.CD_LOGO.weekdayImg;
    var txt = w ? window.CD_LOGO.weekend : window.CD_LOGO.weekday;
    var name = window.CD_LOGO.siteName;
    if (img) return '<a href="/" class="logo"><img src="' + img + '" alt="' + name + '" style="width:15px;height:15px;border-radius:1px;object-fit:cover;"><span>' + name + '</span></a>';
    return '<a href="/" class="logo"><span class="mark">' + txt + '</span>' + name + '</a>';
  }

  var NAV_ITEMS = [
    { href: "/how-it-works/", label: "Как это работает", key: "how" },
    { href: "/exchange/", label: "Обменник", key: "exchange" },
    { href: "/market/", label: "Маркетплейс", key: "market" },
    { href: "/crowdfunding/", label: "Сборы", key: "funds" },
    { href: "/blockchain/", label: "Контракт-чейн", key: "chain" },
    { href: "/forum/", label: "Форум", key: "forum" },
    { href: "/disputes/", label: "Диспуты", key: "disputes" },
    { href: "/account/", label: "Кабинет", key: "cabinet" }
  ];
  var FOOTER_PRODUCT = [
    { href: "/exchange/", label: "Обменник" },
    { href: "/market/", label: "Маркетплейс" },
    { href: "/crowdfunding/", label: "Сборы" },
    { href: "/disputes/", label: "Арбитраж" }
  ];
  var FOOTER_RESOURCES = [
    { href: "/how-it-works/", label: "Как это работает" },
    { href: "/blockchain/", label: "Контракт-чейн" },
    { href: "/blockchain/", label: "Whitepaper" },
    { href: "/blockchain/", label: "GitHub · аудит" }
  ];
  var FOOTER_SUPPORT = [
    { href: "/forum/", label: "Форум" },
    { href: "/disputes/", label: "Открыть диспут" },
    { href: "/account/", label: "Личный кабинет" }
  ];

  function el(tag, attrs, html) {
    var n = document.createElement(tag); attrs = attrs || {};
    for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "hidden") n.hidden = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html) n.innerHTML = html;
    return n;
  }

  function getActiveKey() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("how-it-works") !== -1) return "how";
    if (p.indexOf("exchange") !== -1) return "exchange";
    if (p.indexOf("market") !== -1) return "market";
    if (p.indexOf("crowd") !== -1) return "funds";
    if (p.indexOf("blockchain") !== -1) return "chain";
    if (p.indexOf("forum") !== -1) return "forum";
    if (p.indexOf("dispute") !== -1) return "disputes";
    if (p.indexOf("account") !== -1) return "cabinet";
    if (document.body && document.body.dataset.page) return document.body.dataset.page;
    return "home";
  }

  function buildHeader(active) {
    var h = el("header");
    var links = NAV_ITEMS.map(function (i) {
      return '<a href="' + i.href + '"' + (i.key === active ? ' class="active" aria-current="location"' : "") + '>' + i.label + '</a>';
    }).join("");
    h.innerHTML = '<div class="container nav">' + cdLogoHTML() + '<nav class="nav-links" id="navLinks">' + links + '</nav><span id="auth-area"><button class="btn btn-primary btn-wallet" onclick="openModal()">Подключить кошелёк</button></span><button class="burger" id="burger" aria-label="Меню">☰</button></div>';
    return h;
  }
  function buildFooter() {
    var f = el("footer");
    function lk(a) { return '<a href="' + a.href + '">' + a.label + '</a>'; }
    f.innerHTML = '<div class="container"><div class="foot-grid"><div>' + cdLogoHTML() + '<p class="muted" style="font-size:13px;margin-top:12px;max-width:280px;">P2P-маркетплейс. Эскроу, обмены, сборы.</p></div><div><h4>Продукт</h4>' + FOOTER_PRODUCT.map(lk).join("") + '</div><div><h4>Ресурсы</h4>' + FOOTER_RESOURCES.map(lk).join("") + '</div><div><h4>Акк</h4>' + FOOTER_SUPPORT.map(lk).join("") + '</div></div><div class="disclaimer">vbiverr не хранит средства. Все сделки — через контракты Base.</div></div>';
    return f;
  }
  function buildWalletModal() {
    var m = el("div", { class: "modal-back", id: "walletModal" });
    m.innerHTML = '<div class="modal"><h3>Подключить кошелёк</h3><p class="modal-sub">Только MetaMask. Без почты.</p><div id="mm-step-connect"><button class="wallet-opt" id="btn-metamask"><span class="wallet-ico" style="background:rgba(255,140,0,.15);color:#ff8c00;">M</span><span id="mm-label">MetaMask — подключить</span></button></div><div id="mm-step-register" style="display:none;"><label style="display:block;font-size:13px;color:var(--muted);margin:12px 0 6px;">Выбери никнейм</label><input id="mm-nick" placeholder="например eblinus" maxlength="20" style="width:100%;<label style="display:flex;align-items:center;gap:8px;font-size:13px;margin:12px 0 6px;cursor:pointer;">
  <input type="checkbox" id="mm-show-funds" style="width:18px;height:18px;">
  показывать мои средства сайту
  <span id="mm-chains-arrow" style="margin-left:auto;cursor:pointer;user-select:none;">></span>
</label>
<div id="mm-chains-list" style="display:none;border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:10px;">
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="eth" checked> ETH — Ethereum</label>
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="base" checked> ETH — Base</label>
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="bnb"> BNB — BNB Chain</label>
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="usdt-eth"> USDT — Ethereum</label>
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="usdt-base"> USDT — Base</label>
  <label style="display:flex;gap:8px;font-size:13px;padding:4px 0;"><input type="checkbox" data-chain="btc"> BTC — только адрес для просмотра</label>
  <input id="mm-btc-addr" placeholder="bc1... (если хочешь показать BTC)" style="width:100%;margin-top:8px;padding:10px;border-radius:8px;background:var(--bg2);color:var(--text);border:1px solid var(--border);">
  <p class="muted" id="mm-consent-preview" style="font-size:11px;margin-top:8px;"></p>
</div> background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font:inherit;"><button class="btn btn-primary" id="btn-save-nick" type="button" style="width:100%;justify-content:center;margin-top:12px;">Занять ник</button></div><div id="mm-step-done" style="display:none;"><p>С возвращением, <b id="mm-done-nick">anon</b></p><button class="btn btn-primary" type="button" onclick="closeModal()" style="width:100%;justify-content:center;margin-top:12px;">Продолжить</button></div><p class="muted mono" id="mm-addr" style="font-size:12px;margin-top:10px;"></p><button class="modal-close" onclick="closeModal()">Закрыть</button></div>';
    return m;
  }
  function buildFab() {
    var b = el("button", { class: "settings-fab", id: "settingsFab", title: "Настройки", "aria-label": "Настройки" });
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="22" height="22"><path d="m9.7 3-.6 2.1-1.7 1-2.1-.5L3 9.4 4.5 11v2L3 14.6l2.3 3.8 2.1-.5 1.7 1 .6 2.1h4.6l.6-2.1 1.7-1 2.1.5 2.3-3.8-1.5-1.6v-2L21 9.4l-2.3-3.8-2.1.5-1.7-1L14.3 3Z"/><circle cx="12" cy="12" r="3"/></svg>';
    return b;
  }
  function buildPanel() {
    var p = el("div", { class: "settings-panel", id: "settingsPanel", role: "dialog", "aria-modal": "false" });
    p.hidden = true;
    p.innerHTML = '<div class="cd-panel-head"><div><small>ПЕРСОНАЛИЗАЦИЯ</small><h3>Ваше пространство</h3></div><button type="button" id="cdClose">✕</button></div><fieldset><legend>01 · Оформление</legend><label class="cd-field">Тема<select id="cdTheme"><option value="dark">Тёмная</option><option value="light">Светлая</option><option value="system">Как в системе</option></select></label><label class="cd-field">Обои<select id="cdWall"><option value="plain">Чистый фон</option><option value="aurora">Северное сияние</option><option value="contour">Тихие контуры</option><option value="mist">Мягкий туман</option></select></label></fieldset><fieldset><legend>02 · Стекло</legend><label class="cd-field">Жидкое стекло<input type="checkbox" id="cdGlass"></label><label class="cd-field">Устройство<select id="cdPower"><option value="low">Слабое</option><option value="medium">Среднее</option><option value="high">Мощное</option></select></label><p class="cd-hint" id="cdPowerHint"></p><label class="cd-slider">Прозрачность <output id="cdAlphaOut"></output><input id="cdAlpha" type="range" min="0" max="65" step="1"></label></fieldset><fieldset><legend>03 · Курсор</legend><label class="cd-field">Курсор-капля<input id="cdDrop" type="checkbox"></label></fieldset><fieldset><legend>04 · Снег</legend><label class="cd-field">Снежинки<input type="checkbox" id="cdSnow"></label><label class="cd-slider">Количество <output id="cdCountOut"></output><input id="cdCount" type="range" min="5" max="60" step="1"></label></fieldset><button id="cdReset" class="btn btn-ghost" type="button">Сбросить</button>';
    return p;
  }

  function inject() {
    if (!document.body || document.body.dataset.cdInjected === "1") return;
    document.body.dataset.cdInjected = "1";
    document.body.insertBefore(buildHeader(getActiveKey()), document.body.firstChild);
    document.body.appendChild(buildFooter());
    document.body.appendChild(buildWalletModal());
    document.body.appendChild(buildFab());
    document.body.appendChild(buildPanel());
    var d = el("div", { class: "demo-notice" }); d.textContent = "vbiverr — демо. Балансы не настоящие.";
    document.body.appendChild(d);
    var wm = document.getElementById("walletModal");
    if (wm) wm.addEventListener("click", function (e) { if (e.target.id === "walletModal") window.closeModal(); });
  }
  window.openModal = function () { var m = document.getElementById("walletModal"); if (m) m.classList.add("open"); };
  window.closeModal = function () { var m = document.getElementById("walletModal"); if (m) m.classList.remove("open"); };
  inject();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);

  var cdDef = { theme: "dark", wall: "plain", glass: false, power: "medium", alpha: 20, snow: false, count: 24, drop: true };
  var cd = Object.assign({}, cdDef);
  try { var sv = JSON.parse(localStorage.getItem("chaindeal.appearance.v2") || "{}"); for (var k in cdDef) if (typeof sv[k] === typeof cdDef[k]) cd[k] = sv[k]; } catch (e) {}
  var cdEl = function (id) { return document.getElementById(id); };
  var snowSync = function () {};
  function cdApply(save) {
    if (!document.body) return;
    var b = document.body;
    b.dataset.cdTheme = cd.theme; b.dataset.cdWall = cd.wall; b.dataset.cdPower = cd.power;
    b.classList.toggle("glass", !!cd.glass);
    b.style.setProperty("--cd-opacity", String(1 - cd.alpha / 100));
    function sv2(id, v) { var n = cdEl(id); if (n) n.value = v; }
    function sc(id, v) { var n = cdEl(id); if (n) n.checked = v; }
    sv2("cdTheme", cd.theme); sv2("cdWall", cd.wall); sv2("cdPower", cd.power);
    sc("cdGlass", cd.glass); sc("cdSnow", cd.snow);
    sv2("cdAlpha", cd.alpha); sv2("cdCount", cd.count);
    var o1 = cdEl("cdAlphaOut"); if (o1) o1.textContent = cd.alpha + "%";
    var o2 = cdEl("cdCountOut"); if (o2) o2.textContent = cd.count;
    if (save) try { localStorage.setItem("chaindeal.appearance.v2", JSON.stringify(cd)); } catch (e) {}
    snowSync();
  }
  function bindCtl() {
    [["cdTheme","theme"],["cdWall","wall"],["cdPower","power"],["cdGlass","glass"],["cdSnow","snow"],["cdAlpha","alpha"],["cdCount","count"],["cdDrop","drop"]].forEach(function (pr) {
      var n = cdEl(pr[0]); if (!n) return;
      n.addEventListener(n.type === "range" ? "input" : "change", function () {
        cd[pr[1]] = n.type === "checkbox" ? n.checked : n.type === "range" ? +n.value : n.value; cdApply(true);
      });
    });
    var rs = cdEl("cdReset"); if (rs) rs.addEventListener("click", function () { cd = Object.assign({}, cdDef); cdApply(true); });
    var fab = cdEl("settingsFab"), panel = cdEl("settingsPanel"), cl = cdEl("cdClose");
    if (fab && panel) {
      fab.addEventListener("click", function () { panel.hidden = !panel.hidden; panel.classList.toggle("open", !panel.hidden); });
      if (cl) cl.addEventListener("click", function () { panel.hidden = true; panel.classList.remove("open"); });
    }
  }
  function initReveal() {
    var ns = document.querySelectorAll(".reveal"); if (!ns.length) return;
    if (!("IntersectionObserver" in window)) { ns.forEach(function (n) { n.classList.add("visible"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }); }, { threshold: 0.12 });
    ns.forEach(function (n) { io.observe(n); });
  }

  (function snow() {
    var cv = document.createElement("canvas"); cv.id = "cdSnowCanvas"; document.body.appendChild(cv);
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var W = 0, H = 0, fl = [], raf = 0, last = 0;
    function rs() { W = document.documentElement.clientWidth; H = innerHeight; cv.width = W; cv.height = H; cv.style.width = W + "px"; cv.style.height = H + "px"; }
    function fr(t) {
      raf = 0; if (!cd.snow || document.hidden) return;
      if (t - last < 33) { raf = requestAnimationFrame(fr); return; }
      last = t; while (fl.length < 50) fl.push({ x: Math.random() * W, y: Math.random() * H });
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = "rgba(233,244,255,.8)";
      fl.forEach(function (f) { f.y += 1.2; if (f.y > H) f.y = -5; ctx.beginPath(); ctx.moveTo(f.x - 2, f.y); ctx.lineTo(f.x + 2, f.y); ctx.stroke(); });
      raf = requestAnimationFrame(fr);
    }
    snowSync = function () { rs(); var on = !!cd.snow && !document.hidden; cv.hidden = !on; if (on && !raf) raf = requestAnimationFrame(fr); if (!on && raf) { cancelAnimationFrame(raf); raf = 0; } };
    addEventListener("resize", rs, { passive: true }); snowSync();
  })();

  (function cursor() {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    var d = document.createElement("div"); d.className = "drop"; d.innerHTML = "<i></i>"; document.body.appendChild(d);
    var tx = -100, ty = -100, x = -100, y = -100, raf = 0;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; d.classList.add("show"); if (!raf) raf = requestAnimationFrame(function f() { x = tx; y = ty; d.style.transform = "translate3d(" + x + "px," + y + "px,0)"; raf = requestAnimationFrame(f); }); }, { passive: true });
    document.body.classList.add("has-drop");
  })();

  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("#burger")) { var nl = document.getElementById("navLinks"); if (nl) nl.classList.toggle("open"); }
  });

  cdApply(false); bindCtl(); initReveal();
  window.__LOGO = { isWeekend: isWeekend };
  window.__FX = { toggleGlass: function () { cd.glass = !cd.glass; cdApply(true); }, toggleSnow: function () { cd.snow = !cd.snow; cdApply(true); } };
})();