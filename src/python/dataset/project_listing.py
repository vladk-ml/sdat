import json
from pathlib import Path
import datetime

class ProjectListing:
    """Handles listing all SeekerAug projects."""

    def __init__(self, base_dir=None):
        self.base_dir = Path(base_dir or Path.home() / ".seekeraug" / "projects")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def list_projects(self, archived=None, sort_by='last_accessed', sort_desc=True, limit=None):
        """
        Return a list of projects with their config, supporting filtering and sorting.

        Args:
            archived (bool, optional): Filter by archived status. True for archived,
                                       False for active, None for all. Defaults to None.
            sort_by (str): Field to sort by ('name', 'last_accessed', 'created').
                           Defaults to 'last_accessed'.
            sort_desc (bool): Sort in descending order. Defaults to True.
            limit (int, optional): Limit the number of results. Defaults to None.
        """
        projects = []
        default_time = datetime.datetime.min.isoformat() # For sorting if time is missing

        for project_dir in self.base_dir.iterdir():
            if project_dir.is_dir():
                config_path = project_dir / "project.json"
                config = {}
                if config_path.exists():
                    try:
                        with open(config_path, "r") as f:
                            config = json.load(f)
                    except json.JSONDecodeError:
                        # Handle potential corruption or empty file
                        pass # Keep config as empty dict

                # Apply filtering
                is_archived = config.get("is_archived", False)
                if archived is not None and is_archived != archived:
                    continue

                # Prepare project data, handling missing fields
                project_data = {
                    "name": config.get("name", project_dir.name),
                    "path": str(project_dir),
                    "created": config.get("created", default_time),
                    "version": config.get("version", 1),
                    "last_accessed": config.get("last_accessed", config.get("created", default_time)),
                    "is_archived": is_archived
                }
                projects.append(project_data)

        # Apply sorting
        def sort_key(p):
            val = p.get(sort_by)
            # Try parsing as datetime for time-based fields
            if sort_by in ['last_accessed', 'created']:
                try:
                    return datetime.datetime.fromisoformat(val)
                except (ValueError, TypeError):
                    return datetime.datetime.min # Fallback for invalid/missing dates
            return val if val is not None else "" # Fallback for other types

        try:
            projects.sort(key=sort_key, reverse=sort_desc)
        except Exception as e:
            print(f"Error during project sorting: {e}") # Log error but continue

        # Apply limit
        if limit is not None:
            projects = projects[:limit]

        return projects
