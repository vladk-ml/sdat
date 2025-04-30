import os
from pathlib import Path
import sqlite3
import json

class ImageOps:
    """Handles image rename and delete operations within a project."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.db_path = self.project_path / "database.sqlite"
        self.raw_dir = self.project_path / "raw"

    def rename_image(self, image_id, new_filename):
        # Update central metadata file
        raw_metadata_path = self.raw_dir / "raw_metadata.json"
        if not raw_metadata_path.exists():
            raise FileNotFoundError("raw_metadata.json not found.")
        with open(raw_metadata_path, "r") as f:
            raw_metadata = json.load(f)
        if image_id not in raw_metadata:
            raise FileNotFoundError(f"Image id {image_id} not found in metadata.")
        # Only update the filename in metadata, do not rename the file on disk
        raw_metadata[image_id]["filename"] = new_filename
        with open(raw_metadata_path, "w") as f:
            json.dump(raw_metadata, f, indent=2)
        # Optionally update the database for consistency
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("UPDATE images SET filename = ? WHERE id = ?", (new_filename, image_id))
            conn.commit()
        return new_filename

    def delete_image(self, image_id):
        with sqlite3.connect(self.db_path) as conn:
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
            row = conn.execute("SELECT filename, original_filename FROM images WHERE id = ?", (image_id,)).fetchone()
            if not row:
                raise FileNotFoundError(f"Image id {image_id} not found.")
            filename, original_filename = row
            file_path = self.raw_dir / filename
            if file_path.exists():
                os.remove(file_path)
            conn.execute("DELETE FROM images WHERE id = ?", (image_id,))
            # Log to history
            conn.execute(
                "INSERT INTO dataset_history (action, filename, original_filename, details) VALUES (?, ?, ?, ?)",
                ("remove", filename, original_filename, json.dumps({}))
            )
            conn.commit()
        return True
