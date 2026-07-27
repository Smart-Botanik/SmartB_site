"""Despill near-white fringes left after checkerboard removal."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "public" / "smart-botanik-logo-full.png"


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    # Pass 1: any near-white / light-gray pixel next to transparency → transparent
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            chroma = max(r, g, b) - min(r, g, b)
            # keep sun glow (warm, low chroma yellow)
            if r > 230 and g > 220 and b < 210 and chroma > 12:
                continue
            # keep greens
            if g > r + 20 and g > b + 20:
                continue
            # keep dark text (Ботаник)
            if max(r, g, b) < 120:
                continue

            neigh_t = 0
            for nx, ny in (
                (x - 1, y),
                (x + 1, y),
                (x, y - 1),
                (x, y + 1),
                (x - 1, y - 1),
                (x + 1, y - 1),
                (x - 1, y + 1),
                (x + 1, y + 1),
            ):
                if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                    neigh_t += 1

            # light neutral fringe
            if neigh_t >= 1 and chroma <= 22 and min(r, g, b) >= 200:
                px[x, y] = (0, 0, 0, 0)
                changed += 1
            elif neigh_t >= 2 and chroma <= 30 and min(r, g, b) >= 180:
                px[x, y] = (0, 0, 0, 0)
                changed += 1

    # Pass 2: soft alpha for remaining light fringe next to transparent
    soft = im.copy()
    sp = soft.load()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            chroma = max(r, g, b) - min(r, g, b)
            if chroma > 25 or min(r, g, b) < 160:
                continue
            if r > 230 and g > 220 and b < 210:
                continue
            neigh_t = sum(
                1
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                if px[nx, ny][3] == 0
            )
            if neigh_t >= 1:
                # pull toward opaque logo color less; just drop residual matte
                sp[x, y] = (0, 0, 0, 0)
                changed += 1

    soft.save(SRC, format="PNG", optimize=True)
    print("despilled", changed, "pixels; corner", soft.getpixel((0, 0)))
    # sample dark text region roughly lower-center
    dark = 0
    for y in range(420, 520):
        for x in range(300, 700):
            r, g, b, a = soft.getpixel((x, y))
            if a > 200 and max(r, g, b) < 80:
                dark += 1
    print("dark opaque pixels in text band:", dark)


if __name__ == "__main__":
    main()
