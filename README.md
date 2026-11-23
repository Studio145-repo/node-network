# Node Network dashboard

Link-only internal dashboard for Studio 145. Not indexed (`noindex` meta and `robots.txt`).

This repo holds only the built pages and `data/network.json`. The source data and the build script live in the private Studio 145 repo. To refresh: run `scripts/build_data.py` there, then copy `dashboard/data/network.json` here and push to `main`.

View locally: `python3 -m http.server`, then open http://localhost:8000/.

## Instagram API overlay (Nov 23, 2026)

For **@thatcloudstudio** and **@thatreasoningshow**, the Instagram API is the source of record for raw counts. Dex decided this on Nov 23.

`data/ig_api.json` is applied on top of `data/network.json` in the browser (`S.applyIG` in `assets/common.js`), so `network.json` and the build script stay unchanged.

**Taken from the API:**
- followers and total posts
- per-post views, likes, comments, reach, shares and saves for the sampled posts
- the network banner totals built from those values
- 28-day account reach, views, accounts engaged and interactions

**Unchanged, still on the Nov 21 public capture:**
- net score and score parts
- median views and Public RR
- posts/week and post dates

Each value the API replaced still shows, labelled "Tracker, superseded by API".

**To refresh** (by hand, no schedule):
1. Run `scripts/pull_ig_live.py` in `dexrayrobinson/tcs-dashboard`.
2. Run `python3 scripts/build_ig_api.py /path/to/tcs-dashboard/data/ig_live.json` here.

`ig_api.json` keeps only these two accounts and only the posts already sampled in `network.json`. It has no captions and no token. This repo is public.
