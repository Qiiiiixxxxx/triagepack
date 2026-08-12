"""Render the README demo GIF and launch screenshots from real CLI copy."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

WIDTH, HEIGHT = 1200, 675
BG = "#07111f"
PANEL = "#0d1b2a"
TEXT = "#e6edf3"
MUTED = "#8b9bb4"
GREEN = "#20c997"
CORAL = "#ff6b6b"
BLUE = "#62a8ff"


def font(size, bold=False):
    candidates = [
        Path("C:/Windows/Fonts/CascadiaMono.ttf"),
        Path("C:/Windows/Fonts/consola.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


TITLE = font(38, True)
MONO = font(25)
SMALL = font(19)


def base(step, label):
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((55, 50, WIDTH - 55, HEIGHT - 50), 22, fill=PANEL, outline="#1f3650", width=2)
    draw.ellipse((84, 78, 102, 96), fill=CORAL)
    draw.ellipse((112, 78, 130, 96), fill="#ffd166")
    draw.ellipse((140, 78, 158, 96), fill=GREEN)
    draw.text((190, 68), "TriagePack", font=TITLE, fill=TEXT)
    draw.text((WIDTH - 230, 78), f"{step}/4  {label}", font=SMALL, fill=MUTED)
    draw.line((80, 125, WIDTH - 80, 125), fill="#1f3650", width=2)
    return image, draw


def terminal_lines(draw, lines):
    y = 165
    for prefix, value, color in lines:
        if prefix:
            draw.text((92, y), prefix, font=MONO, fill=GREEN)
            x = 92 + draw.textlength(prefix, font=MONO)
        else:
            x = 92
        draw.text((x, y), value, font=MONO, fill=color)
        y += 43


frames = []

image, draw = base(1, "Install")
terminal_lines(draw, [
    ("$ ", "npx triagepack init", TEXT),
    ("", "Created ./triagepack.config.json", GREEN),
    ("", "One versioned recipe for every bug report.", MUTED),
])
frames.append(image)

image, draw = base(2, "Review")
terminal_lines(draw, [
    ("$ ", "npx triagepack collect", TEXT),
    ("", "This trusted configuration requests:", BLUE),
    ("", "  • node --version", TEXT),
    ("", "  • git --version", TEXT),
    ("", "Continue? [y/N] y", GREEN),
])
frames.append(image)

image, draw = base(3, "Collect")
terminal_lines(draw, [
    ("", "What happened?  Login command exits early", TEXT),
    ("", "Steps to reproduce  Run acme login", TEXT),
    ("", "Expected  Browser authentication opens", TEXT),
    ("", "PASS  Wrote triagepack-report.md", GREEN),
])
frames.append(image)

image, draw = base(4, "Redact")
terminal_lines(draw, [
    ("", "Platform: win32 / x64", TEXT),
    ("", "Node.js: v24.19.0", TEXT),
    ("", "token=[REDACTED_GITHUB_TOKEN]", CORAL),
    ("", "home=[HOME]", CORAL),
    ("", "PASS  Report passed safety checks", GREEN),
])
draw.text((92, 555), "Local only • no account • no telemetry • no upload", font=SMALL, fill=MUTED)
frames.append(image)

durations = [1500, 1900, 1900, 2600]
frames[0].save(
    ASSETS / "demo.gif",
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
)
frames[-1].save(ASSETS / "demo-result.png", optimize=True)
frames[1].save(ASSETS / "demo-review.png", optimize=True)

print(ASSETS / "demo.gif")
