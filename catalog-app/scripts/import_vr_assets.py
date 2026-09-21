"""Download licensed Autohome VR assets into the local public directory.

Example:
    python scripts/import_vr_assets.py --spec 77944 --exterior-id 7045
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_VR = ROOT / "public" / "vr"
FACE_NAMES = {
    "r": "right",
    "l": "left",
    "u": "up",
    "d": "down",
    "f": "front",
    "b": "back",
}
INTERIOR_SCENES = (
    ("driver", 47307),
    ("rear", 47308),
    ("trunk", 47309),
)


def download(url: str, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "curl.exe",
            "-fsSL",
            "--retry",
            "3",
            "-A",
            "Mozilla/5.0",
            "-e",
            "https://pano.autohome.com.cn/",
            url,
            "-o",
            str(target),
        ],
        check=True,
    )


def import_exterior(exterior_id: int, output: Path) -> int:
    with tempfile.TemporaryDirectory() as temp_dir:
        metadata_path = Path(temp_dir) / "exterior.json"
        download(
            f"https://pano.autohome.com.cn/api/ext/baseinfo/{exterior_id}"
            "?src=m&category=car&cityId=110100",
            metadata_path,
        )
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))

    frames = metadata["color_info"][0]["Hori"]["Normal"]
    output.mkdir(parents=True, exist_ok=True)
    for frame in frames:
        source_path = frame["Url"].replace("1200x0_", "1000x0_")
        url = f"https://g.autoimg.cn/@img/panovr/pano/{source_path}"
        download(url, output / f"{frame['Seq']:02d}.png")

    return len(frames)


def save_face(image: Image.Image, target: Path, *, flip: bool) -> None:
    # Stitched krpano tiles face inward; WebVR cube files already match Three.js.
    if flip:
        image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, quality=90, optimize=True)


def import_interior_face_from_vr(alias: str, scene: int, face_code: str, target: Path) -> bool:
    with tempfile.TemporaryDirectory() as temp_dir:
        source = Path(temp_dir) / f"pano_{face_code}.jpg"
        try:
            download(
                f"https://panovr.autoimg.cn/pano/pub/na/{alias}/{scene}/vr/pano_{face_code}.jpg",
                source,
            )
        except subprocess.CalledProcessError:
            return False
        save_face(Image.open(source).convert("RGB"), target, flip=False)
    return True


def import_interior_face_from_tiles(alias: str, scene: int, face_code: str, target: Path) -> None:
    with tempfile.TemporaryDirectory() as temp_dir:
        tiles_dir = Path(temp_dir)
        tiles: list[list[Image.Image]] = []
        for row in range(1, 4):
            row_tiles: list[Image.Image] = []
            for column in range(1, 4):
                tile_path = tiles_dir / f"l2_{face_code}_{row:02d}_{column:02d}.jpg"
                download(
                    f"https://panovr.autoimg.cn/pano/pub/na/{alias}/{scene}/"
                    f"{face_code}/l2/{row:02d}/l2_{face_code}_{row:02d}_{column:02d}.jpg",
                    tile_path,
                )
                row_tiles.append(Image.open(tile_path).convert("RGB"))
            tiles.append(row_tiles)

        column_widths = [
            max(tiles[row][column].width for row in range(3)) for column in range(3)
        ]
        row_heights = [max(tile.height for tile in row_tiles) for row_tiles in tiles]
        face = Image.new("RGB", (sum(column_widths), sum(row_heights)))
        for row, row_tiles in enumerate(tiles):
            for column, tile in enumerate(row_tiles):
                face.paste(
                    tile,
                    (sum(column_widths[:column]), sum(row_heights[:row])),
                )
        save_face(face, target, flip=True)


def import_interior_scene(alias: str, scene: int, output: Path) -> None:
    for face_code, face_name in FACE_NAMES.items():
        target = output / f"{face_name}.jpg"
        if not import_interior_face_from_vr(alias, scene, face_code, target):
            import_interior_face_from_tiles(alias, scene, face_code, target)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", type=int, required=True)
    parser.add_argument("--exterior-id", type=int, required=True)
    parser.add_argument("--interior-alias", default="nb2n")
    parser.add_argument("--skip-exterior", action="store_true")
    parser.add_argument("--replace", action="store_true")
    args = parser.parse_args()

    model_dir = PUBLIC_VR / str(args.spec)
    if args.replace and model_dir.exists():
        shutil.rmtree(model_dir)

    frame_count = 0
    if not args.skip_exterior:
        frame_count = import_exterior(args.exterior_id, model_dir / "exterior")

    for scene_name, scene_id in INTERIOR_SCENES:
        import_interior_scene(
            args.interior_alias,
            scene_id,
            model_dir / "interior" / scene_name,
        )

    driver_dir = model_dir / "interior" / "driver"
    fallback_dir = model_dir / "interior"
    if driver_dir.exists():
        for face in FACE_NAMES.values():
            source = driver_dir / f"{face}.jpg"
            if source.exists():
                shutil.copyfile(source, fallback_dir / f"{face}.jpg")

    print(
        f"Imported {frame_count or 'existing'} exterior frames and "
        f"{len(INTERIOR_SCENES)} interior scenes into {model_dir}"
    )


if __name__ == "__main__":
    main()
