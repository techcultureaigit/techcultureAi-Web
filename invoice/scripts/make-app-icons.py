"""Build square PWA / splash icons from the TechCulture wordmark logo."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "public" / "techculture-logo.png"
OUT_DIR = ROOT / "public"
APP_ICON = ROOT / "app" / "icon.png"


def content_cols(im: Image.Image) -> list[bool]:
    w, h = im.size
    px = im.load()
    cols = []
    for x in range(w):
        cols.append(any(px[x, y][3] > 20 for y in range(h)))
    return cols


def content_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    w, h = im.size
    px = im.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 20:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def extract_emblem(logo: Image.Image) -> Image.Image:
    left, top, right, bottom = content_bbox(logo)
    cols = content_cols(logo)

    started = False
    gap_start = None
    for x, has in enumerate(cols):
        if has:
            started = True
        elif started:
            end = x
            while end < len(cols) and not cols[end]:
                end += 1
            if end - x >= 8:
                gap_start = x
                break

    emblem_right = gap_start if gap_start is not None else left + (right - left) // 3
    return logo.crop((left, top, emblem_right, bottom))


def fit_square(src: Image.Image, size: int, pad_ratio: float, bg: tuple[int, int, int, int]) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    max_side = int(size * (1 - pad_ratio * 2))
    ratio = min(max_side / src.width, max_side / src.height)
    nw = max(1, int(src.width * ratio))
    nh = max(1, int(src.height * ratio))
    scaled = src.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(scaled, (x, y), scaled)
    return canvas


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    emblem = extract_emblem(logo)
    print("emblem", emblem.size)

    # Light splash / "any" icons — white background matches PWA background_color
    icon_512 = fit_square(emblem, 512, pad_ratio=0.14, bg=(247, 248, 250, 255))
    icon_192 = fit_square(emblem, 192, pad_ratio=0.14, bg=(247, 248, 250, 255))

    # Maskable needs ~20% safe zone; orange brand fill reads well on Android splash
    maskable_512 = fit_square(emblem, 512, pad_ratio=0.22, bg=(249, 115, 22, 255))
    maskable_192 = fit_square(emblem, 192, pad_ratio=0.22, bg=(249, 115, 22, 255))

    # Transparent square for Next.js / favicon usage
    icon_transparent = fit_square(emblem, 512, pad_ratio=0.12, bg=(0, 0, 0, 0))

    outs = {
        OUT_DIR / "icon-192.png": icon_192,
        OUT_DIR / "icon-512.png": icon_512,
        OUT_DIR / "icon-maskable-192.png": maskable_192,
        OUT_DIR / "icon-maskable-512.png": maskable_512,
        OUT_DIR / "icon.png": icon_transparent,
        APP_ICON: icon_transparent,
    }
    for path, im in outs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        im.save(path, "PNG")
        print("saved", path.name, im.size, im.mode)


if __name__ == "__main__":
    main()
