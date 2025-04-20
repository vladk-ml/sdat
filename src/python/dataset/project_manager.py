import os
from pathlib import Path
import sqlite3
import json

class ProjectManager:
    """Handles creation and management of SeekerAug projects."""

    def __init__(self, base_dir=None):
        # Default to ~/.seekeraug/projects
        self.base_dir = Path(base_dir or Path.home() / ".seekeraug" / "projects")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def create_project(self, project_name):
        """Create a new project directory and initialize structure."""
        project_path = self.base_dir / project_name
        if project_path.exists():
            raise FileExistsError(f"Project '{project_name}' already exists.")

        # Create directory structure
        (project_path / "raw").mkdir(parents=True)
        (project_path / "annotations").mkdir(parents=True)
        (project_path / "versions").mkdir(parents=True)
        (project_path / "temp").mkdir(parents=True)

        # Initialize SQLite database
        db_path = project_path / "database.sqlite"
        conn = sqlite3.connect(db_path)
        self._init_db(conn)
        conn.close()

        # Create project config
        config = {
            "name": project_name,
            "path": str(project_path),
            "created": str(Path().cwd()),
            "version": 1
        }
        with open(project_path / "project.json", "w") as f:
            json.dump(config, f, indent=2)

        return str(project_path)

    def _init_db(self, conn):
        """Initialize the SQLite database schema."""
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS images (
            id TEXT PRIMARY KEY,
            filename TEXT,
            added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS annotations (
            id TEXT PRIMARY KEY,
            image_id TEXT,
            data TEXT,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(image_id) REFERENCES images(id)
        );
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        conn.commit()
