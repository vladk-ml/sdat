from flask import Flask, request, jsonify
import os

from dataset.project_manager import ProjectManager

app = Flask(__name__)
project_manager = ProjectManager()

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

@app.route("/project/create", methods=["POST"])
def create_project():
    data = request.json
    project_name = data.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.create_project(project_name)
        return jsonify({"status": "success", "project_path": project_path})
    except FileExistsError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from dataset.importer import DatasetImporter
from werkzeug.utils import secure_filename

@app.route("/dataset/import", methods=["POST"])
def import_dataset():
    # Accept multipart/form-data: project_name (str), files[] (file list)
    if 'project_name' not in request.form:
        return jsonify({"error": "Missing project_name"}), 400
    project_name = request.form['project_name']
    files = request.files.getlist('files[]')
    if not files:
        return jsonify({"error": "No files uploaded"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        # Save uploaded files to temp paths
        temp_paths = []
        for file in files:
            filename = secure_filename(file.filename)
            temp_path = project_path / "_import_temp_" / filename
            temp_path.parent.mkdir(parents=True, exist_ok=True)
            file.save(str(temp_path))
            temp_paths.append(str(temp_path))
        # Import images using DatasetImporter
        importer = DatasetImporter(project_path)
        imported = importer.import_images(temp_paths)
        # Clean up temp files
        for p in temp_paths:
            try:
                os.remove(p)
            except Exception:
                pass
        return jsonify({"status": "success", "imported": imported})
    except Exception as e:
        import traceback
        print("Error in /dataset/import:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

from dataset.listing import DatasetListing

@app.route("/dataset/list", methods=["POST"])
def list_images():
    data = request.json
    project_name = data.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        listing = DatasetListing(project_path)
        images = listing.list_images()
        return jsonify({"status": "success", "images": images})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from dataset.project_listing import ProjectListing
from dataset.project_ops import ProjectOps # Moved import up

project_ops = ProjectOps() # Instantiate ProjectOps

@app.route("/projects/list", methods=["GET"])
def list_projects():
    try:
        # Extract query parameters with defaults
        archived_param = request.args.get('archived')
        limit = request.args.get('limit', type=int)
        sort_by = request.args.get('sort_by', 'last_accessed')
        sort_desc_param = request.args.get('sort_desc', 'true').lower()

        # Convert archived param to boolean or None
        archived = None
        if archived_param == 'true':
            archived = True
        elif archived_param == 'false':
            archived = False

        # Convert sort_desc param to boolean
        sort_desc = sort_desc_param == 'true'

        projects = ProjectListing().list_projects(
            archived=archived,
            limit=limit,
            sort_by=sort_by,
            sort_desc=sort_desc
        )
        return jsonify({"status": "success", "projects": projects})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Removed duplicate import of ProjectOps below

@app.route("/project/rename", methods=["POST"])
def rename_project():
    data = request.json
    old_name = data.get("old_name")
    new_name = data.get("new_name")
    if not old_name or not new_name:
        return jsonify({"error": "Missing old_name or new_name"}), 400
    try:
        new_path = ProjectOps().rename_project(old_name, new_name)
        return jsonify({"status": "success", "new_path": new_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/project/delete", methods=["POST"]) # Changed to DELETE method, using URL param
def delete_project():
    data = request.json # Keep JSON body for potential future needs, but name is from URL
    name = data.get("name") # Keep for compatibility if frontend sends it
    # name_from_url = request.view_args.get('name') # Correct way if using <name> in route
    # project_name = name_from_url or name # Prioritize URL param

    if not name: # Check the name from JSON body for now
        return jsonify({"error": "Missing project name"}), 400
    try:
        project_ops.delete_project(name) # Use instantiated project_ops
        return jsonify({"status": "success"})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- New Project Operations Endpoints ---

@app.route("/project/<name>/accessed", methods=["PUT"])
def mark_project_accessed(name):
    """Updates the last_accessed timestamp for a project."""
    try:
        timestamp = project_ops.update_last_accessed(name)
        return jsonify({"status": "success", "last_accessed": timestamp})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/project/<name>/archive", methods=["PUT"])
def archive_project(name):
    """Marks a project as archived."""
    try:
        project_ops.set_archived_status(name, is_archived=True)
        return jsonify({"status": "success", "is_archived": True})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/project/<name>/restore", methods=["PUT"])
def restore_project(name):
    """Marks a project as not archived (restores it)."""
    try:
        project_ops.set_archived_status(name, is_archived=False)
        return jsonify({"status": "success", "is_archived": False})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/project/<name>/open_location", methods=["POST"])
def open_project_location(name):
    """Opens the project's directory in the system file explorer."""
    try:
        project_ops.open_project_location(name)
        return jsonify({"status": "success"})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e: # Catch specific error from open_project_location
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- End New Project Operations Endpoints ---


from dataset.image_ops import ImageOps

@app.route("/image/rename", methods=["POST"])
def rename_image():
    data = request.json
    project_name = data.get("project_name")
    image_id = data.get("image_id")
    new_filename = data.get("new_filename")
    if not project_name or not image_id or not new_filename:
        return jsonify({"error": "Missing project_name, image_id, or new_filename"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        new_path = ImageOps(project_path).rename_image(image_id, new_filename)
        return jsonify({"status": "success", "new_path": new_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/image/delete", methods=["POST"])
def delete_image():
    data = request.json
    project_name = data.get("project_name")
    image_id = data.get("image_id")
    if not project_name or not image_id:
        return jsonify({"error": "Missing project_name or image_id"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        ImageOps(project_path).delete_image(image_id)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from dataset.processor import DatasetProcessor

@app.route("/dataset/intake", methods=["POST"])
def intake_to_refined():
    data = request.json
    project_name = data.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        processor = DatasetProcessor(project_path)
        metadata = processor.process()
        return jsonify({"status": "success", "metadata": metadata})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dataset/process", methods=["POST"])
def process_dataset():
    data = request.json
    project_name = data.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        processor = DatasetProcessor(project_path)
        metadata = processor.process()
        return jsonify({"status": "success", "metadata": metadata})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dataset/history", methods=["POST"])
def dataset_history():
    data = request.json
    project_name = data.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        db_path = project_path / "database.sqlite"
        if not db_path.exists():
            return jsonify({"error": "Project database does not exist"}), 404
        import sqlite3
        with sqlite3.connect(db_path) as conn:
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
            rows = conn.execute("SELECT id, timestamp, action, filename, original_filename, details FROM dataset_history ORDER BY id DESC").fetchall()
            history = [
                {
                    "id": row[0],
                    "timestamp": row[1],
                    "action": row[2],
                    "filename": row[3],
                    "original_filename": row[4],
                    "details": row[5]
                }
                for row in rows
            ]
        return jsonify({"status": "success", "history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import json
from pathlib import Path

@app.route("/annotation", methods=["GET"])
def get_annotation():
    project_name = request.args.get("project_name")
    image_filename = request.args.get("image_filename")
    if not project_name or not image_filename:
        return jsonify({"error": "Missing project_name or image_filename"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        processed_dir = project_path / "processed"
        annotation_path = processed_dir / f"{Path(image_filename).stem}.json"
        if not annotation_path.exists():
            return jsonify({"error": "Annotation file not found"}), 404
        with open(annotation_path, "r") as f:
            annotation = json.load(f)
        return jsonify({"status": "success", "annotation": annotation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/annotation", methods=["POST"])
def save_annotation():
    data = request.json
    project_name = data.get("project_name")
    image_filename = data.get("image_filename")
    annotation = data.get("annotation")
    if not project_name or not image_filename or not annotation:
        return jsonify({"error": "Missing project_name, image_filename, or annotation"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        processed_dir = project_path / "processed"
        annotation_path = processed_dir / f"{Path(image_filename).stem}.json"
        with open(annotation_path, "w") as f:
            json.dump(annotation, f, indent=2)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/raw/metadata", methods=["GET"])
def get_raw_metadata():
    project_name = request.args.get("project_name")
    if not project_name:
        return jsonify({"error": "Missing project_name"}), 400
    try:
        project_path = project_manager.base_dir / project_name
        raw_dir = project_path / "raw"
        metadata_path = raw_dir / "raw_metadata.json"
        if not metadata_path.exists():
            return jsonify({"status": "success", "metadata": {}})
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
        return jsonify({"status": "success", "metadata": metadata})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=True)
