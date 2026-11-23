
from pathlib import Path
from PIL import Image

image_dir = Path(__file__).parent / "assets" / "images"

images = [
    {
        "source": "Noel-tree.png",
        "quality": 90
    },
    {
        "source": "gallery1.png",
        "quality": 84
    },
    {
        "source": "gallery2.png",
        "quality": 84
    },
    {
        "source": "gallery3.png",
        "quality": 84
    },
    {
        "source": "gallery4.png",
        "quality": 84
    }
]

def convert_image(source_name, quality):
    source_path = image_dir / source_name
    output_path = source_path.with_suffix(".webp")

    if not source_path.exists():
        print(f"[ERROR] File not found: {source_name}")
        return

    try:
        with Image.open(source_path) as image:
            has_alpha = "A" in image.getbands()

            image.save(
                output_path,
                "WEBP",
                quality=quality,
                method=6
            )

        with Image.open(output_path) as converted:
            original_size = source_path.stat().st_size
            converted_size = output_path.stat().st_size

            reduction = (1 - converted_size / original_size) * 100

            print(f"\n[OK] {source_name}")
            print(f"Output: {output_path.name}")
            print(f"Original: {original_size / 1024:.2f} KB")
            print(f"WebP: {converted_size / 1024:.2f} KB")
            print(f"Reduction: {reduction:.2f}%")
            print(f"Dimensions: {converted.size}")
            print(f"Transparency: {'Yes' if 'A' in converted.getbands() else 'No'}")

            if has_alpha and "A" not in converted.getbands():
                print("[WARNING] Transparency was not preserved!")

    except Exception as error:
        print(f"[ERROR] {source_name}: {error}")

def main():
    for image in images:
        convert_image(image["source"], image["quality"])

    print("\nImage conversion completed.")

if __name__ == "__main__":
    main()
