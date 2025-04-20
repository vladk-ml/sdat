import os
import shutil
import uuid
from pathlib import Path
import sqlite3

class DatasetImporter:
    """Handles importing images into a SeekerAug project."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.db_path = self.project_path / "database.sqlite"
        self.raw_dir = self.project_path / "raw"
        self.raw_dir.mkdir(parents=True, exist_ok=True)

    def import_images(self, image_paths):
        """Import a list of image file paths into the project."""
        imported = []
        with sqlite3.connect(self.db_path) as conn:
            for src_path in image_paths:
                ext = os.path.splitext(src_path)[1]
                image_id = str(uuid.uuid4())
                dest_filename = f"{image_id}{ext}"
                dest_path = self.raw_dir / dest_filename
                shutil.copy2(src_path, dest_path)
                # Register in database
                conn.execute(
                    "INSERT INTO images (id, filename) VALUES (?, ?)",
                    (image_id, dest_filename)
                )
                imported.append({
                    "id": image_id,
                    "filename": dest_filename,
                    "original_path": src_path
                })
            conn.commit()
        return imported
