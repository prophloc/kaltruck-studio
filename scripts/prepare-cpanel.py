#!/usr/bin/env python3
"""Assemble a transportplockhds.pl static cPanel site from Astro dist/.

Uses original company-hosted photos when reachable. Any unavailable external
image URL remains unchanged rather than creating a broken local reference.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse, unquote
import mimetypes
import os
import re
import sys

dist = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
assert dist.is_dir(), "Run npm build before packaging"
origin = "https://transportplockhds.pl"
text_exts = {".html", ".js", ".css", ".xml", ".json", ".webmanifest"}
contents = {}
for file in dist.rglob("*"):
    if file.is_file() and file.suffix in text_exts:
        try:
            contents[file] = file.read_text(encoding="utf-8")
        except UnicodeError:
            pass

photo_pattern = re.compile(r"https://hdsplock\\.pl/zdj/[a-zA-Z0-9_./%+()@-]+\\.(?:jpg|jpeg|png|webp)", re.I)
image_urls = sorted({match.group() for text in contents.values() for match in photo_pattern.finditer(text)})
headers = {"User-Agent": "Mozilla/5.0 (compatible; KALTRUCK-static-export/1.0)"}

def fetch_one(url):
    parsed = urlparse(url)
    relative = Path(unquote(parsed.path).lstrip("/"))
    # URL paths come from project's checked-in list and must remain inside dist.
    if ".." in relative.parts or relative.parts[0] != "zdj":
        return url, None
    target = dist / "media" / Path(*relative.parts[1:])
    try:
        req = Request(url, headers=headers)
        with urlopen(req, timeout=15) as response:
            data = response.read(14_000_000)
            mime = response.headers.get("Content-Type", "").split(";")[0].lower()
        if len(data) < 150 or (not mime.startswith("image/")):
            raise ValueError("not an image")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return url, "/" + target.relative_to(dist).as_posix()
    except Exception as e:
        print(f"External fallback retained for {url}: {str(e)[:100]}", flush=True)
        return url, None

fetched = {}
if image_urls:
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = [pool.submit(fetch_one,url) for url in image_urls]
        for future in as_completed(futures):
            original, local = future.result()
            if local:
                fetched[original] = local
print(f"Referenced HDS photos: {len(image_urls)}, bundled: {len(fetched)}, external fallback: {len(image_urls)-len(fetched)}")

# Optionally copy the hero OG image, keeping link correct even if unavailable.
original_og = "https://raw.githubusercontent.com/prophloc/kaltruck-premium/main/public/images/home/hero-hds-original.png"
try:
    with urlopen(Request(original_og, headers=headers), timeout=20) as response:
        og_data = response.read(10_000_000)
    if og_data.startswith(b"\\x89PNG") and len(og_data) > 1024:
        (dist / "images").mkdir(exist_ok=True)
        (dist / "images" / "kaltruck-social.png").write_bytes(og_data)
        fetched[original_og] = origin + "/images/kaltruck-social.png"
except Exception as err:
    print("Social preview image remains remote:", str(err)[:140])

for file, original in contents.items():
    updated = original
    for url, local in fetched.items():
        if url in updated:
            updated = updated.replace(url, local)
    if updated != original:
        file.write_text(updated, encoding="utf-8")

apache = r"""Options -Indexes
DirectoryIndex index.html
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^transportplockhds\\.pl$ [NC]
RewriteRule ^ https://transportplockhds.pl%{REQUEST_URI} [R=301,L,NE]
</IfModule>
<IfModule mod_headers.c>
<FilesMatch "\\.(?:css|js|svg|png|jpg|jpeg|webp|ico|woff2?)$">
Header set Cache-Control "public, max-age=604800"
</FilesMatch>
</IfModule>
"""
(dist / ".htaccess").write_text(apache, encoding="utf-8")
html = (dist/"index.html").read_text(encoding="utf-8")
robots = (dist/"robots.txt").read_text(encoding="utf-8")
assert 'rel="canonical" href="'+origin+'/' in html, "wrong production canonical"
assert "Disallow: /" not in robots, "production disallowed by robots"
assert origin + "/sitemap.xml" in robots, "wrong sitemap host"
assert 'studio-seo-ci.example.invalid' not in html
assert (dist / "sitemap.xml").exists()
print("Production cPanel package validated for", origin)
