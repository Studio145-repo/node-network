(function () {
  'use strict';
  var S = window.S145;
  function tile(d, slug) {
    var p = d.partners[slug], n = p.network;
    var rows = S.KEYS.map(function (k) {
      return '<div class="srow"><span class="ic">' + S.ICON[k] + '</span><span class="sl">' + S.LBL[k] +
        '</span><span class="sv">' + S.statval(n, k) + '</span><span class="sp">' + S.subpts(n.sub[k]) +
        '</span><span class="bar"><i style="width:' + S.barw(n.sub[k]) + '%"></i></span></div>';
    }).join('');
    var tags = p.pending.map(function () { return '<span class="tag">IG PENDING</span>'; }).join(' ');
    return '<a class="card" href="partner.html?id=' + encodeURIComponent(slug) + '" data-slug="' + S.esc(slug) + '">' +
      '<div class="chead"><img src="' + S.esc(p.avatar) + '" alt=""><div><div class="lv">NET SCORE <b>' + n.score +
      '</b></div><div class="cname">' + S.esc(p.short) + '</div><div class="cniche">' + S.esc(p.niche) + '</div></div></div>' +
      '<div class="cbadge">' + S.badge(n.tier) + ' ' + tags + '<span class="plat">' + S.plats(p) + '</span></div>' +
      '<div class="stats">' + rows + '</div><div class="open">OPEN DASHBOARD \u25B8</div></a>';
  }
  function bench(d) {
    var p = d.partners[d.benchmark], n = p.network;
    var handles = p.accounts.map(function (a) { return S.PAB[a.platform] + ' ' + S.esc(a.handle); }).join(' \u00b7 ');
    return '<a class="card bench" href="partner.html?id=' + encodeURIComponent(d.benchmark) + '" data-slug="' + S.esc(d.benchmark) + '">' +
      '<div class="ptitle">OUR BENCHMARK</div><div class="cname">' + S.esc(p.short) + '</div><div class="lv">NET SCORE <b>' + n.score +
      '</b></div><div>' + S.badge(n.tier) + '</div><div class="bline">Same formula, our public pages.</div><div class="bline">' + handles +
      '</div><div class="open">OPEN DASHBOARD \u25B8</div></a>';
  }
  S.load(function (d) {
    var sm = d.summary, lead = d.order[0];
    var tiers = Object.keys(sm.tiers).filter(function (t) { return sm.tiers[t]; });
    var banners = '<div class="banners">' +
      S.banner('NETWORK TOTAL VIEWS', S.ICON.views, S.full(sm.total_views), 'total views, recent sampled posts',
        'All ' + sm.partners + ' partners. ' + sm.views_posts + ' scored posts. Pinned posts left out.') +
      S.banner('NETWORK TOTAL ENGAGEMENT', S.ICON_ENG, S.full(sm.total_engagement), S.engLabel(sm),
        S.full(sm.total_likes) + ' likes + ' + S.full(sm.total_comments) + ' comments, same posts. Hidden counts are left out, not read as 0.') + '</div>';
    var glance = '<div class="glance small"><div><b>' + S.f(sm.total_followers) + '</b><span>followers across ' + sm.partners + ' partners</span></div>' +
      '<div><b>' + sm.accounts + '</b><span>public accounts checked</span></div>' +
      '<div><b>' + sm.sampled_posts + '</b><span>recent posts scored</span></div>' +
      '<div><b>' + tiers.map(function (t) { return sm.tiers[t]; }).join(' \u00b7 ') + '</b><span>' + tiers.join(' \u00b7 ') + '</span></div></div>';
    var legend = '<div class="legend panel"><div class="ptitle">HOW THE SCORE WORKS</div><div class="lg">' +
      '<div><b>Weights</b> Reach 25 \u00b7 Median views 25 \u00b7 Public RR 25 \u00b7 Consistency 15 \u00b7 Coverage 10</div>' +
      '<div><b>Tiers</b> ' + ['Rookie', 'Champion', 'Ultimate', 'Mega'].map(S.badge).join(' ') + ' &nbsp;0-39 \u00b7 40-59 \u00b7 60-79 \u00b7 80-100</div>' +
      '<div><b>Public RR</b> = (Comments\u00d73 + Likes) \u00f7 Views \u00d7 1000. Median per account. Not comparable to internal IG-RR.</div>' +
      '<div><b>Blanks</b> A blank value shows as \u2014. It never counts as 0. Unconfirmed handles are not scored.</div></div></div>';
    var gaps = '<div class="two"><div class="panel"><div class="ptitle">DATA GAPS</div><ul class="ul">' +
      d.gaps.map(function (g) { return '<li>' + S.esc(g) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="panel"><div class="ptitle">TOP FIX PER PARTNER</div><ul class="ul">' +
      d.order.map(function (s) { var p = d.partners[s]; return '<li><b class="o">' + S.esc(p.short) + '</b> ' + S.esc(p.fixes[0] || '') + '</li>'; }).join('') +
      '</ul></div></div>';
    document.getElementById('app').innerHTML =
      '<div class="top"><div class="kicker">STUDIO 145 \u00b7 PARTNER NETWORK</div><h1>Network status: <span class="o">' + sm.partners + ' partners</span></h1>' +
      '<div class="sub">' + S.esc(d.partners[lead].short) + ' leads at ' + S.esc(d.partners[lead].network.tier) + '. Click a tile to open that partner\u2019s dashboard.</div></div>' +
      banners + glance + '<div class="grid">' + d.order.map(function (s) { return tile(d, s); }).join('') + bench(d) + '</div>' +
      legend + gaps + S.foot(d);
  });
})();
