#!/usr/bin/env python3
"""Comprueba que cada vídeo de YouTube sigue existiendo y es incrustable (oEmbed) y que las imágenes responden."""
import json, urllib.request, urllib.error
for c in json.load(open("cameras.json", encoding="utf-8"))["camaras"]:
    u = (f"https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v={c['videoId']}"
         if c["tipo"] == "youtube" else c["imagen"])
    try:
        urllib.request.urlopen(u, timeout=15); r = "OK"
    except urllib.error.HTTPError as e: r = f"FALLA ({e.code})"
    except Exception as e: r = f"ERROR ({e})"
    print(f"{r:12} {c['id']}")
