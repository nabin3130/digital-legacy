"""Render the 1200×630 LOGOUT share image.

Fonts are not vendored. Download Pretendard and IBM Plex Mono, then run:

  python3 scripts/generate-og-image.py

The committed asset is public/og/logout-share.png.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og" / "logout-share.png"
FONT_DIR = Path("/tmp/og-fonts")

WIDTH = 1200
HEIGHT = 630


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONT_DIR / name
    if not path.exists():
        sys.exit(f"Missing {path}. See the module docstring for download URLs.")
    return ImageFont.truetype(str(path), size)


def ellipse(layer: Image.Image, box: tuple[int, int, int, int], color: tuple[int, int, int, int]) -> None:
    ImageDraw.Draw(layer).ellipse(box, fill=color)


def main() -> None:
    base = Image.new("RGBA", (WIDTH, HEIGHT), (244, 245, 239, 255))

    blobs = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ellipse(blobs, (760, -40, 1280, 420), (87, 171, 139, 96))
    ellipse(blobs, (900, 180, 1320, 640), (126, 190, 209, 88))
    ellipse(blobs, (680, 300, 1120, 700), (229, 190, 130, 78))
    ellipse(blobs, (900, 160, 1120, 380), (255, 253, 247, 150))
    base = Image.alpha_composite(base, blobs.filter(ImageFilter.GaussianBlur(42)))

    veil = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(veil).rectangle((0, 0, 760, HEIGHT), fill=(244, 245, 239, 70))
    base = Image.alpha_composite(base, veil.filter(ImageFilter.GaussianBlur(18)))

    draw = ImageDraw.Draw(base)
    draw.rectangle((0, 0, 8, HEIGHT), fill=(31, 90, 73, 255))

    kicker = font("IBMPlexMono-Medium.ttf", 22)
    title = font("Pretendard-SemiBold.otf", 92)
    subtitle = font("Pretendard-Medium.otf", 36)
    body = font("Pretendard-Regular.otf", 26)
    mark = font("IBMPlexMono-Medium.ttf", 22)

    ink = (23, 58, 48, 255)
    green = (31, 90, 73, 255)
    kicker_color = (67, 117, 100, 255)
    muted = (93, 110, 103, 255)
    line = (197, 206, 200, 255)

    x = 80
    draw.text((x, 132), "DIGITAL LEGACY", font=kicker, fill=kicker_color)
    draw.text((x, 178), "로그아웃", font=title, fill=ink)
    draw.text((x, 304), "디지털 유산 안내", font=subtitle, fill=green)
    draw.rectangle((x, 378, x + 72, 380), fill=line)
    draw.text((x, 408), "계정 삭제  ·  데이터 다운로드  ·  추모 계정", font=body, fill=muted)
    draw.text((x, 548), "LOGOUT_", font=mark, fill=green)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
