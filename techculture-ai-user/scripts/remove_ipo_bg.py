from PIL import Image
from collections import deque

src = r"D:\techCulture\techCultureAiManojSir\techculture-ai-new\public\online-ipo-bidding-hero.jpg"
out = r"D:\techCulture\techCultureAiManojSir\techculture-ai-new\public\online-ipo-bidding-hero.png"

img = Image.open(src).convert("RGBA")
w, h = img.size
px = img.load()

threshold = 32
visited = bytearray(w * h)
q = deque()

def is_bg(x, y):
    r, g, b, a = px[x, y]
    return r <= threshold and g <= threshold and b <= threshold

def idx(x, y):
    return y * w + x

for x in range(w):
    if is_bg(x, 0):
        q.append((x, 0))
    if is_bg(x, h - 1):
        q.append((x, h - 1))
for y in range(h):
    if is_bg(0, y):
        q.append((0, y))
    if is_bg(w - 1, y):
        q.append((w - 1, y))

dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
while q:
    x, y = q.popleft()
    i = idx(x, y)
    if visited[i]:
        continue
    if not is_bg(x, y):
        continue
    visited[i] = 1
    px[x, y] = (0, 0, 0, 0)
    for dx, dy in dirs:
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[idx(nx, ny)]:
            q.append((nx, ny))

# Clear near-black fringe next to transparent pixels
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if r <= 45 and g <= 45 and b <= 45:
            near = False
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                    near = True
                    break
            if near:
                px[x, y] = (0, 0, 0, 0)

img.save(out, "PNG")
print("saved", out, img.size)
