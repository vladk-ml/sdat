import os
from pathlib import Path
from PIL import Image, TiffImagePlugin
import json

class DatasetProcessor:
    """Processes raw dataset: converts images to JPG, extracts metadata, saves to processed/."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.raw_dir = self.project_path / "raw"
        self.processed_dir = self.project_path / "processed"
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        self.metadata_path = self.processed_dir / "metadata.json"

    def process(self):
        """Convert all images in raw/ to JPG in processed/, extract metadata."""
        metadata = {}
        for file in self.raw_dir.iterdir():
            if not file.is_file():
                continue
            ext = file.suffix.lower()
            orig_name = file.name
            try:
                with Image.open(file) as img:
                    # Convert to RGB for JPG
                    if img.mode != "RGB":
                        img = img.convert("RGB")
                    # Save as JPG in processed/
                    jpg_name = f"{file.stem}.jpg"
                    jpg_path = self.processed_dir / jpg_name
                    img.save(jpg_path, "JPEG", quality=95)
                    # Extract metadata
                    meta = {
                        "original_filename": orig_name,
                        "processed_filename": jpg_name,
                        "width": img.width,
                        "height": img.height,
                        "format": img.format,
                        "mode": img.mode,
                        "size_bytes": file.stat().st_size,
                    }
                    # TIFF-specific: extract tags (e.g., scale, georeferencing)
                    if ext in [".tif", ".tiff"]:
                        tiff_tags = {}
                        for tag, value in img.tag_v2.items():
                            tag_name = TiffImagePlugin.TAGS_V2.get(tag, tag)
                            tiff_tags[str(tag_name)] = value
                        meta["tiff_tags"] = tiff_tags
                    metadata[jpg_name] = meta
            except Exception as e:
                metadata[orig_name] = {"error": str(e)}
        # Save metadata
        with open(self.metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)

        # Create per-image annotation/metadata files
        import uuid
        from datetime import datetime

        for jpg_name, meta in metadata.items():
            if "error" in meta:
                continue
            annotation = {
                "image_id": str(uuid.uuid4()),
                "filename": jpg_name,
                "dimensions": [meta.get("width"), meta.get("height")],
                "geotags": meta.get("tiff_tags", {}),
                "ingested_at": datetime.utcnow().isoformat() + "Z",
                "parent_raw_id": None,  # TODO: link to raw image UUID if available
                "parent_raw_filename": meta.get("original_filename"),
                "annotations": [],
                "history": [
                    {
                        "action": "ingested",
                        "by": "system",
                        "at": datetime.utcnow().isoformat() + "Z"
                    }
                ]
            }
            annotation_path = self.processed_dir / f"{Path(jpg_name).stem}.json"
            with open(annotation_path, "w") as af:
                json.dump(annotation, af, indent=2)

        return metadata
