import json
from pathlib import Path

class ProjectListing:
    """Handles listing all SeekerAug projects."""

    def __init__(self, base_dir=None):
        self.base_dir = Path(base_dir or Path.home() / ".seekeraug" / "projects")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def list_projects(self):
        """Return a list of all projects with their config."""
        projects = []
        for project_dir in self.base_dir.iterdir():
            if project_dir.is_dir():
                config_path = project_dir / "project.json"
                if config_path.exists():
                    with open(config_path, "r") as f:
                        config = json.load(f)
                    projects.append({
                        "name": config.get("name", project_dir.name),
                        "path": str(project_dir),
                        "created": config.get("created"),
                        "version": config.get("version", 1)
                    })
                else:
                    projects.append({
                        "name": project_dir.name,
                        "path": str(project_dir),
                        "created": None,
                        "version": 1
                    })
        return projects
