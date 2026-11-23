(function () {
  'use strict';
  var S = window.S145;
  var STATUS = { 'confirmed': '\u2714 confirmed', 'confirmed (Dex, Nov 21)': '\u2714 confirmed by Dex', 'linked from GTV Linktree (not on Dex list)': '\u25D0 via their Linktree, reach only', 'ours': 'our page' };
  function profileUrl(a) {
    var h = a.handle.replace(/^@/, '');
    if (a.platform === 'Instagram') return 'https://www.instagram.com/' + encodeURIComponent(h) + '/';
    if (a.platform === 'YouTube') return 'https://www.youtube.com/@' + encodeURIComponent(h);
    return 'https://www.tiktok.com/@' + encodeURIComponent(h);
  }
  function spark(a) {
    var ps = a.posts.filter(function (p) { return !p.pinned && p.views; }).slice().reverse();
    if (!ps.length) return '';
    var bw = 100 / ps.length, mx = 0;
    var bars = ps.map(function (p, i) {
      mx = Math.max(mx, p.views);
      var h = Math.max(2, Math.log10(p.views) / 6 * 40);
      return '<rect x="' + (i * bw + bw * 0.12).toFixed(2) + '" y="' + (40 - h).toFixed(2) + '" width="' + (bw * 0.76).toFixed(2) +
        '" height="' + h.toFixed(2) + '" fill="' + S.PC[a.platform] + '"><title>' + p.views + ' views, ' + (p.date || '') + '</title></rect>';
    }).join('');
    return '<div class="spark"><div class="ptitle sm">VIEWS, SAMPLED POSTS, OLDEST TO NEWEST (LOG SCALE)</div><svg viewBox="0 0 100 40" preserveAspectRatio="none">' +
      bars + '</svg><div class="spm">max ' + S.f(mx) + '</div></div>';
  }
  function was(p, k) {
    if (!p._trk) return '';
    var o = p._trk[k];
    return o === p[k] ? '' : '<br><small class="was" title="' + S.SUP + '">was ' + (o === null || o === undefined ? '\u2014' : S.f(o)) + '</small>';
  }
  function postTable(a) {
    if (!a.posts.length) return '<div class="mline">No post sample for this account.</div>';
    var api = !!a._api;
    var rows = a.posts.map(function (p) {
      var q = p._api;
      return '<tr class="' + (p.pinned || p.duplicate ? 'pin' : '') + '"><td>' + S.date(p.date) + '</td><td class="r">' + S.f(p.views) + was(p, 'views') + '</td><td class="r">' + S.f(p.likes) + was(p, 'likes') +
        '</td><td class="r">' + S.f(p.comments) + was(p, 'comments') + '</td>' +
        (api ? '<td class="r">' + (q ? S.f(q.reach) : S.na()) + '</td><td class="r">' + (q ? S.f(q.shares) : S.na()) + '</td><td class="r">' + (q ? S.f(q.saves) : S.na()) + '</td>' : '') +
        '<td class="r">' + S.f(p.rr, 1) + '</td><td><small>' + (q ? '<b class="apitag">API</b> ' : api ? 'Not in the API pull for this account (collab owned elsewhere, or removed); Nov 21 capture shown. ' : '') + (p.pinned ? 'Pinned, not scored. ' : '') + (p.duplicate ? 'Not scored again. ' : '') +
        S.esc((p.note || '').replace(/; ?pinned, excluded|pinned, excluded/, '')) + '</small></td><td>' +
        (p.url ? '<a href="' + S.esc(p.url) + '" target="_blank" rel="noopener noreferrer">open</a>' : S.na()) + '</td></tr>';
    }).join('');
    return '<div class="tscroll"><table class="st"><tr><th>Date</th><th class="r">Views</th><th class="r">Likes</th><th class="r">Comments</th>' +
      (api ? '<th class="r">Reach (API)</th><th class="r">Shares (API)</th><th class="r">Saves (API)</th>' : '') +
      '<th class="r">' + (api ? 'Public RR (Nov 21, score input)' : 'Public RR') + '</th><th>Note</th><th>Post</th></tr>' + rows + '</table></div>';
  }
  function acard(a) {
    var box = function (v, l) { return '<div><b>' + v + '</b><span>' + l + '</span></div>'; };
    return '<section class="acard" style="--pc:' + S.PC[a.platform] + '"><div class="ahead"><span class="pchip">' + S.PAB[a.platform] + '</span>' +
      '<a class="ahandle" href="' + profileUrl(a) + '" target="_blank" rel="noopener noreferrer">' + S.esc(a.handle) + '</a>' +
      '<span class="plat">' + S.esc(a.platform) + '</span><span class="astatus">' + S.esc(STATUS[a.status] || a.status) + '</span></div>' +
      (a._api ? '<div class="apiline"><b class="apitag">INSTAGRAM API</b> followers, total posts, per-post views, likes, comments, reach, shares and saves. Med. views, Public RR and posts/wk stay on the Nov 21 capture (score inputs).</div>' : '') +
      '<div class="astats">' + box(a.followers_shown ? S.esc(a.followers_shown) : S.full(a.followers), 'FOLLOWERS' + (a._api ? ' (API)' : '')) + box(a._api ? S.full(a.total_posts) : S.f(a.total_posts), 'TOTAL POSTS' + (a._api ? ' (API)' : '')) +
      box(a.sampled ? String(a.sampled) : S.na(), 'SAMPLED') + box(S.f(a.median_views), a._api ? 'MED. VIEWS (NOV 21, SCORE INPUT)' : 'MED. VIEWS') + box(S.f(a.median_rr, 1), a._api ? 'PUBLIC RR (NOV 21, SCORE INPUT)' : 'PUBLIC RR') +
      box(a.posts_per_week === null ? S.na() : a.posts_per_week.toFixed(1), 'POSTS/WK') + box(a.latest ? S.date(a.latest).replace(/, \d{4}$/, '') : S.na(), 'LATEST') +
      box(a.sampled ? String(a.hidden_likes) : S.na(), 'LIKES HIDDEN') + '</div>' +
      (a._api ? '<div class="astats">' + box(S.full(a._api.reach_28d), '28-DAY REACH (API)') + box(S.full(a._api.views_28d), '28-DAY VIEWS (API)') +
        box(S.full(a._api.accounts_engaged_28d), '28-DAY ACCTS ENGAGED (API)') + box(S.full(a._api.interactions_28d), '28-DAY INTERACTIONS (API)') +
        box(S.full(a.total_views), 'SAMPLED VIEWS (API)') + box(S.full(a.total_engagement), 'SAMPLED ENGAGEMENT (API)') + '</div>' +
        '<div class="mline">' + S.sup('followers ' + (a._trk.followers_shown ? S.esc(a._trk.followers_shown) : S.full(a._trk.followers)) + ' \u00b7 total posts ' + S.full(a._trk.total_posts) +
        ' \u00b7 sampled views ' + S.full(a._trk.total_views) + ' \u00b7 sampled engagement ' + S.full(a._trk.total_engagement)) + '</div>' : '') +
      spark(a) + postTable(a) + '</section>';
  }
  function pcard(x) {
    return '<section class="acard pending"><div class="ahead"><span class="pchip" style="--pc:#6f86b8">' + S.PAB[x.platform] + '</span><span class="ahandle">' +
      S.esc(x.handle) + '</span><span class="tag">' + S.esc(x.label.toUpperCase()) + '</span></div><div class="astats">' +
      ['FOLLOWERS', 'TOTAL POSTS', 'SAMPLED', 'MED. VIEWS', 'PUBLIC RR', 'POSTS/WK', 'LATEST', 'LIKES HIDDEN'].map(function (l) { return '<div><b>' + S.na() + '</b><span>' + l + '</span></div>'; }).join('') +
      '</div><div class="mline">' + S.esc(x.detail) + '</div></section>';
  }
  S.load(function (d) {
    var id = new URLSearchParams(location.search).get('id');
    var p = d.partners[id];
    var back = '<a class="back" href="index.html">\u25C2 NETWORK OVERVIEW</a>';
    if (!p) {
      document.getElementById('app').innerHTML = back + '<div class="err">Unknown partner id: ' + S.esc(id || '(none)') + '.</div>';
      return;
    }
    document.title = 'Studio 145 \u00b7 ' + p.name;
    var n = p.network, isBench = id === d.benchmark;
    var g = function (v, l) { return '<div><b>' + v + '</b><span>' + l + '</span></div>'; };
    var T = n._trk, ap = n._api ? ' <b class="apitag">API</b>' : '';
    var banners = '<div class="banners three">' +
      S.banner('TOTAL VIEWS' + ap, S.ICON.views, S.full(n.total_views), 'total views, recent sampled posts' + (T ? ' (Instagram API for @thatcloudstudio + @thatreasoningshow)' : ''), n.views_posts + ' scored posts, all pages. Pinned posts left out.' + (T ? '<br>' + S.sup(S.full(T.total_views) + ' views on ' + T.views_posts + ' posts') : '')) +
      S.banner('TOTAL REACH' + ap, S.ICON.reach, S.full(n.total_followers), 'reach (followers' + (T ? '; API followers for @thatcloudstudio + @thatreasoningshow' : ', until API data') + ')', 'Followers summed across ' + n.accounts + ' page' + (n.accounts === 1 ? '' : 's') + '.' + (T ? '<br>' + S.sup(S.full(T.total_followers)) : '')) +
      S.banner('TOTAL ENGAGEMENT', S.ICON_ENG, S.full(n.total_engagement), S.engLabel(n), S.full(n.total_likes) + ' likes + ' + S.full(n.total_comments) + ' comments' + (n.shares_saves_posts ? ' + ' + S.full(n.total_shares) + ' shares + ' + S.full(n.total_saves) + ' saves' : '') + '. Hidden counts left out. Collabs on two pages count once.' + (T ? '<br>' + S.sup(S.full(T.total_engagement)) : '')) + '</div>';
    var sc = n._api ? ' (Nov 21 capture, score input)' : '';
    var glance = '<div class="glance small five">' + g(S.f(n.median_views), 'median views per post' + sc) +
      g(S.f(n.median_rr, 1), 'median Public RR' + sc) + g(n.posts_per_week.toFixed(1), 'posts per week, all pages') +
      g(n.platforms + '/3', 'platforms covered') + g(n.sampled_posts, 'recent posts scored') + '</div>';
    var subbars = S.KEYS.map(function (k) {
      return '<div class="sb"><span class="ic">' + S.ICON[k] + '</span><span class="sl">' + S.LBL[k] + '</span><span class="bar"><i style="width:' +
        S.barw(n.sub[k]) + '%"></i></span><span class="sp">' + S.subpts(n.sub[k]) + '</span></div>';
    }).join('');
    var fixes = p.fixes.length ? '<div class="panel fixes"><div class="ptitle">' + p.fixes.length + ' BRAND FIXES</div><ul>' +
      p.fixes.map(function (t, i) { return '<li><span class="num">' + (i + 1) + '</span>' + S.esc(t) + '</li>'; }).join('') + '</ul></div>'
      : '<div class="panel"><div class="ptitle">BENCHMARK</div><div class="mline">These are our own public pages, scored with the same formula as the partners.</div></div>';
    var tags = p.pending.map(function (x) { return ' <span class="tag">' + S.esc(x.label.toUpperCase()) + '</span>'; }).join('');
    var ns = p.not_scored.length ? '<div class="panel" style="margin-top:20px"><div class="ptitle">NOT SCORED</div><ul class="ul">' +
      p.not_scored.map(function (t) { return '<li>' + S.esc(t) + '</li>'; }).join('') + '</ul></div>' : '';
    var method = '<div class="panel" style="margin-top:20px"><div class="ptitle">HOW WE SCORED</div>' +
      '<div class="formula">Public RR = (Comments \u00d7 3 + Likes) \u00f7 Views \u00d7 1000</div>' +
      '<div class="mline warn">Shares and saves are not public. Public RR is not comparable to internal IG-RR.</div>' +
      '<div class="mline">Sample: the last 10 to 14 posts per account. Pinned posts are left out.</div>' +
      '<div class="mline">A blank value shows as \u2014. It never counts as 0. Where YouTube showed comments with no count, RR counts 0 comments.</div>' +
      (n._api ? '<div class="mline warn">Instagram API (Dex, Nov 23): raw counts for @thatcloudstudio and @thatreasoningshow come from the Instagram API (' + S.esc(d.ig.source) +
        '). Net score, score parts, medians, Public RR and posts/wk are unchanged and still use the Nov 21 public capture, pending Dex\u2019s yes. Replaced values are shown as \u201c' + S.SUP + '\u201d.</div>' : '') + '</div>';
    document.getElementById('app').innerHTML = back +
      '<div class="top"><div class="kicker">' + (isBench ? 'OUR BENCHMARK' : 'PARTNER DASHBOARD') + ' \u00b7 ' + S.esc(p.short) + '</div><h1>' + S.esc(p.name) + '</h1>' +
      '<div class="sub">Network view: all ' + n.accounts + ' scored page' + (n.accounts === 1 ? '' : 's') + ' together, then each page on its own.</div></div>' +
      '<div class="hero"><div class="hhead"><img src="' + S.esc(p.avatar) + '" alt=""><div class="hname"><div class="cname big">' + S.esc(p.name) + '</div><div class="cniche">' +
      S.esc(p.niche) + ' \u00b7 ' + S.plats(p) + tags + '</div></div><div class="hscore"><div class="lv">NET SCORE</div><div class="big2">' + n.score + '</div>' + S.badge(n.tier) + '</div></div></div>' +
      '<div class="section">NETWORK TOTALS</div>' + banners + glance +
      '<div class="two"><div class="panel"><div class="ptitle">SCORE PARTS (0-100)</div>' + subbars + '</div>' + fixes + '</div>' +
      (p.watch ? '<div class="watch">\u25B6 ' + S.esc(p.watch) + '</div>' : '') +
      '<div class="section">PAGES</div><div class="pages">' + p.accounts.map(acard).join('') + p.pending.map(pcard).join('') + '</div>' +
      ns + method + S.foot(d);
  });
})();
