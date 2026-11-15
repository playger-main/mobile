"""Генерация ассетов иконки PlayG из assets/playg-icon.png.

1. assets/images/playg-pin.png        — белый пин на прозрачном (1024), для сплэша
2. assets/images/android-icon-foreground.png — пин в безопасной зоне (512), для adaptive
3. assets/images/favicon.png          — 48x48 иконка для web
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).name == "gen_icon_assets.py" else Path.cwd()
ASSETS = ROOT / "assets"
IMAGES = ASSETS / "images"

src = Image.open(ASSETS / "playg-icon.png").convert("RGB")
w, h = src.size

# --- 1. белый пин на прозрачном фоне -------------------------------------
pin = Image.new("RGBA", src.size, (255, 255, 255, 0))
src_px = src.load()
pin_px = pin.load()

# фон — синий градиент (мин. канал низкий), пин — белый (все каналы ~255).
# альфа = «насколько пиксель белый», с плавным краем для антиалиасинга.
LOW, HIGH = 150, 235

for y in range(h):
    for x in range(w):
        r, g, b = src_px[x, y]
        m = min(r, g, b)
        if m <= LOW:
            continue
        alpha = int(round((min(m, HIGH) - LOW) / (HIGH - LOW) * 255))
        pin_px[x, y] = (255, 255, 255, alpha)

bbox = pin.getbbox()
pin = pin.crop(bbox)
print("пин обрезан до", pin.size)

pin.save(IMAGES / "playg-pin.png")

# --- 2. adaptive foreground: пин в безопасной зоне 512x512 ----------------
FG = 512
SAFE = 0.62  # safe zone adaptive-иконки
fg = Image.new("RGBA", (FG, FG), (255, 255, 255, 0))
ratio = min(FG * SAFE / pin.width, FG * SAFE / pin.height)
pin_fg = pin.resize(
    (int(pin.width * ratio), int(pin.height * ratio)), Image.LANCZOS
)
fg.paste(pin_fg, ((FG - pin_fg.width) // 2, (FG - pin_fg.height) // 2), pin_fg)
fg.save(IMAGES / "android-icon-foreground.png")

# --- 3. favicon 48x48 ------------------------------------------------------
fav = src.resize((48, 48), Image.LANCZOS)
fav.save(IMAGES / "favicon.png")

print("готово:", (IMAGES / "playg-pin.png").stat().st_size,
      (IMAGES / "android-icon-foreground.png").stat().st_size,
      (IMAGES / "favicon.png").stat().st_size)
