from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "techculture-logo.png"
OUTS = [
    SRC,
    ROOT / "public" / "icon.png",
    ROOT / "app" / "icon.png",
]


def is_black_bg(r: int, g: int, b: int) -> bool:
    # near-black canvas only; keep slate (~50,55,75) and orange
    return r <= 22 and g <= 22 and b <= 28


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    px = im.load()

    seen = [[False] * h for _ in range(w)]
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[x][y]:
            continue
        r, g, b, _a = px[x, y]
        if not is_black_bg(r, g, b):
            continue
        seen[x][y] = True
        px[x, y] = (0, 0, 0, 0)
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if is_black_bg(r, g, b):
                px[x, y] = (0, 0, 0, 0)
                continue
            # dark red/orange anti-alias against former black
            if r >= 18 and g <= 24 and b <= 24 and r < 90 and g < r * 0.45:
                strength = max(r, g, b)
                alpha = max(40, min(255, int(strength * 3.2)))
                px[x, y] = (255, 95, 50, alpha)
                continue
            # dark slate anti-alias against former black
            if r < 40 and g < 45 and b < 55 and b >= r:
                alpha = max(90, min(255, int(max(r, g, b) * 5)))
                px[x, y] = (50, 55, 75, alpha)

    for out in OUTS:
        im.save(out, "PNG")
        check = Image.open(out)
        print("saved", out, "mode", check.mode, "size", check.size)

    c = Image.open(SRC).convert("RGBA")
    for s in [(0, 0), (c.size[0] - 1, 0), (0, c.size[1] - 1), (10, 10)]:
        print("sample", s, c.getpixel(s))


if __name__ == "__main__":
    main()
