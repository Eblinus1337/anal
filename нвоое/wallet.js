/* ChainDeal · wallet.js — только MetaMask + nick + сессия + ава */
(function () {
  var BASE_SEPOLIA = '0x14a34'; // 84532 Base Sepolia

  function $(id) { return document.getElementById(id); }

  function cfg() {
    var c = window.CD_CONFIG || {};
    var base = String(c.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    var anon = String(c.SUPABASE_ANON_KEY || "").trim();
    if (!base || base.indexOf(".supabase.co") === -1) return null;
    return { base: base, anon: anon };
  }

  function hasMM() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  async function ensureBase() {
    var chain = await window.ethereum.request({ method: 'eth_chainId' });
    if (chain === BASE_SEPOLIA) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA }]
      });
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_SEPOLIA,
            chainName: 'Base Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org']
          }]
        });
      } else { throw e; }
    }
  }

  function show(el, on) { if (el) el.style.display = on ? "" : "none"; }

  function paint(addr, nick) {
    var label = $('mm-label');
    var addrEl = $('mm-addr');
    if (addrEl && addr) addrEl.textContent = addr.slice(0, 6) + '…' + addr.slice(-4);
    if (label && nick) label.textContent = 'MetaMask — ' + nick;
    else if (label && addr) label.textContent = 'MetaMask — подключен';
  }

  function validNick(n) { return /^[a-zA-Z0-9_а-яА-ЯёЁ]{3,20}$/.test(n || ""); }

  async function apiNonce(addr) {
  var c = cfg();
  var url = c.base + "/functions/v1/nonce?wallet=" + addr;
  console.log("[cd] nonce url:", url);
  var r;
  try {
    r = await fetch(url, {
      mode: "cors",
      headers: {
        "apikey": c.anon,
        "Authorization": "Bearer " + c.anon
      }
    });
  } catch (e) {
    console.log("[cd] nonce network fail:", e);
    throw new Error("nonce network: " + e.message + " — проверь щит Зена / трекинг");
  }
  var j = await r.json().catch(function(){ return {}; });
  console.log("[cd] nonce status:", r.status, j);
  if (!r.ok) throw new Error(j.error || ("nonce " + r.status));
  return j.nonce;
}

async function apiVerify(addr, nonce, sig, nick) {
  var c = cfg();
  var url = c.base + "/functions/v1/verify";
  console.log("[cd] verify url:", url);
  var r;
  try {
    r = await fetch(url, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": c.anon,
        "Authorization": "Bearer " + c.anon
      },
      body: JSON.stringify({ wallet: addr, nonce: nonce, signature: sig, nick: nick })
    });
  } catch (e) {
    console.log("[cd] verify network fail:", e);
    throw new Error("verify network: " + e.message);
  }
  var j = await r.json().catch(function(){ return {}; });
  console.log("[cd] verify status:", r.status, j);
  if (!r.ok) throw new Error(j.error || ("verify " + r.status));
  return j;
    }

  async function apiProfile(addr) {
    try {
      var c = cfg();
      if (!c || !c.anon) return null;
      var r = await fetch(c.base + "/rest/v1/wallet_profiles?wallet_address=eq." + addr + "&select=nick,is_active,auto_logout,custom_minutes,require_sig", {
        headers: { "apikey": c.anon, "Authorization": "Bearer " + c.anon }
      });
      if (!r.ok) return null;
      var j = await r.json();
      return j[0] || null;
    } catch (e) { return null; }
  }

  async function connect() {
    if (!hasMM()) { alert('Поставь MetaMask'); return null; }
    if (!cfg()) { alert('Нет config.js'); return null; }
    await ensureBase();
    var accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
    var addr = String(accs[0]).toLowerCase();
    localStorage.setItem('cd_wallet', addr);
    paint(addr, localStorage.getItem('cd_nick'));

    var prof = await apiProfile(addr);
    if (prof && prof.is_active === false) {
      alert('Аккаунт отключен');
      doLogout(true);
      return null;
    }
    if (prof) {
      localStorage.setItem('cd_auto_logout', prof.auto_logout || 'never');
      localStorage.setItem('cd_custom_min', String(prof.custom_minutes || 60));
      localStorage.setItem('cd_require_sig', prof.require_sig || 'important');
      localStorage.setItem('cd_last_active', String(Date.now()));
    }

    if (prof && prof.nick) {
      try {
        var nonce = await apiNonce(addr);
        var sig = await window.ethereum.request({
          method: 'personal_sign',
          params: ["Vbiverr login: " + nonce, addr]
        });
        var v = await apiVerify(addr, nonce, sig, prof.nick);
        localStorage.setItem('cd_session', v.token);
        localStorage.setItem('cd_nick', v.nick);
        localStorage.setItem('cd_last_active', String(Date.now()));
        paint(addr, v.nick);
        show($('mm-step-connect'), false);
        show($('mm-step-register'), false);
        show($('mm-step-done'), true);
        if ($('mm-done-nick')) $('mm-done-nick').textContent = v.nick;
        paintHeaderAvatar();
      } catch (e) {
        alert('Вход: ' + e.message);
      }
    } else {
      show($('mm-step-connect'), false);
      show($('mm-step-register'), true);
      show($('mm-step-done'), false);
    }
    return addr;
  }

  async function saveNick() {
    var addr = localStorage.getItem('cd_wallet');
    var input = $('mm-nick');
    var nick = input ? input.value.trim() : "";
    if (!addr) { alert('Сначала подключи MetaMask'); return; }
    if (!validNick(nick)) { alert('Ник 3–20: буквы, цифры, _'); return; }
    try {
      var nonce = await apiNonce(addr);
      var sig = await window.ethereum.request({
        method: 'personal_sign',
        params: ["Vbiverr login: " + nonce, addr]
      });
      var v = await apiVerify(addr, nonce, sig, nick);
      localStorage.setItem('cd_session', v.token);
      localStorage.setItem('cd_nick', v.nick);
      localStorage.setItem('cd_last_active', String(Date.now()));
      paint(addr, v.nick);
      show($('mm-step-register'), false);
      show($('mm-step-done'), true);
      if ($('mm-done-nick')) $('mm-done-nick').textContent = v.nick;
      paintHeaderAvatar();
    } catch (e) {
      alert('Рега: ' + e.message);
    }
  }
function getShowFundsChoice() {
  var box = document.getElementById('mm-show-funds');
  var enabled = box ? box.checked : false;
  if (!enabled) return { show: false, chains: [] };
  var chains = [];
  document.querySelectorAll('#mm-chains-list input[data-chain]:checked').forEach(function (n) {
    chains.push(n.getAttribute('data-chain'));
  });
  return { show: true, chains: chains };
}

function buildConsentText(addr, chains) {
  var list = chains.length ? chains.join(',') : 'none';
  return 'vbiverr show-funds: ' + list + ' for ' + addr.toLowerCase() + ' @ ' + Date.now();
}

function bindFundsUI() {
  var arrow = document.getElementById('mm-chains-arrow');
  var list = document.getElementById('mm-chains-list');
  var preview = document.getElementById('mm-consent-preview');
  if (!arrow || arrow.dataset.on) return;
  arrow.dataset.on = "1";
  function refresh() {
    var c = getShowFundsChoice();
    var addr = (localStorage.getItem('cd_wallet') || '0x...').toLowerCase();
    if (preview) preview.textContent = c.show ? buildConsentText(addr, c.chains) : 'скрыто — сайт не показывает балансы';
    if (list) arrow.textContent = list.style.display === 'none' ? '>' : 'v';
  }
  arrow.onclick = function () {
    if (!list) return;
    list.style.display = list.style.display === 'none' ? '' : 'none';
    refresh();
  };
  document.addEventListener('change', function (e) {
    if (e.target && (e.target.id === 'mm-show-funds' || e.target.getAttribute('data-chain'))) refresh();
  });
  refresh();
}
  async function sha256Hex(s) {
    var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
  }

  async function paintHeaderAvatar() {
    var area = document.getElementById('auth-area');
    var addr = localStorage.getItem('cd_wallet');
    var nick = localStorage.getItem('cd_nick');
    var sess = localStorage.getItem('cd_session');
    var btns = document.querySelectorAll('.btn-wallet');

    if (!addr || !nick || !sess) {
      if (area) area.innerHTML = '<button class="btn btn-primary btn-wallet" onclick="openModal()">Подключить кошелёк</button>';
      else btns.forEach(function (b) { b.style.display = ""; });
      return;
    }

    btns.forEach(function (b) { b.style.display = "none"; });

    try {
      var hash = await sha256Hex(addr.toLowerCase());
      var color = '#' + hash.slice(0, 6);
      var bits = parseInt(hash.slice(6, 14), 16).toString(2).padStart(32, '0');
      var cells = '';
      for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 3; x++) {
          var on = bits[(y * 3 + x) % bits.length] === '1';
          if (on) {
            cells += '<rect x="' + (x * 10) + '" y="' + (y * 10) + '" width="10" height="10" fill="' + color + '"/>';
            cells += '<rect x="' + ((4 - x) * 10) + '" y="' + (y * 10) + '" width="10" height="10" fill="' + color + '"/>';
          }
        }
      }
      var html = '<a href="/account/" style="display:flex;align-items:center;gap:8px;">' +
        '<svg width="32" height="32" viewBox="0 0 50 50" style="border-radius:50%;background:#181822;">' + cells + '</svg>' +
        '<span style="font-size:14px;">' + nick + '</span></a>';
      if (area) area.innerHTML = html;
    } catch (e) {}
  }

  function doLogout(silent) {
    try {
      var sess = localStorage.getItem('cd_session');
      var c = cfg();
      if (sess && c) {
        fetch(c.base + "/functions/v1/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: sess })
        }).catch(function () {});
      }
    } catch (e) {}
    localStorage.removeItem('cd_session');
    localStorage.removeItem('cd_wallet');
    localStorage.removeItem('cd_nick');
    if (!silent) location.reload();
  }

  window.cdWalletConnect = connect;
  window.cdWallet = function () { return localStorage.getItem('cd_wallet'); };
  window.cdNick = function () { return localStorage.getItem('cd_nick'); };
  window.cdSession = function () { return localStorage.getItem('cd_session'); };
  window.cdLogout = doLogout;

  window.needSig = async function (action) {
    var mode = localStorage.getItem('cd_require_sig') || 'important';
    if (mode === 'none') return true;
    if (mode === 'important' && action !== 'publish' && action !== 'accept') return true;
    var addr = localStorage.getItem('cd_wallet');
    if (!addr || !window.ethereum) { alert('Подключи MetaMask'); return false; }
    try {
      await window.ethereum.request({
        method: 'personal_sign',
        params: ['Vbiverr confirm: ' + action + ' @ ' + Date.now(), addr]
      });
      localStorage.setItem('cd_last_active', String(Date.now()));
      return true;
    } catch (e) { return false; }
  };

  function secTouch() {
    if (localStorage.getItem('cd_wallet')) {
      localStorage.setItem('cd_last_active', String(Date.now()));
    }
  }

  function init() {
    var a = localStorage.getItem('cd_wallet');
    var n = localStorage.getItem('cd_nick');
    if (a) paint(a, n);
    if (a && n && localStorage.getItem('cd_session')) paintHeaderAvatar();

    document.addEventListener('pointermove', secTouch, { passive: true });

    setInterval(function () {
      var addr = localStorage.getItem('cd_wallet');
      if (!addr) return;
      var mode = localStorage.getItem('cd_auto_logout') || 'never';
      var custom = parseInt(localStorage.getItem('cd_custom_min') || '60', 10);
      var last = parseInt(localStorage.getItem('cd_last_active') || '0', 10);
      var now = Date.now();
      var limit = 0;
      if (mode === '30m') limit = 30 * 60 * 1000;
      if (mode === '24h') limit = 24 * 60 * 60 * 1000;
      if (mode === 'custom') limit = custom * 60 * 1000;
      if (limit && now - last > limit) doLogout(false);
    }, 60000);

    window.addEventListener('beforeunload', function () {
      if ((localStorage.getItem('cd_auto_logout') || '') === 'on_close') {
        localStorage.removeItem('cd_wallet');
        localStorage.removeItem('cd_nick');
        localStorage.removeItem('cd_session');
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('#btn-metamask')) connect();
      if (e.target.closest('#btn-save-nick')) saveNick();
      if (e.target.closest('#btn-logout-now')) doLogout(false);
      if (e.target.closest('#btn-signout')) doLogout(false);
    });

    var lo1 = document.getElementById('btn-logout-now');
    if (lo1 && !lo1.dataset.on) {
      lo1.dataset.on = "1";
      lo1.addEventListener('click', function () { doLogout(false); });
    }
    var lo2 = document.getElementById('btn-signout');
    if (lo2 && !lo2.dataset.on) {
      lo2.dataset.on = "1";
      lo2.addEventListener('click', function () { doLogout(false); });
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accs) {
        localStorage.removeItem('cd_session');
        localStorage.removeItem('cd_nick');
        if (!accs.length) localStorage.removeItem('cd_wallet');
        else localStorage.setItem('cd_wallet', String(accs[0]).toLowerCase());
        location.reload();
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();