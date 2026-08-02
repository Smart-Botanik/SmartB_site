"""Make hero lockup transparent: remove black plate, trim, write PNG + note dims."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

# Prefer cleaned opaque master; fall back to public PNG
CANDIDATES = [
    Path(
        r"C:\Users\Ilege\.cursor\projects\c-Users-Ilege-projects-growing-app"
        r"\assets\c__Users_Ilege_AppData_Roaming_Cursor_User_workspaceStorage_"
        r"e9b9fdf1cf1d185e19917d774c3ab51b_images_ChatGPT_Image_2____._2026__.__22_18_08-23adcd72-d9c7-492b-ac17-898ab492b30a.png"
    ),
    Path(__file__).resolve().parents[2] / "assets" / "smart-botanik-logo-source-user.png",
]
ASSETS = Path(__file__).resolve().parents[2] / "assets"
PUBLIC = Path(__file__).resolve().parents[1] / "public"
# Keep full resolution of the user source (do not downscale for hero).
TARGET_H = 0
TRIM_PAD = 8
BLACK_THRESH = 36


def chroma(c: tuple[int, int, int]) -> int:
    r, g, b = c
    return max(r, g, b) - min(r, g, b)


def to_rgba_knockout_black(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            # Pure / near-black plate → transparent
            if max(r, g, b) <= BLACK_THRESH and chroma((r, g, b)) <= 16:
                op[x, y] = (0, 0, 0, 0)
                continue
            # Soft edge: dark fringe near plate fades (avoid hard matte)
            if max(r, g, b) <= 55 and chroma((r, g, b)) <= 20:
                # keep a little if it looks like dark text; otherwise fade
                a = int(max(0, (max(r, g, b) - BLACK_THRESH) * (255 / 20)))
                op[x, y] = (r, g, b, a)
                continue
            op[x, y] = (r, g, b, 255)
    return out


def despill_light_fringe(im: Image.Image) -> int:
    """Drop near-white fringe pixels sitting next to transparency."""
    px = im.load()
    w, h = im.size
    changed = 0
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # keep greens, warm sun, brown soil, dark fills
            if g > r + 18 and g > b + 18:
                continue
            if r > 200 and g > 175 and b < 210 and chroma((r, g, b)) > 14:
                continue
            if r > 90 and r > g + 12 and g > b and chroma((r, g, b)) > 18:
                continue
            if max(r, g, b) < 100:
                continue
            C = chroma((r, g, b))
            if C > 30 and min(r, g, b) < 200:
                continue
            neigh_t = sum(
                1
                for nx, ny in (
                    (x - 1, y),
                    (x + 1, y),
                    (x, y - 1),
                    (x, y + 1),
                )
                if px[nx, ny][3] == 0
            )
            if neigh_t >= 1 and C <= 25 and min(r, g, b) >= 170:
                px[x, y] = (0, 0, 0, 0)
                changed += 1
            elif neigh_t >= 2 and C <= 30 and min(r, g, b) >= 140:
                px[x, y] = (0, 0, 0, 0)
                changed += 1
    return changed


def trim_alpha(im: Image.Image, pad: int) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def main() -> None:
    src = next((p for p in CANDIDATES if p.is_file()), None)
    if src is None:
        raise SystemExit("No source logo found")

    print("source", src)
    rgba = to_rgba_knockout_black(Image.open(src))
    print("despill", despill_light_fringe(rgba))
    trimmed = trim_alpha(rgba, TRIM_PAD)
    print("trimmed", trimmed.size)

    tw, th = trimmed.size
    if TARGET_H > 0 and th > TARGET_H:
        nw = int(round(tw * (TARGET_H / th)))
        trimmed = trimmed.resize((nw, TARGET_H), Image.Resampling.LANCZOS)
        # Re-knock near-black introduced by resize
        px = trimmed.load()
        for y in range(trimmed.height):
            for x in range(trimmed.width):
                r, g, b, a = px[x, y]
                if a == 0:
                    continue
                if max(r, g, b) <= BLACK_THRESH and chroma((r, g, b)) <= 16:
                    px[x, y] = (0, 0, 0, 0)
        print("despill after scale", despill_light_fringe(trimmed))
        print("resized", trimmed.size)
    else:
        print("kept full resolution", trimmed.size)

    ASSETS.mkdir(parents=True, exist_ok=True)
    # Archive user source for rebuilds
    user_src = ASSETS / "smart-botanik-logo-source-user.png"
    if not user_src.is_file() and src.is_file():
        Image.open(src).convert("RGB").save(user_src, format="PNG", optimize=True)
        print("archived user source", user_src.name)

    clean = ASSETS / "smart-botanik-logo-hero-clean.png"
    trimmed.save(clean, format="PNG", optimize=True, compress_level=9)

    PUBLIC.mkdir(parents=True, exist_ok=True)
    for name in ("smart-botanik-logo.png", "smart-botanik-logo-full.png"):
        out = PUBLIC / name
        trimmed.save(out, format="PNG", optimize=True, compress_level=9)
        print(out.name, out.stat().st_size, trimmed.mode, trimmed.size)

    # corner must be transparent
    print("corner alpha", trimmed.getpixel((0, 0)))
    print("dims", trimmed.size[0], trimmed.size[1])


if __name__ == "__main__":
    main()
