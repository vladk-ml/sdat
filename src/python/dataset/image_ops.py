import os
from pathlib import Path
import sqlite3

class ImageOps:
    """Handles image rename and delete operations within a project."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.db_path = self.project_path / "database.sqlite"
        self.raw_dir = self.project_path / "raw"

    def rename_image(self, image_id, new_filename):
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute("SELECT filename FROM images WHERE id = ?", (image_id,)).fetchone()
            if not row:
                raise FileNotFoundError(f"Image id {image_id} not found.")
            old_filename = row[0]
            old_path = self.raw_dir / old_filename
            new_path = self.raw_dir / new_filename
            if not old_path.exists():
                raise FileNotFoundError(f"File {old_filename} not found.")
            if new_path.exists():
                raise FileExistsError(f"File {new_filename} already exists.")
            os.rename(old_path, new_path)
            conn.execute("UPDATE images SET filename = ? WHERE id = ?", (new_filename, image_id))
            conn.commit()
        return str(new_path)

    def delete_image(self, image_id):
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute("SELECT filename FROM images WHERE id = ?", (image_id,)).fetchone()
            if not row:
                raise FileNotFoundError(f"Image id {image_id} not found.")
            filename = row[0]
            file_path = self.raw_dir / filename
            if file_path.exists():
                os.remove(file_path)
            conn.execute("DELETE FROM images WHERE id = ?", (image_id,))
            conn.commit()
        return True
