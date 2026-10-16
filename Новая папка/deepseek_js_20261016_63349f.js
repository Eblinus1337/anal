/* ============================================================
   ChainDeal · app.js
   Только логика конкретных страниц. Все проверки на наличие
   элементов — можно безопасно подключать на любой странице.
   ============================================================ */
(function () {
  "use strict";
  const fmt = n => n.toLocaleString("ru-RU");
  const el  = id => document.getElementById(id);

  /* ---------- Reveal on scroll ---------- */
  if (document.querySelector('.reveal')) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(x => io.observe(x));
  }

  /* ================= HOME: feed + stat counters ================= */
  const feedList = el("feedList");
  if (feedList) {
    const dealTypes = [
      "Обмен USDT → BTC", "Услуга: буст аккаунта", "Продажа аккаунта",
      "Обмен ETH → USDT", "Дизайн логотипа", "Разработка бота",
      "Обмен USDT → SOL", "Сбор: indie-игра", "Продажа скинов CS2",
      "Услуга: монтаж видео", "Обмен BTC → USDT", "Сбор: хардвер-кошелёк"
    ];
    const statuses = [
      { cls: "done", txt: "выполнена" },
      { cls: "escrow", txt: "в эскроу" },
      { cls: "escrow", txt: "в эскроу" },
      { cls: "dispute", txt: "диспут" }
    ];
    function randHash() {
      const hex = "0123456789abcdef";
      let h = "0x";
      for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random()*16)];
      h += "…";
      for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random()*16)];
      return h;
    }
    function randSum() {
      const s = (Math.random() * 2400 + 15).toFixed(2);
      return Number(s).toLocaleString("ru-RU") + " USDT";
    }
    function addDeal() {
      const t = dealTypes[Math.floor(Math.random()*dealTypes.length)];
      const st = statuses[Math.floor(Math.random()*statuses.length)];
      const item = document.createElement("div");
      item.className = "feed-item";
      item.innerHTML =
        '<span class="type">' + t + '</span>' +
        '<span class="hash mono">' + randHash() + '</span>' +
        '<span class="sum">' + randSum() + '</span>' +
        '<span class="status ' + st.cls + '">' + st.txt + '</span>';
      feedList.prepend(item);
      while (feedList.children.length > 9) feedList.lastChild.remove();
    }
    for (let i = 0; i < 7; i++) addDeal();
    setInterval(() => { if (!document.hidden) addDeal(); }, 5000);
  }

  if (document.querySelector("[data-count]")) {
    document.querySelectorAll("[data-count]").forEach(node => {
      const target = +node.dataset.count;
      const dur = 1600, t0 = performance.now();
      (function step(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(target * eased).toLocaleString("ru-RU");
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ================= CABINET: tabs ================= */
  if (document.querySelector(".cab-tab")) {
    document.querySelectorAll(".cab-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".cab-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".cab-pane").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const p = el("pane-" + tab.dataset.pane);
        if (p) p.classList.add("active");
      });
    });
  }

  /* ================= DISPUTES: modal ================= */
  window.openDisputeModal  = function () { const m = el("disputeModal"); if (m) m.classList.add("open"); };
  window.closeDisputeModal = function () { const m = el("disputeModal"); if (m) m.classList.remove("open"); };
  const disputeModalEl = el("disputeModal");
  if (disputeModalEl) disputeModalEl.addEventListener("click", e => { if (e.target.id === "disputeModal") window.closeDisputeModal(); });

  /* ================= FORUM: online counter ================= */
  const onlineEl = el("onlineCount");
  if (onlineEl) {
    let online = 1200 + Math.floor(Math.random() * 400);
    const render = () => { onlineEl.textContent = online.toLocaleString("ru-RU"); };
    render();
    setInterval(() => {
      online = Math.max(900, online + Math.floor(Math.random() * 41) - 20);
      render();
    }, 6000);
  }

  /* ================= CHAIN: tx list + reserve ================= */
  const txList = el("txList");
  if (txList) {
    const txOps = [
      { cls: "deposit", txt: "депозит эскроу" },
      { cls: "release", txt: "выплата продавцу" },
      { cls: "swap",    txt: "атомарный своп" },
      { cls: "dispute", txt: "решение диспута" },
      { cls: "release", txt: "выплата этапа сбора" }
    ];
    const rh = () => {
      const hex = "0123456789abcdef";
      let h = "0x";
      for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random()*16)];
      h += "…";
      for (let i = 0; i < 4; i++) h += hex[Math.floor(Math.random()*16)];
      return h;
    };
    const addTx = () => {
      const op = txOps[Math.floor(Math.random() * txOps.length)];
      const sum = (Math.random() * 5000 + 50).toFixed(2);
      const node = document.createElement("div");
      node.className = "tx";
      node.innerHTML =
        '<span class="op ' + op.cls + '">' + op.txt + '</span>' +
        '<span class="hash mono">' + rh() + '</span>' +
        '<span class="val">' + Number(sum).toLocaleString("ru-RU") + ' USDT</span>' +
        '<span class="status done st">confirmed</span>';
      txList.prepend(node);
      while (txList.children.length > 30) txList.lastChild.remove();
    };
    for (let i = 0; i < 14; i++) addTx();
    setInterval(addTx, 4000);
  }

  const statTx = el("statTx");
  if (statTx) {
    let txTotal = 184203;
    statTx.textContent = txTotal.toLocaleString("ru-RU");
    setInterval(() => { txTotal++; statTx.textContent = txTotal.toLocaleString("ru-RU"); }, 4000);
  }

  const reserveEl = el("reserveVal");
  if (reserveEl) {
    const reserveTarget = 128450;
    let shown = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || shown) return;
        shown = true;
        const t0 = performance.now(), dur = 1500;
        (function step(t) {
          const p = Math.min((t - t0) / dur, 1);
          reserveEl.textContent = Math.round(reserveTarget * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU") + " USDT";
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        io.disconnect();
      });
    }, { threshold: .4 });
    io.observe(reserveEl);
  }

  window.copyAddr = function (btn) {
    const addr = btn.parentElement.querySelector(".addr").textContent.split("→")[1].trim();
    if (navigator.clipboard) navigator.clipboard.writeText(addr).catch(() => {});
    btn.textContent = "скопировано";
    setTimeout(() => btn.textContent = "копировать", 1500);
  };

  /* ================= FUNDS ================= */
  const MS_LABEL = { done: "подтверждён", active: "в работе", wait: "ожидает" };
  const funds = [
    { title: "Indie-игра «Neon Drift» — ретро-рейсер", type: "Игра", desc: "Аркадный рейсер в стиле 80-х. Демо уже играбельно, нужны средства на арт и звук.", raised: 18400, goal: 25000, backers: 312, days: 12,
      milestones: [ {t: "Геймплей-ядро", p: 40, s: "done"}, {t: "Арт и анимации", p: 30, s: "active"}, {t: "Звук и релиз", p: 30, s: "wait"} ] },
    { title: "Открытый хардвер-кошелёк «Ledger mini»", type: "Хардвер", desc: "Дешёвый кошелёк с открытой схемотехникой и прошивкой. Аудит — до краудсейла.", raised: 67300, goal: 80000, backers: 891, days: 21,
      milestones: [ {t: "Прототип платы", p: 35, s: "done"}, {t: "Прошивка", p: 35, s: "active"}, {t: "Аудит и производство", p: 30, s: "wait"} ] },
    { title: "Обучающий курс «Смарт-контракты с нуля»", type: "Образование", desc: "Практический курс: пишем и деплоим 5 контрактов, аудируем чужой код.", raised: 9600, goal: 15000, backers: 178, days: 8,
      milestones: [ {t: "Модули 1–4", p: 50, s: "done"}, {t: "Модули 5–8", p: 50, s: "wait"} ] }
  ];
  function renderFunds() {
    const grid = el("fundsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    funds.forEach((f, i) => {
      const pct = Math.round(f.raised / f.goal * 100);
      const card = document.createElement("div");
      card.className = "fund";
      card.innerHTML =
        '<div class="ftop"><span class="ftype">' + f.type + '</span><span class="escrow-badge">эскроу по этапам</span></div>' +
        '<h3>' + f.title + '</h3>' +
        '<p class="fdesc">' + f.desc + '</p>' +
        '<div class="progress-wrap">' +
          '<div class="progress-bar"><div class="progress-fill" data-w="' + Math.min(pct, 100) + '"></div></div>' +
          '<div class="progress-row"><span class="pv">' + fmt(f.raised) + ' USDT</span><span class="pg">' + pct + '%</span><span class="pt2">цель ' + fmt(f.goal) + '</span></div>' +
        '</div>' +
        '<div class="milestones">' +
          f.milestones.map(m => '<div class="ms ' + m.s + '"><span class="dot2"></span><span>' + m.t + ' · ' + m.p + '%</span></div>').join("") +
        '</div>' +
        '<div class="ffoot">' +
          '<span class="backers"><b>' + f.backers + '</b> бэкеров · ' + f.days + ' дн.</span>' +
          '<button class="btn btn-primary btn-sm">Поддержать</button>' +
        '</div>';
      card.querySelector("button").addEventListener("click", () => window.openFund(i));
      grid.appendChild(card);
    });
    requestAnimationFrame(() => setTimeout(() =>
      document.querySelectorAll(".progress-fill").forEach(n => n.style.width = n.dataset.w + "%"), 60));
  }
  renderFunds();

  window.openFund = function (i) {
    const f = funds[i];
    const pct = Math.round(f.raised / f.goal * 100);
    if (el("fundTitle")) el("fundTitle").textContent = f.title;
    if (el("fundDesc"))  el("fundDesc").textContent = f.desc;
    const fill = el("fundFill");
    if (fill) { fill.style.width = "0"; requestAnimationFrame(() => requestAnimationFrame(() => fill.style.width = Math.min(pct, 100) + "%")); }
    if (el("fundRaised"))  el("fundRaised").textContent = fmt(f.raised) + " USDT";
    if (el("fundPct"))     el("fundPct").textContent = pct + "%";
    if (el("fundGoal"))    el("fundGoal").textContent = "цель " + fmt(f.goal);
    if (el("fundBackers")) el("fundBackers").textContent = f.backers;
    if (el("fundDays"))    el("fundDays").textContent = f.days;
    if (el("fundMilestones")) el("fundMilestones").innerHTML = f.milestones.map(m =>
      '<div class="milestone-item"><span class="pct">' + m.p + '%</span><span>' + m.t + '</span>' +
      '<span class="ms-status status ' + (m.s === "done" ? "done" : m.s === "active" ? "escrow" : "dispute") + '">' + MS_LABEL[m.s] + '</span></div>'
    ).join("");
    const m = el("fundModal"); if (m) m.classList.add("open");
  };
  window.closeFund = function () { const m = el("fundModal"); if (m) m.classList.remove("open"); };
  const fundModalEl = el("fundModal");
  if (fundModalEl) fundModalEl.addEventListener("click", e => { if (e.target.id === "fundModal") window.closeFund(); });

  /* ================= MARKETPLACE ================= */
  const goods = [
    { title: "Аккаунт Steam · 120 игр, без бана", cat: "Аккаунты", seller: "GameVault", rating: 4.96, deals: 812, price: 14500, term: "передача ~10 мин" },
    { title: "Аккаунт Fortnite с редкими скинами", cat: "Аккаунты", seller: "LootLord", rating: 4.91, deals: 233, price: 8900, term: "передача ~15 мин" },
    { title: "5000 голды World of Tanks", cat: "Игровые товары", seller: "TankTrader", rating: 4.98, deals: 1540, price: 2100, term: "выдача ~5 мин" },
    { title: "Скины CS2 · коллекция из 12 предметов", cat: "Игровые товары", seller: "SkinBoss", rating: 4.94, deals: 671, price: 3400, term: "трейд-оффер" },
    { title: "Доступ к закрытой базе данных (лицензия)", cat: "Данные и доступы", seller: "DataHaven", rating: 4.89, deals: 198, price: 5600, term: "выдача ~30 мин" },
    { title: "Подписка на сервис — годовой аккаунт", cat: "Данные и доступы", seller: "AccessPoint", rating: 4.93, deals: 445, price: 2900, term: "выдача мгновенно" },
    { title: "Буст рейтинга Dota 2 · +500 MMR", cat: "Услуги", seller: "RankUp", rating: 4.97, deals: 928, price: 12500, term: "2–4 дня" },
    { title: "Прокачка персонажа до 60 уровня", cat: "Услуги", seller: "GrindMaster", rating: 4.92, deals: 356, price: 7800, term: "3–5 дней" },
    { title: "Логотип для проекта · 3 варианта", cat: "Дизайн", seller: "PixelNova", rating: 4.99, deals: 720, price: 4500, term: "2–3 дня" },
    { title: "Оформление Telegram-канала под ключ", cat: "Дизайн", seller: "DesignHub", rating: 4.95, deals: 289, price: 3200, term: "1–2 дня" },
    { title: "Телеграм-бот на Python под заказ", cat: "Разработка", seller: "CodeForge", rating: 4.98, deals: 503, price: 15000, term: "5–7 дней" },
    { title: "Лендинг на чистом HTML/CSS/JS", cat: "Разработка", seller: "WebSmith", rating: 4.96, deals: 411, price: 9900, term: "3–4 дня" }
  ];
  function renderGoods() {
    const grid = el("goodsGrid");
    if (!grid) return;
    const q = (el("marketSearch") ? el("marketSearch").value.trim().toLowerCase() : "");
    const catEl = document.querySelector("#cats .active");
    const cat = catEl ? catEl.dataset.cat : "all";
    grid.innerHTML = "";
    goods
      .filter(g => (cat === "all" || g.cat === cat) &&
                   (q === "" || (g.title + " " + g.seller + " " + g.cat).toLowerCase().includes(q)))
      .forEach(g => {
        const card = document.createElement("div");
        card.className = "good";
        card.innerHTML =
          '<div class="top"><span class="cat-tag">' + g.cat + '</span><span class="escrow-badge">гарант</span></div>' +
          '<h3>' + g.title + '</h3>' +
          '<div class="seller-row"><span class="rating">★ ' + g.rating + '</span> · ' + g.seller + ' · ' + g.deals + ' сделок</div>' +
          '<div class="foot">' +
            '<span class="price">' + fmt(g.price) + ' <span class="cur">USDT</span></span>' +
            '<span class="term">' + g.term + '</span>' +
          '</div>' +
          '<button class="btn btn-primary btn-sm" style="justify-content:center;">Заказать</button>';
        card.querySelector("button").addEventListener("click", () => window.openOrder(g));
        grid.appendChild(card);
      });
    if (!grid.children.length) {
      grid.innerHTML = '<p class="muted" style="grid-column:1/-1; text-align:center; padding:32px 0;">Ничего не найдено. Попробуйте изменить запрос.</p>';
    }
  }
  renderGoods();
  if (el("marketSearch")) el("marketSearch").addEventListener("input", renderGoods);
  if (el("cats")) el("cats").addEventListener("click", e => {
    const btn = e.target.closest(".cat");
    if (!btn) return;
    document.querySelectorAll("#cats .cat").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGoods();
  });

  window.openOrder = function (g) {
    if (el("orderTitle")) el("orderTitle").textContent = g.title + " · продавец " + g.seller;
    const fee = Math.round(g.price * 0.05);
    if (el("orderPrice")) el("orderPrice").textContent = fmt(g.price) + " USDT";
    if (el("orderFee"))   el("orderFee").textContent = fmt(fee) + " USDT";
    if (el("orderTotal")) el("orderTotal").textContent = fmt(g.price + fee) + " USDT";
    const m = el("orderModal"); if (m) m.classList.add("open");
  };
  window.closeOrder = function () { const m = el("orderModal"); if (m) m.classList.remove("open"); };
  const orderModalEl = el("orderModal");
  if (orderModalEl) orderModalEl.addEventListener("click", e => { if (e.target.id === "orderModal") window.closeOrder(); });

  /* ================= EXCHANGE: offers + swap ================= */
  const AV_COLORS = ["#6c5ce7", "#00b894", "#e17055", "#0984e3", "#d63031", "#e84393", "#fdcb6e"];
  const offers = [
    { seller: "SatoshiTrade", deals: 1240, rating: 4.98, pair: "USDT → BTC", rate: "0.0000141", give: "USDT", limits: "100 – 25 000" },
    { seller: "CryptoOwl",    deals: 861,  rating: 4.95, pair: "USDT → BTC", rate: "0.0000140", give: "USDT", limits: "50 – 10 000" },
    { seller: "NodeRunner",   deals: 2103, rating: 4.99, pair: "USDT → ETH", rate: "0.000271",  give: "USDT", limits: "100 – 50 000" },
    { seller: "DeltaSwap",    deals: 442,  rating: 4.91, pair: "USDT → ETH", rate: "0.000269",  give: "USDT", limits: "50 – 5 000" },
    { seller: "SolMate",      deals: 655,  rating: 4.96, pair: "USDT → SOL", rate: "0.00412",   give: "USDT", limits: "100 – 15 000" },
    { seller: "BitHunter",    deals: 1788, rating: 4.97, pair: "BTC → USDT", rate: "70 450",    give: "BTC",  limits: "0.001 – 2" }
  ];
  function renderOffers(filter) {
    const body = el("offersBody");
    if (!body) return;
    body.innerHTML = "";
    offers
      .filter(o => filter === "all" || o.pair === filter)
      .forEach((o, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          '<td><div class="seller">' +
            '<span class="avatar" style="background:' + AV_COLORS[i % AV_COLORS.length] + ';">' + o.seller[0] + '</span>' +
            '<div><div class="nick">' + o.seller + '</div>' +
            '<div class="deals">' + o.deals.toLocaleString("ru-RU") + ' сделок · <span class="rating">★ ' + o.rating + '</span></div></div>' +
          '</div></td>' +
          '<td class="rate mono">' + o.rate + ' ' + o.pair.split(" → ")[1] + '</td>' +
          '<td class="limits">' + o.limits + ' ' + o.give + '</td>' +
          '<td style="text-align:right;"><button class="btn btn-primary btn-sm" onclick="openSwap(\'' + o.seller + '\', \'' + o.pair + '\', \'' + o.rate + '\')">Обменять</button></td>';
        body.appendChild(tr);
      });
  }
  if (el("offersBody")) renderOffers("all");

  if (el("pairFilter")) el("pairFilter").addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    document.querySelectorAll("#pairFilter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderOffers(btn.dataset.pair);
  });

  window.openSwap = function (seller, pair, rate) {
    const [from, to] = pair.split(" → ");
    if (el("swapInfo")) el("swapInfo").textContent = seller + " · курс " + rate + " " + to + " за 1 " + from;
    if (el("swapCalc")) el("swapCalc").innerHTML =
      '<div class="htlc-row"><span class="tag a">шаг 1</span> вы блокируете ' + from + ' на HTLC <span class="arr">→</span></div>' +
      '<div class="htlc-row"><span class="tag b">шаг 2</span> ' + seller + ' блокирует ' + to + ' <span class="arr">→</span></div>' +
      '<div class="htlc-row"><span class="tag a">шаг 3</span> секрет раскрыт, обе выплаты <span class="arr">✓</span></div>';
    const m = el("swapModal"); if (m) m.classList.add("open");
  };
  window.closeSwap = function () { const m = el("swapModal"); if (m) m.classList.remove("open"); };
  window.openOfferModal  = function () { const m = el("offerModal"); if (m) m.classList.add("open"); };
  window.closeOfferModal = function () { const m = el("offerModal"); if (m) m.classList.remove("open"); };
  window.createOffer = function () {
    const give = (el("offerGive") && el("offerGive").value) || "1000 USDT";
    const get  = (el("offerGet")  && el("offerGet").value)  || "0.014 BTC";
    const pair = give.split(" ")[1] + " → " + get.split(" ")[1];
    offers.unshift({ seller: "Вы", deals: 0, rating: 5.0, pair, rate: "—", give: give.split(" ")[1], limits: "—" });
    const active = document.querySelector("#pairFilter .active");
    renderOffers(active ? active.dataset.pair : "all");
    window.closeOfferModal();
  };
  const swapModalEl = el("swapModal");
  const offerModalEl = el("offerModal");
  if (swapModalEl)  swapModalEl.addEventListener("click",  e => { if (e.target.id === "swapModal")  window.closeSwap(); });
  if (offerModalEl) offerModalEl.addEventListener("click", e => { if (e.target.id === "offerModal") window.closeOfferModal(); });
})();