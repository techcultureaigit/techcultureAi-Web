"""Remove cream / soft-peach background from animated GIF via edge flood-fill."""
from __future__ import annotations

import os
import shutil
from collections import deque

from PIL import Image

SRC = "public/mobile.gif"
BACKUP = "public/mobile.orig.gif"
OUT = "public/mobile.gif"


def is_bg_like(r: int, g: int, b: int) -> bool:
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    mx, mn = max(r, g, b), min(r, g, b)
    sat = ((mx - mn) / mx) if mx else 0.0
    if lum >= 228 and sat <= 0.12:
        return True
    if lum >= 210 and r >= 220 and g >= 200 and b >= 190 and (r - b) <= 55 and sat <= 0.22:
        return True
    if lum >= 220 and sat <= 0.08:
        return True
    return False


def remove_bg(frame_rgba: Image.Image) -> Image.Image:
    w, h = frame_rgba.size
    px = frame_rgba.load()
    visited = [[False] * h for _ in range(w)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[x][y]:
            r, g, b, _a = px[x, y]
            if is_bg_like(r, g, b):
                visited[x][y] = True
                q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                r, g, b, _a = px[nx, ny]
                if is_bg_like(r, g, b):
                    visited[nx][ny] = True
                    q.append((nx, ny))
    return frame_rgba


def rgba_to_gif_frame(fr: Image.Image) -> Image.Image:
    """Convert RGBA to palette GIF frame with index 255 = transparent."""
    alpha = fr.getchannel("A")
    rgb = fr.convert("RGB")
    pimg = rgb.convert("P", palette=Image.ADAPTIVE, colors=255)
    # Force transparent pixels to index 255
    p_bytes = bytearray(pimg.tobytes())
    a_bytes = alpha.tobytes()
    for i, a in enumerate(a_bytes):
        if a < 16:
            p_bytes[i] = 255
    out = Image.frombytes("P", pimg.size, bytes(p_bytes))
    out.putpalette(pimg.getpalette())
    out.info["transparency"] = 255
    return out


def main() -> None:
    if not os.path.exists(BACKUP):
        shutil.copy2(SRC, BACKUP)
        print(f"Backup saved: {BACKUP}")

    im = Image.open(SRC if not os.path.exists(BACKUP) else BACKUP)
    # Always process from backup so re-runs stay clean
    if os.path.exists(BACKUP):
        im = Image.open(BACKUP)

    frames: list[Image.Image] = []
    durations: list[int] = []
    n = getattr(im, "n_frames", 1)
    print(f"Processing {n} frames...")

    for i in range(n):
        im.seek(i)
        durations.append(im.info.get("duration", 40))
        frames.append(remove_bg(im.convert("RGBA")))
        if (i + 1) % 20 == 0:
            print(f"  {i + 1}/{n}")

    converted = [rgba_to_gif_frame(fr) for fr in frames]
    converted[0].save(
        OUT,
        save_all=True,
        append_images=converted[1:],
        duration=durations,
        loop=0,
        disposal=2,
        transparency=255,
        optimize=False,
    )
    print("Saved", OUT, "bytes", os.path.getsize(OUT))
    print("corner", frames[0].getpixel((5, 5)), "blob area", frames[0].getpixel((400, 50)))


if __name__ == "__main__":
    main()
