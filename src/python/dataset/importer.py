import os
import shutil
import uuid
from pathlib import Path
import sqlite3
import json

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
        raw_metadata_path = self.raw_dir / "raw_metadata.json"
        # Load or initialize metadata
        if raw_metadata_path.exists():
            with open(raw_metadata_path, "r") as f:
                raw_metadata = json.load(f)
        else:
            raw_metadata = {}

        with sqlite3.connect(self.db_path) as conn:
            # Add original_filename column if not present
            try:
                conn.execute("ALTER TABLE images ADD COLUMN original_filename TEXT")
            except Exception:
                pass  # Already exists
            # Add dataset_history table if not present
            conn.execute("""
                CREATE TABLE IF NOT EXISTS dataset_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    action TEXT,
                    filename TEXT,
                    original_filename TEXT,
                    details TEXT
                )
            """)
            for src_path in image_paths:
                ext = os.path.splitext(src_path)[1]
                image_id = str(uuid.uuid4())
                original_filename = os.path.basename(src_path)
                # Ensure unique filename in raw directory
                dest_filename = original_filename
                dest_path = self.raw_dir / dest_filename
                counter = 1
                while dest_path.exists():
                    name, ext = os.path.splitext(original_filename)
                    dest_filename = f"{name}_{counter}{ext}"
                    dest_path = self.raw_dir / dest_filename
                    counter += 1
                shutil.copy2(src_path, dest_path)
                # Register in database
                conn.execute(
                    "INSERT INTO images (id, filename, original_filename) VALUES (?, ?, ?)",
                    (image_id, dest_filename, original_filename)
                )
                # Log to history
                conn.execute(
                    "INSERT INTO dataset_history (action, filename, original_filename, details) VALUES (?, ?, ?, ?)",
                    ("add", dest_filename, original_filename, json.dumps({"src_path": src_path}))
                )
                # Update central metadata file
                raw_metadata[image_id] = {
                    "id": image_id,
                    "filename": dest_filename,
                    "original_filename": original_filename,
                    "imported_at": str(Path(dest_path).stat().st_mtime),
                    "original_path": src_path
                }
                imported.append({
                    "id": image_id,
                    "filename": dest_filename,
                    "original_filename": original_filename,
                    "original_path": src_path
                })
            conn.commit()
        # Save updated metadata
        with open(raw_metadata_path, "w") as f:
            json.dump(raw_metadata, f, indent=2)
        return imported
