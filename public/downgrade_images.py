from PIL import Image

img = Image.open(r"figures\r3d.png")
img.thumbnail((1920, 1920))  # keeps aspect ratio
img.save("r3d.webp", "WEBP", lossless=True)