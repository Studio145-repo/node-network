# Node Network dashboard

Link-only internal dashboard for Studio 145. Not indexed (`noindex` meta and `robots.txt`).

This repo holds only the built pages and `data/network.json`. The source data and the build script live in the private Studio 145 repo. To refresh: run `scripts/build_data.py` there, then copy `dashboard/data/network.json` here and push to `main`.

View locally: `python3 -m http.server`, then open http://localhost:8000/.
