"""Remove baked-in checkerboard and write a true RGBA PNG."""

from __future__ import annotations

from collections import Counter, deque
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "public" / "smart-botanik-logo-full.png"


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def is_near_gray_neutral(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    mx, mn = max(r, g, b), min(r, g, b)
    # checker cells are neutral gray/white; keep yellowish sun glow (chroma + warm bias)
    chroma = mx - mn
    if chroma > 18:
        return False
    if r > 245 and g > 240 and b < 220:
        return False  # pale yellow
    return mn >= 170  # light neutrals only


def main() -> None:
    rgb = Image.open(SRC).convert("RGB")
    w, h = rgb.size
    px = rgb.load()

    # Analyze corner patch for checker colors / period
    corner = [px[x, y] for y in range(48) for x in range(48)]
    common = [c for c, _ in Counter(corner).most_common(6)]
    print("corner commons:", common)

    # Detect tile size: look for period along first row of near-neutral pixels
    period = 16
    row0 = [px[x, 0] for x in range(min(w, 256))]
    best = None
    for p in range(4, 33):
        mism = sum(1 for i in range(p, min(len(row0), p * 6)) if color_dist(row0[i], row0[i - p]) > 8)
        if best is None or mism < best[0]:
            best = (mism, p)
    if best:
        period = best[1]
        print("detected period:", period, "mismatches:", best[0])

    # Seed colors: two most common corner neutrals
    seeds = [c for c in common if is_near_gray_neutral(c)][:3]
    if not seeds:
        seeds = common[:2]
    print("seed colors:", seeds)

    out = Image.new("RGBA", (w, h))
    out_px = out.load()

    # First pass: mark pixels close to seed checker colors OR matching expected checker cell
    bg = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            c = px[x, y]
            if any(color_dist(c, s) <= 28 and is_near_gray_neutral(c) for s in seeds):
                bg[y][x] = True
                continue
            # expected checker cell color from seeds if we have 2
            if len(seeds) >= 2:
                cell = ((x // period) + (y // period)) % 2
                expected = seeds[cell % len(seeds)]
                if color_dist(c, expected) <= 22 and is_near_gray_neutral(c):
                    bg[y][x] = True

    # Flood-fill refine from corners: keep only background connected to edges via bg marks
    # (avoids punching holes in mid-gray logo parts that somehow matched)
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg[y][x]:
                q.append((x, y))
                visited[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if bg[y][x] and not visited[y][x]:
                q.append((x, y))
                visited[y][x] = True

    connected = [[False] * w for _ in range(h)]
    while q:
        x, y = q.popleft()
        connected[y][x] = True
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and bg[ny][nx]:
                visited[ny][nx] = True
                q.append((nx, ny))

    transparent = 0
    for y in range(h):
        for x in range(w):
            c = px[x, y]
            if connected[y][x]:
                out_px[x, y] = (0, 0, 0, 0)
                transparent += 1
            else:
                out_px[x, y] = (*c, 255)

    # Soften edges: if neighbor is transparent and pixel is near-neutral light, fade it
    soft = out.copy()
    soft_px = soft.load()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if out_px[x, y][3] == 0:
                continue
            c = out_px[x, y][:3]
            if not is_near_gray_neutral(c):
                continue
            neigh_t = sum(
                1
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                if out_px[nx, ny][3] == 0
            )
            if neigh_t >= 2 and any(color_dist(c, s) <= 40 for s in seeds):
                soft_px[x, y] = (0, 0, 0, 0)
                transparent += 1

    soft.save(SRC, format="PNG", optimize=True)
    check = Image.open(SRC)
    print("saved", SRC)
    print("mode", check.mode, "transparent px ~", transparent)
    print("corner after:", soft.getpixel((0, 0)), soft.getpixel((period, 0)))


if __name__ == "__main__":
    main()
