import sqlite3
from pathlib import Path

class DatasetListing:
    """Handles listing images in a SeekerAug project."""

    def __init__(self, project_path):
        self.project_path = Path(project_path)
        self.db_path = self.project_path / "database.sqlite"

    def list_images(self):
        """Return a list of images in the project."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("SELECT id, filename FROM images")
            images = [{"id": row[0], "filename": row[1]} for row in cursor.fetchall()]
        return images
