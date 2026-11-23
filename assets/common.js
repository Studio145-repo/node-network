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
  /* full number with commas, for banner metrics */
  S.full = function (n) { return (n === null || n === undefined) ? S.na() : Math.round(n).toLocaleString('en-US'); };
  S.ICON_ENG = '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z"/></svg>';
  S.banner = function (key, icon, value, label, small) {
    return '<div class="banner"><div class="bk">' + key + '</div><div class="bv">' + icon + '<span>' + value + '</span></div><div class="bl">' +
      label + '</div>' + (small ? '<div class="bs">' + small + '</div>' : '') + '</div>';
  };
  S.engLabel = function (x) {
    if (!x.shares_saves_posts) return 'likes + comments; shares/saves not public yet';
    return 'likes + comments; shares/saves only where Insights were read (' + x.shares_saves_posts + ' post' + (x.shares_saves_posts === 1 ? '' : 's') + ')';
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
      '. Public RR is a proxy, not comparable to internal IG-RR.' + (d.ig ? ' Raw Instagram counts for @thatcloudstudio and @thatreasoningshow: ' + S.esc(d.ig.source) + '.' : '') + '</span><span>Studio 145 \u00b7 internal only</span></div>';
  };
  /* Instagram API overlay (Dex, Nov 23 2026): for @thatcloudstudio and @thatreasoningshow the Instagram API
     is the source of record for raw counts. Scores, medians, Public RR and weights are NOT recomputed;
     they stay on the Nov 21 public capture until Dex approves a change. The replaced capture values are kept
     in _trk and shown as "Tracker, superseded by API". A blank API value never replaces anything and is never 0. */
  function totals(posts) {
    var u = {}, list = [];
    posts.forEach(function (x) { var k = x.id || Math.random(); if (!(k in u)) { u[k] = 1; list.push(x); } });
    function ts(k) { var v = list.filter(function (x) { return x[k] !== null && x[k] !== undefined; }); return [v.length ? v.reduce(function (s, x) { return s + x[k]; }, 0) : null, v.length]; }
    var V = ts('views'), L = ts('likes'), C = ts('comments'), SH = ts('shares'), SV = ts('saves');
    var parts = [L[0], C[0], SH[0], SV[0]].filter(function (v) { return v !== null; });
    return { total_views: V[0], views_posts: V[1], total_likes: L[0], likes_posts: L[1], total_comments: C[0], comments_posts: C[1],
      total_shares: SH[0], total_saves: SV[0], total_engagement: parts.length ? parts.reduce(function (a, b) { return a + b; }, 0) : null,
      shares_saves_public: !!(SH[1] || SV[1]),
      shares_saves_posts: list.filter(function (x) { return (x.shares !== null && x.shares !== undefined) || (x.saves !== null && x.saves !== undefined); }).length,
      unique_posts: list.length };
  }
  var TK = ['total_views', 'views_posts', 'total_likes', 'total_comments', 'total_shares', 'total_saves', 'total_engagement', 'shares_saves_posts'];
  S.applyIG = function (d, ig) {
    if (!ig || !ig.accounts) return;
    d.ig = ig;
    Object.keys(d.partners).forEach(function (slug) {
      var p = d.partners[slug], hit = false, allp = [];
      p.accounts.forEach(function (a) {
        var A = a.platform === 'Instagram' && ig.accounts[a.handle];
        if (A) {
          hit = true;
          a._trk = { followers: a.followers, followers_shown: a.followers_shown, total_posts: a.total_posts };
          TK.forEach(function (k) { a._trk[k] = a[k]; });
          a._api = A;
          if (A.followers !== null && A.followers !== undefined) { a.followers = A.followers; a.followers_shown = null; }
          if (A.media_count !== null && A.media_count !== undefined) a.total_posts = A.media_count;
          a.posts.forEach(function (x) {
            var q = A.posts[x.id];
            if (!q) return;
            x._trk = { views: x.views, likes: x.likes, comments: x.comments, shares: x.shares, saves: x.saves, date: x.date };
            x._api = q;
            ['views', 'likes', 'comments', 'shares', 'saves'].forEach(function (k) { if (q[k] !== null && q[k] !== undefined) x[k] = q[k]; });
          });
          var sp = a.posts.filter(function (x) { return !x.pinned && !x.duplicate; });
          var t = totals(sp);
          TK.forEach(function (k) { a[k] = t[k]; });
        }
        allp = allp.concat(a.posts.filter(function (x) { return !x.pinned && !x.duplicate; }));
      });
      if (!hit) return;
      var n = p.network;
      n._trk = { total_followers: n.total_followers };
      TK.forEach(function (k) { n._trk[k] = n[k]; });
      var t = totals(allp);
      TK.forEach(function (k) { n[k] = t[k]; });
      n.total_followers = p.accounts.reduce(function (s, a) { return s + (a.followers || 0); }, 0);
      n._api = true;
    });
  };
  S.SUP = 'Tracker, superseded by API';
  /* Account-level views for a period, straight from Instagram Insights. These are the numbers to compare
     with the Instagram app; sampled-post totals are a different thing and are labelled as such. */
  S.acctBanners = function (ig) {
    if (!ig || !ig.accounts) return '';
    var w = ig.window_30d, has30 = function (a) { return a.views_30d !== null && a.views_30d !== undefined; };
    var hs = Object.keys(ig.accounts);
    return '<div class="banners">' + hs.map(function (h) {
      var a = ig.accounts[h], t = has30(a);
      return S.banner(S.esc(h.toUpperCase()) + ' \u00b7 ' + (t ? 'LAST 30 DAYS' : 'LAST ' + ig.window_days + ' DAYS') + ' <b class="apitag">API</b>', S.ICON.views,
        S.full(t ? a.views_30d : a.views_28d), S.esc(h) + ' ' + S.full(t ? a.views_30d : a.views_28d) + ' views (' + (t ? 'last 30 days' : 'last ' + ig.window_days + ' days') + ', Instagram API)',
        'Reach ' + S.full(t ? a.reach_30d : a.reach_28d) + ' \u00b7 accounts engaged ' + S.full(t ? a.accounts_engaged_30d : a.accounts_engaged_28d) +
        ' \u00b7 interactions ' + S.full(t ? a.interactions_30d : a.interactions_28d) +
        (t ? '<br>28-day: ' + S.full(a.views_28d) + ' views \u00b7 reach ' + S.full(a.reach_28d) + ' \u00b7 engaged ' + S.full(a.accounts_engaged_28d) : ''));
    }).join('') + '</div>' +
      (w ? '<div class="apiline">Window: ' + S.esc(w.since) + ' \u2192 ' + S.esc(w.until) + ' ET (rolling 30 days; the Graph API allows at most 30 days). Instagram\u2019s app uses its own day boundaries, so its \u201clast 30 days\u201d can differ a little. ' + S.esc(ig.source) + '.</div>' : '');
  };
  S.sup = function (v) { return '<span class="sup" title="' + S.SUP + ' (Nov 21 public capture)">' + S.SUP + ': ' + v + '</span>'; };
  S.load = function (cb) {
    var ig = fetch('data/ig_api.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    fetch('data/network.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { return ig.then(function (x) { S.applyIG(d, x); return d; }); })
      .then(cb)
      .catch(function (e) {
        document.getElementById('app').innerHTML = '<div class="err">Could not load data/network.json (' + S.esc(e.message) +
          '). Open this page through a local server: run <code>python3 -m http.server</code> in the dashboard folder.</div>';
        if (window.console) console.error(e);
      });
  };
  window.S145 = S;
})();
