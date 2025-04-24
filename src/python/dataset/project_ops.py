import os
import json
from pathlib import Path
import shutil
import datetime
import subprocess
import sys

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

    def _read_config(self, project_path):
        """Helper to read project config."""
        config_path = project_path / "project.json"
        if not config_path.exists():
            return None
        try:
            with open(config_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            # Handle potential corruption or empty file
            return None

    def _write_config(self, project_path, config):
        """Helper to write project config."""
        config_path = project_path / "project.json"
        with open(config_path, "w") as f:
            json.dump(config, f, indent=2)

    def update_last_accessed(self, name):
        """Update the last_accessed timestamp for a project."""
        project_path = self.base_dir / name
        if not project_path.exists():
            raise FileNotFoundError(f"Project '{name}' does not exist.")
        config = self._read_config(project_path)
        if config is None:
            # If config doesn't exist or is invalid, create a basic one
            config = {"name": name, "path": str(project_path)}
        config["last_accessed"] = datetime.datetime.now().isoformat()
        self._write_config(project_path, config)
        return config["last_accessed"]

    def set_archived_status(self, name, is_archived):
        """Set the archived status for a project."""
        project_path = self.base_dir / name
        if not project_path.exists():
            raise FileNotFoundError(f"Project '{name}' does not exist.")
        config = self._read_config(project_path)
        if config is None:
            config = {"name": name, "path": str(project_path)}
        config["is_archived"] = bool(is_archived)
        # Ensure last_accessed exists if archiving/restoring
        if "last_accessed" not in config:
             config["last_accessed"] = datetime.datetime.now().isoformat()
        self._write_config(project_path, config)
        return config["is_archived"]

    def open_project_location(self, name):
        """Open the project directory in the system file explorer."""
        project_path = self.base_dir / name
        if not project_path.exists():
            raise FileNotFoundError(f"Project '{name}' does not exist.")

        try:
            if sys.platform == "win32":
                os.startfile(project_path)
            elif sys.platform == "darwin": # macOS
                subprocess.Popen(["open", project_path])
            else: # Linux and other Unix-like
                subprocess.Popen(["xdg-open", project_path])
            return True
        except Exception as e:
            # Log the error or handle it as needed
            print(f"Error opening project location: {e}")
            raise RuntimeError(f"Could not open project location: {e}")
