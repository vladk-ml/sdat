import React, { useState, useEffect, useRef } from "react";
import CommandPalette from "./CommandPalette.jsx";
import WelcomePage from "./WelcomePage.jsx";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [status, setStatus] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [importPaths, setImportPaths] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [listStatus, setListStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const newProjectInputRef = useRef();

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        setPaletteOpen(true);
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        setFileMenuOpen(f => !f);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleCommand(action, payload) {
    if (action === "createProject") {
      setPaletteOpen(false);
      setShowNewProject(true);
      setTimeout(() => newProjectInputRef.current && newProjectInputRef.current.focus(), 50);
    } else if (action === "importImages") {
      setPaletteOpen(false);
      document.getElementById("import-images-btn")?.click();
    } else if (action === "listImages") {
      setPaletteOpen(false);
      handleListImages();
    } else if (action === "renameProject") {
      setPaletteOpen(false);
      if (selectedProject) {
        const newName = prompt("Rename project:", selectedProject.name);
        if (newName && newName !== selectedProject.name) {
          renameProject(selectedProject, newName);
        }
      }
    } else if (action === "deleteProject") {
      setPaletteOpen(false);
      if (selectedProject) {
        if (window.confirm(`Delete project "${selectedProject.name}"? This cannot be undone.`)) {
          deleteProject(selectedProject);
        }
      }
    } else if (action === "openProject" && payload) {
      setSelectedProject(payload);
      setPaletteOpen(false);
    } else if (action === "closeProject") {
      setSelectedProject(null);
      setPaletteOpen(false);
    }
  }

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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Browser navigation: forward/back for welcome/project
  useEffect(() => {
    function handlePopState(e) {
      // If a project is open, go back to welcome; if not, do nothing
      setSelectedProject(null);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Push history state when opening a project
  useEffect(() => {
    if (selectedProject) {
      window.history.pushState({ project: selectedProject.name }, "", "");
    }
  }, [selectedProject]);

  async function renameProject(proj, newName) {
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

  async function deleteProject(proj) {
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
        setShowNewProject(false);
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
    if (!paths.length) {
      setStatus("No files selected.");
      return;
    }
    // If project is empty, import immediately
    if (imageList.length === 0) {
      setStatus(`Importing ${paths.length} images...`);
      try {
        const res = await fetch("http://localhost:5000/dataset/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_name: selectedProject.name,
            image_paths: paths
          }),
        });
        const data = await res.json();
        if (data.status === "success") {
          setStatus("Images imported successfully!");
          setImportResult(data.imported);
          handleListImages();
        } else {
          setStatus(data.error || "Error importing images");
        }
      } catch (err) {
        setStatus("Failed to connect to backend");
      }
      setImportPaths([]);
    } else {
      setImportPaths(paths);
      setStatus(`Selected ${paths.length} files. Press Import Images to add.`);
    }
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

  // Auto-fetch images when a project is opened
  useEffect(() => {
    if (selectedProject) {
      handleListImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  // --- VS Code-like window/project workflow ---
  if (!selectedProject) {
    return (
      <>
        <WelcomePage
          projects={projects}
          onOpen={proj => {
            setSelectedProject(proj);
            // history state is pushed in useEffect
          }}
          onNew={() => {
            setShowNewProject(true);
            setTimeout(() => newProjectInputRef.current && newProjectInputRef.current.focus(), 50);
          }}
          onDelete={proj => deleteProject(proj)}
        />
        {showNewProject && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(20,22,30,0.7)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setShowNewProject(false)}
          >
            <form
              onSubmit={e => {
                handleCreateProject(e);
                setShowNewProject(false);
              }}
              style={{
                background: "#232837",
                borderRadius: 12,
                boxShadow: "0 8px 32px #000a",
                padding: "36px 32px",
                minWidth: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ color: "#7fd1b9", margin: 0, marginBottom: 18 }}>Create New Project</h2>
              <input
                ref={newProjectInputRef}
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="Project name"
                required
                style={{
                  width: 220,
                  marginBottom: 18,
                  padding: 10,
                  borderRadius: 6,
                  border: "1.5px solid #7fd1b9",
                  fontSize: 18,
                  background: "#181c24",
                  color: "#e0e6ef"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#7fd1b9",
                  color: "#181c24",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 32px",
                  fontWeight: "bold",
                  fontSize: 18,
                  cursor: "pointer"
                }}
              >
                Create
              </button>
            </form>
          </div>
        )}
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onCommand={action => {
            if (action === "createProject") setShowNewProject(true);
            else if (action === "openProject") setPaletteOpen(false);
          }}
        />
      </>
    );
  }

  // Helper: Recursively collect image files from dropped items
  async function getDroppedImagePaths(items) {
    const imageExts = [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff", ".webp"];
    let paths = [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && file.path) {
          // If it's a directory, recursively collect files
          if (file.type === "" && file.path) {
            // Directory: use Node.js fs to walk (only in Electron)
            try {
              // eslint-disable-next-line no-undef
              const fs = window.require ? window.require("fs") : null;
              // eslint-disable-next-line no-undef
              const path = window.require ? window.require("path") : null;
              if (fs && path) {
                function walk(dir) {
                  let results = [];
                  const list = fs.readdirSync(dir);
                  for (const f of list) {
                    const p = path.join(dir, f);
                    const stat = fs.statSync(p);
                    if (stat && stat.isDirectory()) {
                      results = results.concat(walk(p));
                    } else if (imageExts.some(ext => p.toLowerCase().endsWith(ext))) {
                      results.push(p);
                    }
                  }
                  return results;
                }
                paths = paths.concat(walk(file.path));
              }
            } catch (e) {
              // Fallback: skip directory if fs not available
            }
          } else if (imageExts.some(ext => file.path.toLowerCase().endsWith(ext))) {
            paths.push(file.path);
          }
        }
      }
    }
    return paths;
  }

  // --- Project workspace mode ---
  return (
    <div
      style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#232837", position: "relative" }}
      onDragOver={e => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={async e => {
        e.preventDefault();
        setDragActive(false);
        if (!selectedProject) return;
        const items = e.dataTransfer.items;
        const paths = await getDroppedImagePaths(items);
        if (paths.length > 0) {
          setStatus(`Importing ${paths.length} images...`);
          setImportPaths(paths);
          // Trigger import
          try {
            const res = await fetch("http://localhost:5000/dataset/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                project_name: selectedProject.name,
                image_paths: paths
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
        } else {
          setStatus("No image files found in dropped items.");
        }
      }}
    >
      {/* Top bar with File menu */}
      <div style={{
        width: "100%",
        background: "#181c24",
        color: "#e0e6ef",
        height: 48,
        display: "flex",
        alignItems: "center",
        borderBottom: "1.5px solid #232837",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ marginLeft: 32, position: "relative" }}>
          <button
            style={{
              background: "none",
              color: "#e0e6ef",
              border: "none",
              fontSize: 16,
              fontWeight: 500,
              padding: "0 18px",
              height: 48,
              cursor: "pointer"
            }}
            onClick={() => setFileMenuOpen(f => !f)}
            onBlur={() => setTimeout(() => setFileMenuOpen(false), 200)}
          >
            File ▾
          </button>
          {fileMenuOpen && (
            <div style={{
              position: "absolute",
              left: 0,
              top: 48,
              background: "#232837",
              border: "1.5px solid #2e3647",
              borderRadius: 8,
              boxShadow: "0 4px 16px #000a",
              minWidth: 180,
              zIndex: 100
            }}>
              <div
                style={{
                  padding: "12px 18px",
                  cursor: "pointer",
                  color: "#e0e6ef"
                }}
                onClick={() => setShowNewProject(true)}
              >New Project...</div>
              <div
                style={{
                  padding: "12px 18px",
                  cursor: "pointer",
                  color: "#e0e6ef"
                }}
                onClick={() => setSelectedProject(null)}
              >Close Project</div>
              <div
                style={{
                  padding: "12px 18px",
                  cursor: "pointer",
                  color: "#e0e6ef"
                }}
                onClick={() => setPaletteOpen(true)}
              >Open Project...</div>
              <div
                style={{
                  padding: "12px 18px",
                  cursor: "not-allowed",
                  color: "#7fd1b9",
                  opacity: 0.6
                }}
                title="Coming soon"
              >Open New Window</div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 18, color: "#7fd1b9" }}>
          {selectedProject.name}
        </div>
        <div style={{ width: 120 }} />
      </div>
      {/* Drag-and-drop overlay */}
      {dragActive && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,40,60,0.7)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              background: "#232837",
              color: "#7fd1b9",
              border: "2.5px dashed #7fd1b9",
              borderRadius: 16,
              padding: "48px 64px",
              fontSize: 32,
              fontWeight: 700,
              boxShadow: "0 8px 32px #000a",
              pointerEvents: "none"
            }}
          >
            Drop images or folders to import
          </div>
        </div>
      )}
      {/* Project workspace content */}
      <div style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 0",
        minHeight: "calc(100vh - 48px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Main project tools/content go here */}
        <h2 style={{ color: "#7fd1b9", textAlign: "center" }}>Project: {selectedProject.name}</h2>
        <p style={{ color: "#b0bacf", textAlign: "center" }}>
          Directory: <code style={{ color: "#e0e6ef" }}>{selectedProject.path}</code>
        </p>
        <form
          onSubmit={handleImportImages}
          style={{
            margin: "32px auto 0 auto",
            background: "#181c24",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 2px 8px #0002",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <label style={{ color: "#e0e6ef" }}>
            Import Images:{" "}
            <button
              id="import-images-btn"
              type="button"
              onClick={handleSelectFiles}
              style={{
                marginRight: 8,
                background: "#2e3647",
                color: "#7fd1b9",
                border: "1px solid #7fd1b9",
                borderRadius: 4,
                padding: "6px 12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Select Images
            </button>
          </label>
          {importPaths.length > 0 && (
            <>
              <button
                type="submit"
                style={{
                  background: "#7fd1b9",
                  color: "#181c24",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 16px",
                  fontWeight: "bold",
                  marginLeft: 8,
                  cursor: "pointer"
                }}
              >
                Import Images
              </button>
              <ul style={{ marginTop: 8, color: "#b0bacf" }}>
                {importPaths.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </>
          )}
        </form>
        {/* Only show importResult if not empty and not immediately imported */}
        {importResult && importPaths.length > 0 && (
          <div style={{ marginTop: 16, background: "#181c24", padding: 12, borderRadius: 8 }}>
            <strong style={{ color: "#7fd1b9" }}>Imported Images:</strong>
            <ul style={{ color: "#b0bacf" }}>
              {importResult.map(img => (
                <li key={img.id}>
                  {img.filename} (from {img.original_path})
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: 32, background: "#181c24", padding: 16, borderRadius: 8, width: "100%" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <button
              onClick={handleListImages}
              style={{
                background: "#2e3647",
                color: "#7fd1b9",
                border: "1px solid #7fd1b9",
                borderRadius: 4,
                padding: "6px 16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              List Project Images
            </button>
            <button
              onClick={async () => {
                setShowHistory(true);
                setStatus("Fetching dataset history...");
                try {
                  const res = await fetch("http://localhost:5000/dataset/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_name: selectedProject.name })
                  });
                  const data = await res.json();
                  if (data.status === "success") {
                    setHistory(data.history);
                    setStatus("");
                  } else {
                    setStatus(data.error || "Error fetching history");
                  }
                } catch (err) {
                  setStatus("Failed to connect to backend");
                }
              }}
              style={{
                background: "#232837",
                color: "#7fd1b9",
                border: "1px solid #7fd1b9",
                borderRadius: 4,
                padding: "6px 16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              History
            </button>
            <button
              onClick={async () => {
                setStatus("Processing dataset...");
                try {
                  const res = await fetch("http://localhost:5000/dataset/process", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_name: selectedProject.name })
                  });
                  const data = await res.json();
                  if (data.status === "success") {
                    setStatus("Dataset processed. See summary below.");
                    setProcessedMetadata(data.metadata);
                  } else {
                    setStatus(data.error || "Error processing dataset");
                  }
                } catch (err) {
                  setStatus("Failed to connect to backend");
                }
              }}
              style={{
                background: "#7fd1b9",
                color: "#181c24",
                border: "none",
                borderRadius: 4,
                padding: "6px 16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Process Dataset
            </button>
          </div>
          {listStatus && <p style={{ marginTop: 8, color: "#b0bacf" }}>{listStatus}</p>}
          {processedMetadata && (
            <div style={{ marginTop: 16, background: "#232837", borderRadius: 8, padding: 16 }}>
              <h3 style={{ color: "#7fd1b9", marginTop: 0 }}>Processed Dataset Summary</h3>
              <div style={{ maxHeight: 320, overflowY: "auto", fontSize: 13 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "#b0bacf", borderBottom: "1px solid #2e3647" }}>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Processed File</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Original</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Size</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Dimensions</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Format</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>TIFF Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(processedMetadata).map(([fname, meta]) => (
                      <tr key={fname} style={{ borderBottom: "1px solid #232837" }}>
                        <td style={{ color: "#e0e6ef", padding: "4px 8px" }}>{fname}</td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>{meta.original_filename || ""}</td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>
                          {meta.size_bytes ? `${(meta.size_bytes / 1024).toFixed(1)} KB` : "—"}
                        </td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>
                          {meta.width && meta.height ? `${meta.width}×${meta.height}` : "—"}
                        </td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>
                          {meta.format || "—"}
                        </td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px", maxWidth: 200, overflow: "auto" }}>
                          {meta.tiff_tags
                            ? <pre style={{ color: "#7fd1b9", fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>
                                {JSON.stringify(meta.tiff_tags, null, 1)}
                              </pre>
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {showHistory && (
            <div style={{ marginTop: 16, background: "#232837", borderRadius: 8, padding: 16, width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ color: "#7fd1b9", margin: 0 }}>Dataset History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  style={{
                    background: "none",
                    color: "#b0bacf",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer"
                  }}
                  title="Close"
                >✕</button>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto", fontSize: 13, marginTop: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "#b0bacf", borderBottom: "1px solid #2e3647" }}>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Time</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Action</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Original Name</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Filename</th>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h.id} style={{ borderBottom: "1px solid #232837" }}>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>
                          {h.timestamp ? new Date(h.timestamp).toLocaleString() : ""}
                        </td>
                        <td style={{
                          color: h.action === "add" ? "#7fd1b9" : "#b94a48",
                          padding: "4px 8px",
                          fontWeight: 600
                        }}>
                          {h.action === "add" ? "Added" : "Removed"}
                        </td>
                        <td style={{ color: "#e0e6ef", padding: "4px 8px" }}>{h.original_filename}</td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px" }}>{h.filename}</td>
                        <td style={{ color: "#b0bacf", padding: "4px 8px", maxWidth: 200, overflow: "auto" }}>
                          <pre style={{ color: "#7fd1b9", fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>
                            {h.details}
                          </pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {imageList.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
                width: "100%",
                marginTop: 16
              }}
            >
              {imageList.map(img => (
                <div
                  key={img.id}
                  style={{
                    background: "#232837",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px #0002",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    transition: "box-shadow 0.2s",
                    border: "1.5px solid #2e3647"
                  }}
                >
                  <div
                    style={{
                      width: 180,
                      height: 120,
                      background: "#181c24",
                      borderRadius: 6,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 1px 4px #0004"
                    }}
                  >
                    <img
                      src={`file://${img.path}`}
                      alt={img.filename}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: 4,
                        background: "#232837"
                      }}
                      onError={e => (e.target.style.display = "none")}
                    />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      color: "#e0e6ef",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 2,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    title={img.original_filename || img.filename}
                  >
                    {img.original_filename || img.filename}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      color: "#b0bacf",
                      fontSize: 12,
                      marginBottom: 2,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    title={img.filename}
                  >
                    <span style={{ fontStyle: "italic" }}>{img.filename}</span>
                  </div>
                  <div style={{ width: "100%", color: "#b0bacf", fontSize: 13, marginBottom: 2, textAlign: "center" }}>
                    {img.width && img.height ? `${img.width}×${img.height}px` : "—"}
                  </div>
                  <div style={{ width: "100%", color: "#b0bacf", fontSize: 13, marginBottom: 2, textAlign: "center" }}>
                    {img.size ? `${(img.size / 1024).toFixed(1)} KB` : "—"}
                  </div>
                  <div style={{ width: "100%", color: "#7fd1b9", fontSize: 12, marginBottom: 6, textAlign: "center" }}>
                    {img.added ? new Date(img.added).toLocaleString() : ""}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    <button
                      title="Rename"
                      style={{
                        background: "#232837",
                        color: "#7fd1b9",
                        border: "1px solid #7fd1b9",
                        borderRadius: 4,
                        padding: "2px 10px",
                        fontSize: 14,
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
                    >✏️ Rename</button>
                    <button
                      title="Delete"
                      style={{
                        background: "#232837",
                        color: "#b94a48",
                        border: "1px solid #b94a48",
                        borderRadius: 4,
                        padding: "2px 10px",
                        fontSize: 14,
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
                    >🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {status && <p style={{ marginTop: 16, color: "#ffb4b4", textAlign: "center" }}>{status}</p>}
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onCommand={handleCommand}
      />
    </div>
  );
}

export default App;
