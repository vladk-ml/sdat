import os
import json
from pathlib import Path
import shutil

class ProjectOps:
    """Handles project rename and delete operations."""

    def __init__(self, base_dir=None):
        self.base_dir = Path(base_dir or Path.home() / ".seekeraug" / "projects")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def rename_project(self, old_name, new_name):
        old_path = self.base_dir / old_name
        new_path = self.base_dir / new_name
        if not old_path.exists():
            raise FileNotFoundError(f"Project '{old_name}' does not exist.")
        if new_path.exists():
            raise FileExistsError(f"Project '{new_name}' already exists.")
        os.rename(old_path, new_path)
        # Update project.json
        config_path = new_path / "project.json"
        if config_path.exists():
            with open(config_path, "r") as f:
                config = json.load(f)
            config["name"] = new_name
            with open(config_path, "w") as f:
                json.dump(config, f, indent=2)
        return str(new_path)

    def delete_project(self, name):
        path = self.base_dir / name
        if not path.exists():
            raise FileNotFoundError(f"Project '{name}' does not exist.")
        shutil.rmtree(path)
        return True
