from PIL import Image
from pathlib import Path

src = Path(r"D:\techCulture\techCultureAiManojSir\techculture-ai-new\public\products-ecosystem-hero.jpg")
dst = Path(r"D:\techCulture\techCultureAiManojSir\techculture-ai-new\public\products-ecosystem-hero.png")

im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

threshold = 28
visited = set()
stack = []

def is_bg(x, y):
    r, g, b, a = pixels[x, y]
    return r <= threshold and g <= threshold and b <= threshold

for x in range(w):
    stack.append((x, 0))
    stack.append((x, h - 1))
for y in range(h):
    stack.append((0, y))
    stack.append((w - 1, y))

while stack:
    x, y = stack.pop()
    if x < 0 or y < 0 or x >= w or y >= h or (x, y) in visited:
        continue
    visited.add((x, y))
    if not is_bg(x, y):
        continue
    pixels[x, y] = (0, 0, 0, 0)
    stack.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

# Remove leftover isolated near-black speckles
for x in range(w):
    for y in range(h):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        if r <= 18 and g <= 18 and b <= 18:
            neighbors = 0
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny][3] > 0:
                    nr, ng, nb, _ = pixels[nx, ny]
                    if nr > 40 or ng > 40 or nb > 40:
                        neighbors += 1
            if neighbors == 0:
                pixels[x, y] = (0, 0, 0, 0)

im.save(dst, "PNG", optimize=True)
print("saved", dst, "bytes", dst.stat().st_size)
for p in [(0, 0), (w - 1, 0), (0, h - 1), (w // 2, h // 2)]:
    print(p, im.getpixel(p))
