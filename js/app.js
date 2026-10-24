/* Shared shell for every portal page: one sidebar, one top bar, four roles.
   Pages call App.mount({...}). Sample state is kept in localStorage (per browser) so flows can be clicked through. */
(function () {
  var D = window.DBT_DATA;
  var mem = {};

  /* ---------- storage ---------- */
  var store = {
    get: function (k, seed) {
      try { var v = localStorage.getItem('dbt-' + k); if (v !== null) return JSON.parse(v); } catch (e) { if (k in mem) return mem[k]; }
      return seed === undefined ? undefined : JSON.parse(JSON.stringify(seed));
    },
    set: function (k, v) { try { localStorage.setItem('dbt-' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
    reset: function () { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('dbt-') === 0 && k !== 'dbt-theme-v2') localStorage.removeItem(k); }); } catch (e) {} mem = {}; }
  };

  /* ---------- roles and menus ---------- */
  var ROLES = {
    client: { label: 'Client', name: 'Aisha Khan', email: 'aisha.khan@gmail.com', companies: ['c1'], owner: true, tenant: 'aisha.khan@gmail.com', home: 'dashboard.html', homeName: 'Overview', area: 'Client workspace', member: { name: 'Mia Fischer', email: 'mia.fischer@company1.example', companies: ['c1'] } },
    multi: { label: 'Multi-company client', name: 'Diego Alvarez', email: 'diego@acme.co', companies: ['c1', 'c2', 'elite'], owner: true, tenant: 'diego@acme.co', home: 'companies.html', homeName: 'Companies', area: 'Client workspace', member: { name: 'Priya Shah', email: 'priya.shah@acme.co', companies: ['c2', 'elite'] } },
    guest: { label: 'Guest', name: 'Jordan Lee', email: 'jordan@example.com', companies: ['c1'], owner: false, tenant: 'aisha.khan@gmail.com', home: 'dashboard.html', homeName: 'Overview', area: 'Guest access' },
    admin: { label: 'Admin', name: 'Khan Abid', email: 'khan@gmail.com', companies: [], owner: true, home: 'admin.html', homeName: 'Admin overview', area: 'Admin' }
  };
  var CLIENT_NAV = [['dashboard.html', 'Overview'], ['market.html', 'Market activity'], ['trades.html', 'Trade history'], ['comparison.html', 'Peer comparison'], ['reports.html', 'Reports'], ['accounting.html', 'Statements'], ['subscription.html', 'Subscription'], ['company.html', 'Company profile'], ['team.html', 'Team'], ['tickets.html', 'Support']];
  var NAV = {
    client: CLIENT_NAV,
    multi: [['companies.html', 'Companies']].concat(CLIENT_NAV),
    guest: [['dashboard.html', 'Overview'], ['trades.html', 'Trade history'], ['reports.html', 'Reports']],
    admin: [['admin.html', 'Admin overview'], ['companies.html', 'Companies'], ['signup-links.html', 'Client sign-up links'], ['access-requests.html', 'Access requests'], ['users.html', 'Users'], ['admin-subscriptions.html', 'Subscriptions'], ['data-health.html', 'Data health'], ['access-log.html', 'Access log'], ['tickets.html', 'Support tickets'], ['wireframes.html', 'Screen map']]
  };

  function defaultSession(role) {
    var r = ROLES[role];
    return { role: role, name: r.name, email: r.email, companies: r.companies.slice(), owner: r.owner, tenant: r.tenant };
  }
  function session() {
    var s = store.get('session');
    if (!s || !ROLES[s.role]) { s = defaultSession('client'); store.set('session', s); }
    return s;
  }
  function login(role) { store.set('session', defaultSession(role)); store.set('company', null); return ROLES[role].home; }
  function setSession(s) { store.set('session', s); store.set('company', null); }

  /* ---------- helpers ---------- */
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Number(n).toLocaleString('en-GB'); }
  function badge(cls, text) { return '<span class="bd ' + cls + '">' + esc(text) + '</span>'; }
  function chips(ids) { return (ids || []).map(function (i) { return '<span class="chip">' + esc((D.COMPANIES[i] || { name: i }).name) + '</span>'; }).join(' '); }
  function logo(size) { size = size || 28; return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 3 30 29H2z" fill="#F2B705"/><path d="M16 12 21.5 23h-11z" fill="#0A1220"/></svg><span class="text-sm font-semibold tracking-widest">DELTABLOCK</span>'; }
  function today() { return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d); }
  function token(prefix) { return (prefix || 't') + '-' + Math.random().toString(36).slice(2, 8); }
  function absUrl(rel) { try { return new URL(rel, location.href).href; } catch (e) { return rel; } }
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function typeLabel(p) { return p.type === 'admin' ? 'Admin' : p.type === 'guest' ? 'Guest' : p.type === 'colleague' ? 'Client · colleague' : (p.owner ? 'Client · account owner' : 'Client'); }
  function daysUntil(iso) { return Math.round((Date.parse(iso) - Date.parse(D.TODAY)) / 86400000); }
  function pending() { return store.get('requests', D.REQUESTS).filter(function (r) { return r.status === 'pending'; }).length; }

  /* Deterministic sample series per company so every page agrees: price, volume, spread. */
  function rng(seed) { var x = seed >>> 0; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
  function seedOf(id) { var h = 7; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h; }
  function series(id, n, salt) {
    var c = D.COMPANIES[id], r = rng(seedOf(id) + (salt || 0)), p = c.price * 0.93, out = [];
    for (var i = 0; i < n; i++) { p += (r() - 0.46) * c.price * 0.03; p = Math.max(c.price * 0.75, Math.min(c.price * 1.18, p)); out.push({ p: p, v: c.vol30 / 30 * (0.35 + r() * 1.3), s: c.spread30 * (0.8 + r() * 0.45) }); }
    var k = c.price / out[n - 1].p; out.forEach(function (x) { x.p *= k; });
    return out;
  }
  function fmtDate(iso) { return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z')); }
  function addIso(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

  /* Peer position of a company against an anonymised peer group (30-day figures). */
  var MEASURES = [['Average daily volume', 'shares', 'vol'], ['Average spread', 'bps', 'spr'], ['Time at minimum spread', '%', 'tim'], ['Market turnover', '%', 'turn']];
  function fmtM(i, v) { return i === 0 ? num(v) : i === 1 ? Number(v).toFixed(1) : i === 2 ? Number(v).toFixed(1) + '%' : Number(v).toFixed(2) + '%'; }
  function position(id, g) {
    var k = D.KPI[id]['30d'];
    return MEASURES.map(function (m, i) {
      var v = k[m[2]], med = g.median[i], d = (v - med) / med, st;
      if (Math.abs(d) < 0.1) st = ['inf', 'Near median'];
      else { var up = d > 0; st = [(i === 1 ? !up : up) ? 'ok' : 'warn', up ? 'Above median' : 'Below median']; }
      return { label: m[0], unit: m[1], value: fmtM(i, v), median: fmtM(i, med), range: g.range[i], state: st };
    });
  }
  function spark(vals) {
    var w = 70, h = 24, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rg = (mx - mn) || 1;
    return '<svg viewBox="0 0 70 24" class="h-6 w-16" aria-hidden="true"><path d="' + vals.map(function (v, i) { return (i ? 'L' : 'M') + (i * w / (vals.length - 1)).toFixed(1) + ',' + (h - 2 - (v - mn) / rg * (h - 4)).toFixed(1); }).join('') + '" fill="none" stroke-width="1.6" class="c-spark"/></svg>';
  }

  function copy(text) {
    var done = function () { toast('Link copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this link', text); });
    else window.prompt('Copy this link', text);
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.innerHTML = '<span class="bd ok">Done</span>' + esc(msg);
    t.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
  }
  function openModal(id) { var m = document.getElementById(id); if (m) { m.classList.add('open'); var f = m.querySelector('input,select,textarea'); if (f) setTimeout(function () { f.focus(); }, 30); } }
  function closeModals() { document.querySelectorAll('.modal.open').forEach(function (m) { m.classList.remove('open'); }); }
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openModal(o.getAttribute('data-open')); return; }
    var c = e.target.closest && e.target.closest('[data-close]');
    if (c) { e.preventDefault(); closeModals(); return; }
    if (e.target.classList && e.target.classList.contains('modal')) closeModals();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

  /* ---------- shell ---------- */
  function shell(ctx, opts) {
    var r = ctx.roleInfo, s = ctx.s;
    var nav = NAV[s.role];
    var activeHref = opts.navFor || (opts.page + '.html');
    if (s.role === 'admin' && opts.scoped) activeHref = 'companies.html';
    var items = nav.map(function (n) {
      var on = n[0] === activeHref;
      var count = (n[0] === 'access-requests.html' && pending()) ? '<span class="navcount">' + pending() + '</span>' : '';
      return '<a href="' + n[0] + '" class="' + (on ? 'on' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(n[1]) + count + '</a>';
    }).join('');
    var help = (s.role === 'client' || s.role === 'multi') ? '<div class="m-3 rounded-xl bg-white/5 p-4 text-xs text-[#AEB8CE]">Need help? <a href="tickets.html?new=1" class="!m-0 !inline !p-0 text-white underline">Open a support ticket</a>.</div>' : '';

    var crumb = '<span>' + esc(r.area) + '</span>';
    if (s.role === 'admin' && opts.scoped) crumb += '<span>/</span><a class="hover:underline" href="companies.html">Companies</a><span>/</span><span class="crumb-co">' + esc(ctx.co.name) + '</span>';
    crumb += '<span>/</span><span class="font-medium text-ink">' + esc(opts.crumb || opts.title) + '</span>';

    var switcher = '';
    if (opts.scoped) {
      if (ctx.allowed.length > 1) {
        switcher = '<label class="hidden items-center gap-2 text-xs text-mut sm:flex">Company <select id="company-switch" class="inp !w-40 !py-1.5" aria-label="Company">' +
          ctx.allowed.map(function (id) { return '<option value="' + id + '"' + (id === ctx.co.id ? ' selected' : '') + '>' + esc(D.COMPANIES[id].name) + '</option>'; }).join('') + '</select></label>';
      } else {
        switcher = '<span class="chip hidden sm:inline-flex">' + esc(ctx.co.name) + '</span>';
      }
    }
    var themeBtn = '<button type="button" data-theme-toggle class="btn !p-2" aria-label="Toggle dark mode" title="Toggle dark mode"><span class="t-moon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg></span><span class="t-sun"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></span></button>';

    return '<input id="responsive-nav" class="sr-only" type="checkbox"><label class="nav-backdrop" for="responsive-nav" aria-label="Close navigation"></label>' +
      '<div class="flex min-h-screen"><aside class="side responsive-side flex w-52 shrink-0 flex-col" aria-label="Main">' +
      '<a class="flex h-16 items-center gap-3 border-b border-white/10 px-5 text-white" href="' + r.home + '" aria-label="DeltaBlock home">' + logo(28) + '</a>' +
      '<nav class="flex-1 py-4">' + items + '</nav>' + help + '</aside>' +
      '<div class="min-w-0 flex-1"><header class="flex h-14 items-center border-b bg-surf px-6"><label class="btn mobile-menu" for="responsive-nav" aria-label="Open navigation"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></label>' +
      '<div class="hidden items-center gap-2 text-sm text-cap sm:flex">' + crumb + '</div>' +
      '<div class="ml-auto flex items-center gap-3">' + switcher + themeBtn +
      '<a href="login.html" class="text-sm text-mut hover:underline">Sign out</a>' +
      '<div class="flex items-center gap-2 border-l pl-3" aria-label="Signed in as ' + esc(s.name) + ', ' + esc(r.label) + '"><span class="grid h-8 w-8 shrink-0 place-items-center" style="color:#F2B705" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20c.35-3.45 2.75-5.5 6.5-5.5s6.15 2.05 6.5 5.5"/></svg></span><div class="hidden leading-tight sm:block"><div class="text-sm font-semibold text-ink">' + esc(s.name) + '</div><div class="text-xs text-cap">' + esc(r.label) + (s.role !== 'admin' && s.role !== 'guest' && s.owner === false ? ' · team member' : '') + '</div></div></div></div></header>' +
      '<main id="main" class="mx-auto max-w-[1280px] p-6 md:p-8"></main></div></div><div id="overlays"></div><div id="toast" class="toast" role="status" aria-live="polite"></div>';
  }

  function denied(ctx) {
    var r = ctx.roleInfo;
    return '<div class="card mx-auto mt-10 max-w-lg p-8 text-center"><h1 class="text-xl font-semibold">This page is not part of your access</h1><p class="mt-2 text-sm text-mut">' + esc(r.label) + ' accounts do not include this page. Your menu shows everything you can open.</p><a class="btn btn-p mt-6" href="' + r.home + '">Go to ' + esc(r.homeName) + '</a></div>';
  }

  function buildCtx() {
    var s = session();
    var allowed = s.role === 'admin' ? D.ORDER.slice() : (s.companies && s.companies.length ? s.companies.slice() : ['c1']);
    var cur = store.get('company');
    if (!cur || allowed.indexOf(cur) < 0) cur = allowed[0];
    return { s: s, role: s.role, roleInfo: ROLES[s.role], allowed: allowed, co: D.COMPANIES[cur], owner: s.role === 'admin' || (s.role !== 'guest' && s.owner !== false) };
  }

  function mount(opts) {
    var root = document.getElementById('root');
    var ctx = buildCtx();
    document.title = (opts.title || '') + ' | Deltablock';
    var ok = !opts.roles || opts.roles.indexOf(ctx.role) >= 0;
    root.innerHTML = shell(ctx, opts);
    var main = document.getElementById('main'), overlays = document.getElementById('overlays');

    function paint() {
      ctx = buildCtx();
      ctx.refresh = paint;
      if (!ok) { main.innerHTML = denied(ctx); overlays.innerHTML = ''; return; }
      main.innerHTML = opts.render(ctx);
      overlays.innerHTML = typeof opts.extra === 'function' ? opts.extra(ctx) : (opts.extra || '');
      if (opts.after) opts.after(ctx, main, overlays);
    }
    paint();
    var sw = document.getElementById('company-switch');
    if (sw) sw.addEventListener('change', function () {
      store.set('company', sw.value);
      document.querySelectorAll('.crumb-co').forEach(function (n) { n.textContent = D.COMPANIES[sw.value].name; });
      paint();
      toast('Showing ' + D.COMPANIES[sw.value].name);
    });
    return ctx;
  }

  window.App = { D: D, store: store, ROLES: ROLES, NAV: NAV, session: session, login: login, setSession: setSession, defaultSession: defaultSession,
    esc: esc, num: num, badge: badge, chips: chips, logo: logo, today: today, addDays: addDays, token: token, absUrl: absUrl, qs: qs, typeLabel: typeLabel,
    daysUntil: daysUntil, pending: pending, rng: rng, MEASURES: MEASURES, position: position, spark: spark, fmtM: fmtM, seedOf: seedOf, series: series, fmtDate: fmtDate, addIso: addIso, copy: copy, toast: toast, openModal: openModal, closeModals: closeModals, mount: mount,
    people: function () { return store.get('people', D.PEOPLE); }, savePeople: function (p) { store.set('people', p); },
    links: function () { return store.get('links', D.LINKS); }, saveLinks: function (l) { store.set('links', l); },
    requests: function () { return store.get('requests', D.REQUESTS); }, saveRequests: function (r) { store.set('requests', r); },
    subs: function () { return store.get('subs', D.SUB); }, saveSubs: function (x) { store.set('subs', x); },
    tickets: function () { return store.get('tickets', D.TICKETS); }, saveTickets: function (t) { store.set('tickets', t); } };
})();
