#!/usr/bin/env python3
"""Build data/ig_api.json for the node network from an Instagram API pull.

Input: the ig_live.json made by scripts/pull_ig_live.py in the TCS dashboard repo
(dexrayrobinson/tcs-dashboard). That script holds the only token handling; this one never
touches a token. Run by hand, no schedule:

  python3 scripts/build_ig_api.py /path/to/tcs-dashboard/data/ig_live.json

Output is deliberately small because this repo is public (link-only Pages site): account
counts for @thatcloudstudio and @thatreasoningshow, plus per-post numbers ONLY for the
posts already sampled in data/network.json. No captions, no other posts, no other accounts.
Blank API values stay null, never 0.
"""
import json, os, re, sys

ALLOWED = {"thatcloudstudio", "thatreasoningshow"}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODE = re.compile(r"instagram\.com/(?:[^/]+/)?(?:reels?|p|tv)/([\w-]+)", re.I)

src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "..", "tcs-dashboard", "data", "ig_live.json")
live = json.load(open(src))
net = json.load(open(os.path.join(ROOT, "data", "network.json")))
sampled = {p["id"] for part in net["partners"].values() for a in part["accounts"]
           if a["platform"] == "Instagram" for p in a["posts"] if p.get("id")}

out = {"source": live["source"], "pulled_at": live["pulled_at"], "pulled_et": live["pulled_et"],
       "api": live["api"], "window_days": live["window_days"], "window": live["window"], "accounts": {}}
for a in live["accounts"]:
    u = a["username"].lower()
    if u not in ALLOWED:
        continue
    ins = a.get("insights_28d") or {}
    fu = ins.get("follows_and_unfollows") or {}
    posts = {}
    for p in a["posts"]:
        m = CODE.search(p.get("permalink") or "")
        if m and m.group(1) in sampled:
            posts[m.group(1)] = {"date": p.get("date"), "views": p.get("views"), "reach": p.get("reach"),
                                 "likes": p.get("like_count"), "comments": p.get("comments_count"),
                                 "shares": p.get("shares"), "saves": p.get("saved")}
    out["accounts"]["@" + u] = {
        "followers": a["profile"].get("followers_count"), "follows": a["profile"].get("follows_count"),
        "media_count": a["profile"].get("media_count"),
        "reach_28d": ins.get("reach"), "views_28d": ins.get("views"),
        "accounts_engaged_28d": ins.get("accounts_engaged"), "interactions_28d": ins.get("total_interactions"),
        "follows_28d": fu.get("follows"), "unfollows_28d": fu.get("unfollows"),
        "posts": posts}
json.dump(out, open(os.path.join(ROOT, "data", "ig_api.json"), "w"), indent=1)
for h, a in out["accounts"].items():
    print(f"{h}: followers {a['followers']} posts {a['media_count']} matched sampled posts {len(a['posts'])}")
