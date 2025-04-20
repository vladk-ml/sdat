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

@app.route("/dataset/import", methods=["POST"])
def import_dataset():
    data = request.json
    project_name = data.get("project_name")
    image_paths = data.get("image_paths")
    if not project_name or not image_paths:
        return jsonify({"error": "Missing project_name or image_paths"}), 400
    try:
        # Resolve project path
        project_path = project_manager.base_dir / project_name
        if not project_path.exists():
            return jsonify({"error": "Project does not exist"}), 404
        importer = DatasetImporter(project_path)
        imported = importer.import_images(image_paths)
        return jsonify({"status": "success", "imported": imported})
    except Exception as e:
        import traceback
        print("Error in /dataset/import:", e)
        print("Received image_paths:", image_paths)
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

@app.route("/projects/list", methods=["GET"])
def list_projects():
    try:
        projects = ProjectListing().list_projects()
        return jsonify({"status": "success", "projects": projects})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from dataset.project_ops import ProjectOps

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

@app.route("/project/delete", methods=["POST"])
def delete_project():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Missing name"}), 400
    try:
        ProjectOps().delete_project(name)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=True)
