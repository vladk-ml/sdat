import sqlite3
from pathlib import Path
import os

class DatasetListing:
    """Handles listing images in a SeekerAug project."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.db_path = self.project_path / "database.sqlite"
        self.raw_dir = self.project_path / "raw"

    def list_images(self):
        """Return a list of images in the project, with metadata."""
        images = []
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("SELECT id, filename, original_filename, added FROM images")
            for row in cursor.fetchall():
                image_id, filename, original_filename, added = row
                file_path = self.raw_dir / filename
                size = None
                width = None
                height = None
                if file_path.exists():
                    size = file_path.stat().st_size
                    try:
                        from PIL import Image
                        with Image.open(file_path) as img:
                            width, height = img.size
                    except Exception:
                        width, height = None, None
                images.append({
                    "id": image_id,
                    "filename": filename,
                    "original_filename": original_filename,
                    "path": str(file_path),
                    "size": size,
                    "width": width,
                    "height": height,
                    "added": added
                })
        return images
