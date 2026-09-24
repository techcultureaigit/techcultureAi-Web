from PIL import Image
from collections import deque

src = r"d:\techCulture\techCultureAiManojSir\techculture-ai-new\public\digital-kyc-hero.jpg"
out = r"d:\techCulture\techCultureAiManojSir\techculture-ai-new\public\digital-kyc-hero.png"

img = Image.open(src).convert("RGBA")
w, h = img.size
pixels = img.load()

def is_bg(x, y):
    r, g, b, a = pixels[x, y]
    # near-black only
    return r <= 28 and g <= 28 and b <= 28

visited = [[False] * w for _ in range(h)]
q = deque()

# Seed from all edge pixels that look like background
for x in range(w):
    for y in (0, h - 1):
        if is_bg(x, y):
            q.append((x, y))
            visited[y][x] = True
for y in range(h):
    for x in (0, w - 1):
        if not visited[y][x] and is_bg(x, y):
            q.append((x, y))
            visited[y][x] = True

# Flood fill connected background
while q:
    x, y = q.popleft()
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_bg(nx, ny):
            visited[ny][nx] = True
            q.append((nx, ny))

# Soften edge: also clear near-bg neighbors of filled bg for cleaner fringe
mask = [[visited[y][x] for x in range(w)] for y in range(h)]

for y in range(h):
    for x in range(w):
        if mask[y][x]:
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)
        else:
            # slight soft edge if adjacent to bg
            near = False
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h and mask[ny][nx]:
                    near = True
                    break
            if near:
                r, g, b, a = pixels[x, y]
                luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
                if luma < 40:
                    pixels[x, y] = (r, g, b, max(0, min(a, int(luma / 40 * 255))))

img.save(out, "PNG", optimize=True)

# sanity
print("corner", img.getpixel((0, 0)))
print("center-ish", img.getpixel((w // 2, h // 2)))
print("saved", out, img.size)
