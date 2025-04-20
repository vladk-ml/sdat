import React from "react";

import { useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [importPaths, setImportPaths] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [listStatus, setListStatus] = useState("");
  const [newProjectName, setNewProjectName] = useState("");

  async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:5000/projects/list");
      const data = await res.json();
      if (data.status === "success") {
        setProjects(data.projects);
      }
    } catch (err) {
      setStatus("Failed to fetch projects");
    }
  }

  React.useEffect(() => {
    fetchProjects();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setStatus("Creating project...");
    setProjectPath("");
    try {
      const res = await fetch("http://localhost:5000/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: newProjectName }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus("Project created successfully!");
        setProjectPath(data.project_path);
        setNewProjectName("");
        fetchProjects();
      } else {
        setStatus(data.error || "Error creating project");
      }
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  }

  async function handleSelectFiles(e) {
    e.preventDefault();
    if (!window.seekeraug) {
      setStatus("File dialog not available (not running in Electron).");
      return;
    }
    const paths = await window.seekeraug.selectFiles();
    setImportPaths(paths);
    setStatus(paths.length ? `Selected ${paths.length} files.` : "No files selected.");
  }

  async function handleImportImages(e) {
    e.preventDefault();
    setStatus("Importing images...");
    setImportResult(null);
    if (!selectedProject) {
      setStatus("Please select a project first.");
      return;
    }
    if (!importPaths.length) {
      setStatus("Please select image files to import.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/dataset/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: selectedProject.name,
          image_paths: importPaths
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setStatus("Images imported successfully!");
        setImportResult(data.imported);
      } else {
        setStatus(data.error || "Error importing images");
      }
    } catch (err) {
      setStatus("Failed to connect to backend");
    }
  }

  async function handleListImages() {
    setListStatus("Loading images...");
    setImageList([]);
    if (!selectedProject) {
      setListStatus("Please select a project first.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/dataset/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: selectedProject.name }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setImageList(data.images);
        setListStatus(`Found ${data.images.length} images.`);
      } else {
        setListStatus(data.error || "Error listing images");
      }
    } catch (err) {
      setListStatus("Failed to connect to backend");
    }
  }

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: "#1a2233",
        color: "#fff",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        borderRight: "2px solid #222b3a"
      }}>
        <h2 style={{ marginTop: 0, color: "#7fd1b9" }}>Projects</h2>
        <button
          style={{
            background: "#7fd1b9",
            color: "#1a2233",
            border: "none",
            padding: "8px 12px",
            borderRadius: 4,
            marginBottom: 16,
            fontWeight: "bold"
          }}
          onClick={fetchProjects}
        >
          Refresh
        </button>
        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          {projects.map((proj) => (
            <li key={proj.name} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
              <button
                style={{
                  background: selectedProject && selectedProject.name === proj.name ? "#7fd1b9" : "#24304a",
                  color: selectedProject && selectedProject.name === proj.name ? "#1a2233" : "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 12px",
                  width: "100%",
                  textAlign: "left",
                  fontWeight: selectedProject && selectedProject.name === proj.name ? "bold" : "normal",
                  marginRight: 4
                }}
                onClick={() => {
                  setSelectedProject(proj);
                  setStatus("");
                  setImportResult(null);
                  setImageList([]);
                  setListStatus("");
                }}
              >
                {proj.name}
              </button>
              <button
                title="Rename"
                style={{
                  background: "#f7fafc",
                  color: "#24304a",
                  border: "1px solid #7fd1b9",
                  borderRadius: 4,
                  marginLeft: 2,
                  marginRight: 2,
                  padding: "2px 6px",
                  fontSize: 12,
                  cursor: "pointer"
                }}
                onClick={async () => {
                  const newName = prompt("Rename project:", proj.name);
                  if (newName && newName !== proj.name) {
                    setStatus("Renaming project...");
                    try {
                      const res = await fetch("http://localhost:5000/project/rename", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ old_name: proj.name, new_name: newName })
                      });
                      const data = await res.json();
                      if (data.status === "success") {
                        setStatus("Project renamed.");
                        fetchProjects();
                        if (selectedProject && selectedProject.name === proj.name) {
                          setSelectedProject({ ...proj, name: newName, path: data.new_path });
                        }
                      } else {
                        setStatus(data.error || "Error renaming project");
                      }
                    } catch (err) {
                      setStatus("Failed to connect to backend");
                    }
                  }
                }}
              >✏️</button>
              <button
                title="Delete"
                style={{
                  background: "#f7fafc",
                  color: "#b94a48",
                  border: "1px solid #b94a48",
                  borderRadius: 4,
                  marginLeft: 2,
                  padding: "2px 6px",
                  fontSize: 12,
                  cursor: "pointer"
                }}
                onClick={async () => {
                  if (window.confirm(`Delete project "${proj.name}"? This cannot be undone.`)) {
                    setStatus("Deleting project...");
                    try {
                      const res = await fetch("http://localhost:5000/project/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: proj.name })
                      });
                      const data = await res.json();
                      if (data.status === "success") {
                        setStatus("Project deleted.");
                        fetchProjects();
                        if (selectedProject && selectedProject.name === proj.name) {
                          setSelectedProject(null);
                        }
                      } else {
                        setStatus(data.error || "Error deleting project");
                      }
                    } catch (err) {
                      setStatus("Failed to connect to backend");
                    }
                  }
                }}
              >🗑️</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCreateProject} style={{ marginTop: 16 }}>
          <input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            required
            style={{
              width: "100%",
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
              border: "1px solid #7fd1b9"
            }}
          />
          <button
            type="submit"
            style={{
              background: "#7fd1b9",
              color: "#1a2233",
              border: "none",
              padding: "8px 12px",
              borderRadius: 4,
              width: "100%",
              fontWeight: "bold"
            }}
          >
            Create Project
          </button>
        </form>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, background: "#f7fafc", minHeight: "100vh" }}>
        <h1 style={{ color: "#24304a" }}>SeekerAug</h1>
        <p style={{ color: "#24304a" }}>
          Welcome to the SeekerAug local computer vision development suite.
        </p>
        {selectedProject && (
          <>
            <h2 style={{ color: "#24304a" }}>Project: {selectedProject.name}</h2>
            <p style={{ color: "#24304a" }}>
              Directory: <code>{selectedProject.path}</code>
            </p>
            <form onSubmit={handleImportImages} style={{ marginTop: 32 }}>
              <label>
                Import Images:{" "}
                <button type="button" onClick={handleSelectFiles} style={{ marginRight: 8 }}>
                  Select Images
                </button>
              </label>
              <button type="submit">Import Images</button>
              {importPaths.length > 0 && (
                <ul style={{ marginTop: 8 }}>
                  {importPaths.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </form>
            {importResult && (
              <div style={{ marginTop: 16 }}>
                <strong>Imported Images:</strong>
                <ul>
                  {importResult.map(img => (
                    <li key={img.id}>
                      {img.filename} (from {img.original_path})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ marginTop: 32 }}>
              <button onClick={handleListImages}>List Project Images</button>
              {listStatus && <p style={{ marginTop: 8 }}>{listStatus}</p>}
              {imageList.length > 0 && (
                <ul>
                  {imageList.map(img => (
                    <li key={img.id} style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ flex: 1 }}>
                        {img.filename} (id: {img.id})
                      </span>
                      <button
                        title="Rename"
                        style={{
                          background: "#f7fafc",
                          color: "#24304a",
                          border: "1px solid #7fd1b9",
                          borderRadius: 4,
                          marginLeft: 2,
                          marginRight: 2,
                          padding: "2px 6px",
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                        onClick={async () => {
                          const newFilename = prompt("Rename image file:", img.filename);
                          if (newFilename && newFilename !== img.filename) {
                            setListStatus("Renaming image...");
                            try {
                              const res = await fetch("http://localhost:5000/image/rename", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  project_name: selectedProject.name,
                                  image_id: img.id,
                                  new_filename: newFilename
                                })
                              });
                              const data = await res.json();
                              if (data.status === "success") {
                                setListStatus("Image renamed.");
                                handleListImages();
                              } else {
                                setListStatus(data.error || "Error renaming image");
                              }
                            } catch (err) {
                              setListStatus("Failed to connect to backend");
                            }
                          }
                        }}
                      >✏️</button>
                      <button
                        title="Delete"
                        style={{
                          background: "#f7fafc",
                          color: "#b94a48",
                          border: "1px solid #b94a48",
                          borderRadius: 4,
                          marginLeft: 2,
                          padding: "2px 6px",
                          fontSize: 12,
                          cursor: "pointer"
                        }}
                        onClick={async () => {
                          if (window.confirm(`Delete image "${img.filename}"? This cannot be undone.`)) {
                            setListStatus("Deleting image...");
                            try {
                              const res = await fetch("http://localhost:5000/image/delete", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  project_name: selectedProject.name,
                                  image_id: img.id
                                })
                              });
                              const data = await res.json();
                              if (data.status === "success") {
                                setListStatus("Image deleted.");
                                handleListImages();
                              } else {
                                setListStatus(data.error || "Error deleting image");
                              }
                            } catch (err) {
                              setListStatus("Failed to connect to backend");
                            }
                          }
                        }}
                      >🗑️</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
        {status && <p style={{ marginTop: 16, color: "#b94a48" }}>{status}</p>}
      </div>
    </div>
  );
}

export default App;
