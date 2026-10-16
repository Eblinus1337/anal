/* ============================================================
   ChainDeal · common.js
   Инжектит header, footer, wallet modal, settings FAB+panel,
   demo notice. Глобальные эффекты (appearance, snow, drop cursor).
   ============================================================ */
(function () {
  "use strict";

  const NAV_ITEMS = [
    { href: "how.html",      label: "Как это работает", key: "how" },
    { href: "exchange.html", label: "Обменник",          key: "exchange" },
    { href: "market.html",   label: "Маркетплейс",       key: "market" },
    { href: "funds.html",    label: "Сборы",             key: "funds" },
    { href: "chain.html",    label: "Контракт-чейн",     key: "chain" },
    { href: "forum.html",    label: "Форум",             key: "forum" },
    { href: "disputes.html", label: "Диспуты",           key: "disputes" },
    { href: "cabinet.html",  label: "Кабинет",           key: "cabinet" }
  ];
  const FOOTER_PRODUCT   = [
    { href: "exchange.html", label: "Обменник" },
    { href: "market.html",   label: "Маркетплейс" },
    { href: "funds.html",    label: "Сборы" },
    { href: "disputes.html", label: "Арбитраж" }
  ];
  const FOOTER_RESOURCES = [
    { href: "how.html",   label: "Как это работает" },
    { href: "chain.html", label: "Контракт-чейн" },
    { href: "chain.html", label: "Whitepaper" },
    { href: "chain.html", label: "GitHub · аудит" }
  ];
  const FOOTER_SUPPORT   = [
    { href: "forum.html",    label: "Форум" },
    { href: "disputes.html", label: "Открыть диспут" },
    { href: "cabinet.html",  label: "Личный кабинет" }
  ];

  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "hidden") n.hidden = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html) n.innerHTML = html;
    return n;
  };
  const navLink  = (item, active) =>
    `<a href="${item.href}"${item.key === active ? ' class="active" aria-current="location"' : ""}>${item.label}</a>`;
  const footLink = item => `<a href="${item.href}">${item.label}</a>`;

  /* ---------- UI builders ---------- */
  function buildHeader(active) {
    const h = el("header");
    h.innerHTML = `
      <div class="container nav">
        <a href="index.html" class="logo"><span class="mark">◈</span>ChainDeal</a>
        <nav class="nav-links" id="navLinks">${NAV_ITEMS.map(i => navLink(i, active)).join("")}</nav>
        <button class="btn btn-primary btn-wallet" onclick="openModal()">Подключить кошелёк</button>
        <button class="burger" id="burger" aria-label="Меню">☰</button>
      </div>`;
    return h;
  }

  function buildFooter() {
    const f = el("footer");
    f.innerHTML = `
      <div class="container">
        <div class="foot-grid">
          <div>
            <a href="index.html" class="logo" style="margin-bottom:14px;"><span class="mark">◈</span>ChainDeal</a>
            <p class="muted" style="font-size:13.5px; max-width:280px;">P2P-маркетплейс на смарт-контрактах. Эскроу, обмены, сборы по этапам.</p>
          </div>
          <div><h4>Продукт</h4>${FOOTER_PRODUCT.map(footLink).join("")}</div>
          <div><h4>Ресурсы</h4>${FOOTER_RESOURCES.map(footLink).join("")}</div>
          <div><h4>Поддержка</h4>${FOOTER_SUPPORT.map(footLink).join("")}</div>
        </div>
        <div class="disclaimer">
          Платформа не хранит средства пользователей. Все сделки проходят через публичные смарт-контракты
          в сети Base. Контракты верифицированы, исходный код открыт.
        </div>
      </div>`;
    return f;
  }

  function buildWalletModal() {
    const m = el("div", { class: "modal-back", id: "walletModal" });
    m.innerHTML = `
      <div class="modal">
        <h3>Подключить кошелёк</h3>
        <p class="modal-sub">Выберите способ подключения. Подпись транзакций происходит только у вас.</p>
        <button class="wallet-opt" onclick="closeModal()"><span class="wallet-ico" style="background:rgba(255,140,0,.15); color:#ff8c00;">M</span>MetaMask</button>
        <button class="wallet-opt" onclick="closeModal()"><span class="wallet-ico" style="background:rgba(59,130,246,.15); color:#3b82f6;">W</span>WalletConnect</button>
        <button class="wallet-opt" onclick="closeModal()"><span class="wallet-ico" style="background:rgba(0,210,168,.15); color:#00d2a8;">C</span>Coinbase Wallet</button>
        <button class="modal-close" onclick="closeModal()">Закрыть</button>
      </div>`;
    return m;
  }

  function buildSettingsFab() {
    const fab = el("button", { class: "settings-fab", id: "settingsFab", title: "Настройки", "aria-label": "Настройки" });
    fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9.7 3-.6 2.1-1.7 1-2.1-.5L3 9.4 4.5 11v2L3 14.6l2.3 3.8 2.1-.5 1.7 1 .6 2.1h4.6l.6-2.1 1.7-1 2.1.5 2.3-3.8-1.5-1.6v-2L21 9.4l-2.3-3.8-2.1.5-1.7-1L14.3 3Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    return fab;
  }

  function buildSettingsPanel() {
    const p = el("div", { class: "settings-panel", id: "settingsPanel", role: "dialog", "aria-modal": "false", "aria-labelledby": "appearanceTitle" });
    p.hidden = true;
    p.innerHTML = `
      <div class="cd-panel-head">
        <div><small>ПЕРСОНАЛИЗАЦИЯ</small><h3 id="appearanceTitle">Ваше пространство</h3></div>
        <button type="button" id="cdClose" aria-label="Закрыть настройки">✕</button>
      </div>
      <p class="cd-hint">Оформление и эффекты работают независимо.</p>
      <fieldset>
        <legend>01 · Оформление</legend>
        <label class="cd-field">Тема<select id="cdTheme"><option value="dark">Тёмная</option><option value="light">Светлая</option><option value="system">Как в системе</option></select></label>
        <label class="cd-field">Обои<select id="cdWall"><option value="plain">Чистый фон</option><option value="aurora">Северное сияние</option><option value="contour">Тихие контуры</option><option value="mist">Мягкий туман</option></select></label>
      </fieldset>
      <fieldset>
        <legend>02 · Liquid Glass</legend>
        <label class="cd-field">Жидкое стекло<input type="checkbox" id="cdGlass"></label>
        <label class="cd-field">Устройство<select id="cdPower"><option value="low">Слабое</option><option value="medium">Среднее</option><option value="high">Мощное</option></select></label>
        <p class="cd-hint" id="cdPowerHint"></p>
        <label class="cd-slider">Прозрачность <output id="cdAlphaOut"></output><input id="cdAlpha" type="range" min="0" max="65" step="1"></label>
        <label class="cd-slider">Размытие<input id="cdBlur" type="range" min="0" max="100" step="5"></label>
        <label class="cd-field">Стиль кромки<select id="cdEdgeStyle"><option value="silver">Нейтральная</option><option value="mint">Мятная</option><option value="rainbow">Радужная · без вращения</option><option value="none">Без кромки</option></select></label>
        <label class="cd-slider">Толщина кромки<input id="cdRim" type="range" min="0" max="3" step="0.5"></label>
        <label class="cd-slider">Свечение<input id="cdGlow" type="range" min="0" max="100" step="5"></label>
        <p class="cd-hint">Слабое: без blur и движущихся бликов. Среднее: blur крупных панелей, статичная кромка. Мощное: полный blur, блики за курсором и анимированная кромка.</p>
      </fieldset>
      <fieldset>
        <legend>03 · Курсор</legend>
        <label class="cd-field">Курсор-капля<input id="cdDrop" type="checkbox"></label>
        <p class="cd-hint">Работает с мышью независимо от стекла. При уменьшении движения используется обычный курсор.</p>
      </fieldset>
      <fieldset>
        <legend>04 · Снег</legend>
        <label class="cd-field">Снежинки<input type="checkbox" id="cdSnow"></label>
        <label class="cd-slider">Количество <output id="cdCountOut"></output><input id="cdCount" type="range" min="5" max="60" step="1"></label>
        <p class="cd-hint">Без стекла, следов курсора и других эффектов. При включённом уменьшении движения снег приостановлен.</p>
      </fieldset>
      <button id="cdReset" class="btn btn-ghost" type="button">Сбросить настройки</button>
      <p class="cd-hint">Настройки сохраняются на этом устройстве.</p>`;
    return p;
  }

  function buildDemoNotice() {
    const n = el("div", { class: "demo-notice" });
    n.textContent = "Демонстрационный интерфейс. Лента, балансы и операции из исходного макета не подтверждают реальные блокчейн-транзакции.";
    return n;
  }

  /* ---------- inject shared UI ---------- */
  function inject() {
    if (document.body.dataset.cdInjected === "1") return;
    document.body.dataset.cdInjected = "1";

    const active = document.body.dataset.page || "home";
    document.body.insertBefore(buildHeader(active), document.body.firstChild);
    document.body.appendChild(buildFooter());
    document.body.appendChild(buildWalletModal());
    document.body.appendChild(buildSettingsFab());
    document.body.appendChild(buildSettingsPanel());
    document.body.appendChild(buildDemoNotice());

    // клик по фону wallet-модалки закрывает
    const wm = document.getElementById("walletModal");
    if (wm) wm.addEventListener("click", e => { if (e.target.id === "walletModal") window.closeModal(); });
  }

  window.openModal  = function () { const m = document.getElementById("walletModal"); if (m) m.classList.add("open"); };
  window.closeModal = function () { const m = document.getElementById("walletModal"); if (m) m.classList.remove("open"); };

  /* ============================================================
     APPEARANCE (theme, glass, snow, drop cursor)
     ============================================================ */
  const cdDefaults = {
    theme: 'dark', wall: 'plain', glass: false,
    power: (navigator.hardwareConcurrency || 4) <= 4 ? 'low' : 'medium',
    alpha: 20, snow: false, count: 24, drop: true,
    rim: 1, glow: 55, blur: 65, edgeStyle: 'silver'
  };
  let cd = { ...cdDefaults };
  try {
    const saved = JSON.parse(localStorage.getItem('chaindeal.appearance.v2') || '{}');
    for (const k of Object.keys(cdDefaults)) if (typeof saved[k] === typeof cdDefaults[k]) cd[k] = saved[k];
  } catch (e) {}

  const cdMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cdSystem = matchMedia('(prefers-color-scheme: light)');
  const cdEl = id => document.getElementById(id);
  let cdSnowSync = () => {};

  function cdApply(save = false) {
    if (!['dark','light','system'].includes(cd.theme)) cd.theme = 'dark';
    if (!['plain','aurora','contour','mist'].includes(cd.wall)) cd.wall = 'plain';
    if (!['low','medium','high'].includes(cd.power)) cd.power = 'low';
    cd.alpha = Math.max(0, Math.min(65, Number(cd.alpha) || 0));
    cd.count = Math.max(5, Math.min(60, Number(cd.count) || 24));
    const b = document.body;
    b.dataset.cdTheme = cd.theme === 'system' ? (cdSystem.matches ? 'light' : 'dark') : cd.theme;
    b.dataset.cdWall = cd.wall;
    b.dataset.cdPower = cd.power;
    b.dataset.cdGlass = String(cd.glass);
    b.classList.toggle('glass', cd.glass);
    b.classList.toggle('lite', cd.power === 'low');
    b.classList.toggle('rim-off', cd.rim === 0);
    b.classList.toggle('glow-off', cd.glow === 0);
    b.style.setProperty('--cd-opacity', String(1 - cd.alpha / 100));
    b.style.setProperty('--cd-blur', cd.power === 'low' ? '0px' : cd.power === 'medium' ? '8px' : '16px');

    const setVal = (id, v) => { const el = cdEl(id); if (el) el.value = v; };
    const setChk = (id, v) => { const el = cdEl(id); if (el) el.checked = v; };
    setVal('cdTheme', cd.theme); setVal('cdWall', cd.wall); setVal('cdPower', cd.power);
    setChk('cdGlass', cd.glass); setChk('cdSnow', cd.snow);
    setVal('cdAlpha', cd.alpha); setVal('cdCount', cd.count);
    if (cdEl('cdAlphaOut')) cdEl('cdAlphaOut').textContent = cd.alpha + '%';
    if (cdEl('cdCountOut')) cdEl('cdCountOut').textContent = cd.count;
    if (cdEl('cdPowerHint')) cdEl('cdPowerHint').textContent =
      cd.power === 'low'    ? 'Без blur · снег до 20 частиц · 24 кадра/с' :
      cd.power === 'medium' ? 'Умеренный blur · снег до 40 частиц · 30 кадров/с' :
                              'Полный blur · снег до 60 частиц · 60 кадров/с';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = b.dataset.cdTheme === 'light' ? '#f1f5f8' : '#0b111c';

    if (save) try { localStorage.setItem('chaindeal.appearance.v2', JSON.stringify(cd)); } catch (e) {}
    b.style.setProperty('--blur-k', String(cd.blur / 100));
    b.style.setProperty('--rim-w', cd.rim + 'px');
    b.style.setProperty('--glow-k', String(cd.glow / 100));
    b.style.setProperty('--drop-d', '18px');
    b.dataset.cdDrop = String(cd.drop);
    if (!['silver','mint','rainbow','none'].includes(cd.edgeStyle)) cd.edgeStyle = 'silver';
    b.dataset.cdEdge = cd.edgeStyle;
    setVal('cdEdgeStyle', cd.edgeStyle);
    for (const [id, key] of [['cdDrop','drop'],['cdRim','rim'],['cdGlow','glow'],['cdBlur','blur']]) {
      const el = cdEl(id);
      if (!el) continue;
      if (el.type === 'checkbox') el.checked = cd[key]; else el.value = cd[key];
    }
    cdSnowSync();
  }

  for (const [id, key] of [
    ['cdTheme','theme'],['cdWall','wall'],['cdPower','power'],['cdGlass','glass'],
    ['cdSnow','snow'],['cdAlpha','alpha'],['cdCount','count'],['cdDrop','drop'],
    ['cdRim','rim'],['cdGlow','glow'],['cdBlur','blur'],['cdEdgeStyle','edgeStyle']
  ]) {
    const el = cdEl(id);
    if (!el) continue;
    el.addEventListener(el.type === 'range' ? 'input' : 'change', () => {
      cd[key] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? +el.value : el.value;
      cdApply(true);
    });
  }
  cdEl('cdReset') && cdEl('cdReset').addEventListener('click', () => { cd = { ...cdDefaults }; cdApply(true); });
  cdSystem.addEventListener('change', () => cdApply());
  cdMotion.addEventListener('change', () => cdSnowSync());

  /* settings panel open/close */
  const settingsPanel = cdEl('settingsPanel');
  const cdFab = cdEl('settingsFab');
  if (settingsPanel && cdFab) {
    cdFab.setAttribute('aria-controls', 'settingsPanel');
    cdFab.setAttribute('aria-expanded', 'false');
    const cdPanel = open => {
      settingsPanel.hidden = !open;
      settingsPanel.classList.toggle('open', open);
      cdFab.setAttribute('aria-expanded', String(open));
      if (open) cdEl('cdClose') && cdEl('cdClose').focus(); else cdFab.focus();
    };
    cdFab.addEventListener('click', () => cdPanel(settingsPanel.hidden));
    cdEl('cdClose') && cdEl('cdClose').addEventListener('click', () => cdPanel(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !settingsPanel.hidden) cdPanel(false); });
    document.addEventListener('click', e => {
      if (!settingsPanel.hidden && !settingsPanel.contains(e.target) && !cdFab.contains(e.target)) cdPanel(false);
    });
  }
  cdApply();

  /* ---------- Snow canvas ---------- */
  (() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'cdSnowCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, t = 0;
    let flakes = [];
    function make(initial = false) {
      const r = 1.4 + Math.random() * 2.8;
      return {
        x: Math.random() * (w + 40) - 20,
        y: initial ? Math.random() * h : -12 - Math.random() * 30,
        r, v: 16 + r * 9, phase: Math.random() * Math.PI * 2,
        spin: Math.random() * .5 - .25, rot: Math.random() * 6.28
      };
    }
    function resize() {
      const nw = document.documentElement.clientWidth, nh = innerHeight;
      const ow = w || nw, oh = h || nh;
      w = nw; h = nh;
      dpr = Math.min(devicePixelRatio || 1, cd.power === 'high' ? 1.5 : 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      flakes.forEach(f => { f.x = f.x / ow * w; f.y = f.y / oh * h; });
    }
    function frame(now) {
      raf = 0;
      if (!cd.snow || document.hidden || cdMotion.matches) return;
      const step = 1000 / (cd.power === 'low' ? 24 : cd.power === 'medium' ? 30 : 60);
      if (now - last < step) { raf = requestAnimationFrame(frame); return; }
      const dt = Math.min((now - last) / 1000, .05);
      last = now; t += dt;
      const cap = cd.power === 'low' ? 20 : cd.power === 'medium' ? 40 : 60;
      const target = Math.min(cd.count, cap, Math.max(8, Math.round(w * h / 18000)));
      while (flakes.length < target) flakes.push(make(true));
      if (flakes.length > target) flakes.length = target;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = document.body.dataset.cdTheme === 'light' ? 'rgba(75,109,139,.6)' : 'rgba(233,244,255,.8)';
      ctx.lineWidth = 1; ctx.lineCap = 'round';
      for (let i = 0; i < flakes.length; i++) {
        let f = flakes[i];
        f.y += f.v * dt;
        f.x += (4 + Math.sin(t * .55 + f.phase) * 9) * dt;
        f.rot += f.spin * dt;
        if (f.y > h + f.r * 3) { flakes[i] = make(); continue; }
        if (f.x > w + 20) f.x = -20;
        if (f.x < -20) f.x = w + 20;
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
        ctx.beginPath();
        for (let j = 0; j < 3; j++) { ctx.moveTo(-f.r, 0); ctx.lineTo(f.r, 0); ctx.rotate(Math.PI / 3); }
        ctx.stroke(); ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }
    cdSnowSync = () => {
      resize();
      const on = cd.snow && !document.hidden && !cdMotion.matches;
      canvas.hidden = !on;
      if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!on) { cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    };
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', cdSnowSync);
    cdSnowSync();
  })();

  /* ---------- Glass pointer highlight ---------- */
  const GLASS_SEL = ".btn, .wallet-opt, .cat, .pair-filter button, .cab-tab, .nav-links a, .settings-fab, .burger, .modal-close, .addr-row button, .good, .fund, .step, .stat, .badge, .search-box, .contract-card, .side-card, .dispute-card, .feed-card, .chain-feed, .cab-main, .cab-profile, .forum-section, .dispute, .resolve-panel, .swap-info, table";
  let pmRaf = 0, pmE = null;
  document.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const cl = document.body.classList;
    if (!cl.contains("glass") || cd.power !== "high" || cdMotion.matches || document.hidden) return;
    pmE = e;
    if (pmRaf) return;
    pmRaf = requestAnimationFrame(() => {
      pmRaf = 0;
      const el = pmE.target.closest && pmE.target.closest(GLASS_SEL);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (pmE.clientX - r.left) + "px");
      el.style.setProperty("--my", (pmE.clientY - r.top) + "px");
    });
  }, { passive: true });

  /* ---------- Drop cursor ---------- */
  (() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const drop = document.createElement("div");
    drop.className = "drop";
    const inner = document.createElement("i");
    drop.appendChild(inner);
    document.body.appendChild(drop);
    const CLICKABLE = GLASS_SEL + ", a, button, label, [onclick], .switch, input[type=range]";
    let tx = -100, ty = -100, x = -100, y = -100;
    let ang = 0, st = 0, sv = 0, size = 1, tsize = 1, down = false, raf = 0;
    addEventListener("pointermove", e => {
      tx = e.clientX; ty = e.clientY;
      drop.classList.add("show");
      const t = e.target.closest ? e.target : null;
      if (t && t.closest("input:not([type=range]):not([type=checkbox]), textarea")) tsize = 0;
      else if (t && t.closest(CLICKABLE)) tsize = 1.7;
      else tsize = 1;
    });
    addEventListener("pointerdown", () => { down = true; });
    addEventListener("pointerup", () => { down = false; });
    document.addEventListener("mouseleave", () => drop.classList.remove("show"));
    function frame() {
      const px = x, py = y;
      x = tx; y = ty;
      const vx = x - px, vy = y - py;
      const sp = Math.hypot(vx, vy);
      if (sp > 0.6) ang = Math.atan2(vy, vx);
      const target = Math.min(sp / 26, 1);
      sv += (target - st) * 0.22; sv *= 0.72; st += sv;
      const sxv = Math.max(0.85, 1 + 0.75 * st);
      const syv = 1 / Math.sqrt(sxv);
      inner.style.borderBottomLeftRadius = (50 * (1 - Math.min(1, Math.max(0, st) * 1.5))) + "%";
      size += (tsize * (down ? 0.68 : 1) - size) * 0.18;
      drop.style.transform = "translate3d(" + x + "px," + y + "px,0) rotate(" + ang + "rad) scale(" + (sxv * size) + "," + (syv * size) + ")";
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      const on = cd.drop && !document.hidden && !cdMotion.matches;
      if (document.body.classList.contains("has-drop") !== on) document.body.classList.toggle("has-drop", on);
      if (on && !raf) { x = tx; y = ty; raf = requestAnimationFrame(frame); }
      if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ["class", "data-cd-drop"] });
    document.addEventListener("visibilitychange", sync);
    cdMotion.addEventListener("change", sync);
    sync();
  })();

  /* ---------- Mobile burger ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("#burger");
    if (b) {
      const nl = document.getElementById("navLinks");
      if (nl) nl.classList.toggle("open");
    }
    const a = e.target.closest("#navLinks a");
    if (a) {
      const nl = document.getElementById("navLinks");
      if (nl) nl.classList.remove("open");
    }
  });

  /* ---------- Run injection ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();