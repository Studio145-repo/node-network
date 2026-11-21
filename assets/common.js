/* Shared helpers. No third-party code. */
(function () {
  'use strict';
  var DASH = '\u2014';
  var S = {};
  S.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  S.na = function () { return '<span class="na">' + DASH + '</span>'; };
  /* blank stays blank: null or undefined shows a dash, never 0 */
  S.f = function (n, d) {
    if (n === null || n === undefined || n === '') return S.na();
    if (typeof n === 'string') return S.esc(n);
    if (d) return n.toFixed(d);
    n = Math.round(n);
    return n >= 10000 ? (n / 1000).toFixed(1) + 'K' : n.toLocaleString('en-US');
  };
  S.date = function (iso) {
    if (!iso) return S.na();
    var p = iso.split('-');
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+p[1] - 1];
    return m + ' ' + (+p[2]) + ', ' + p[0];
  };
  S.TIERC = { Rookie: '#8fa3c7', Champion: '#3fb6ff', Ultimate: '#e86a10', Mega: '#ffd23f' };
  S.PC = { Instagram: '#e86a10', YouTube: '#3fb6ff', TikTok: '#ffd23f' };
  S.PAB = { Instagram: 'IG', YouTube: 'YT', TikTok: 'TT' };
  S.badge = function (t) {
    return '<span class="tier" style="--tc:' + S.TIERC[t] + '">' + S.esc(t.toUpperCase()) + '</span>';
  };
  S.ICON = {
    reach: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><circle cx="17" cy="9" r="3"/><path d="M1 21c0-4 4-7 8-7s8 3 8 7z"/><path d="M15 14c4 0 8 2 8 6h-5"/></svg>',
    views: '<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5" fill="#0a1236"/></svg>',
    rr: '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z"/></svg>',
    consistency: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="18" rx="2"/><rect x="2" y="4" width="20" height="5" fill="#0a1236"/><rect x="6" y="12" width="3" height="3" fill="#0a1236"/><rect x="11" y="12" width="3" height="3" fill="#0a1236"/><rect x="16" y="12" width="3" height="3" fill="#0a1236"/></svg>',
    coverage: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="9" height="9"/><rect x="13" y="2" width="9" height="9"/><rect x="2" y="13" width="9" height="9"/><rect x="13" y="13" width="9" height="9" opacity=".35"/></svg>'
  };
  S.KEYS = ['reach', 'views', 'rr', 'consistency', 'coverage'];
  S.LBL = { reach: 'REACH', views: 'VIEWS', rr: 'PUBLIC RR', consistency: 'CONSIST.', coverage: 'COVERAGE' };
  S.statval = function (n, k) {
    return {
      reach: S.f(n.total_followers), views: S.f(n.median_views), rr: S.f(n.median_rr, 1),
      consistency: (n.posts_per_week === null ? S.na() : n.posts_per_week.toFixed(1) + '/wk'),
      coverage: n.platforms + '/3'
    }[k];
  };
  S.subpts = function (v) { return v === null || v === undefined ? S.na() : String(v); };
  S.barw = function (v) { return v === null || v === undefined ? 0 : v; };
  S.plats = function (p) {
    var order = ['Instagram', 'YouTube', 'TikTok'], seen = {};
    p.accounts.forEach(function (a) { seen[a.platform] = 1; });
    return order.filter(function (x) { return seen[x]; }).join(' \u00b7 ');
  };
  S.foot = function (d) {
    return '<div class="foot"><span>Public data captured ' + S.esc(d.capture_label) +
      '. Public RR is a proxy, not comparable to internal IG-RR.</span><span>Studio 145 \u00b7 internal only</span></div>';
  };
  S.load = function (cb) {
    fetch('data/network.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(cb)
      .catch(function (e) {
        document.getElementById('app').innerHTML = '<div class="err">Could not load data/network.json (' + S.esc(e.message) +
          '). Open this page through a local server: run <code>python3 -m http.server</code> in the dashboard folder.</div>';
        if (window.console) console.error(e);
      });
  };
  window.S145 = S;
})();
