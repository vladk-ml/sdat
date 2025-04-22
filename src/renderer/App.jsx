import React, { useState, useEffect, useRef } from "react";
import CommandPalette from "./CommandPalette.jsx";
import WelcomePage from "./WelcomePage.jsx";

// Placeholder components for panes/tabs
function ExplorerPane({ visible, datasetCounts = {}, onOpenDataset, onOpenDir, onExport }) {
  if (!visible) return null;
  const datasetTypes = [
    { key: "raw", label: "Raw", color: "#7fd1b9" },
    { key: "refined", label: "Refined", color: "#b9a87f" },
    { key: "annotated", label: "Annotated", color: "#b97fa8" },
    { key: "augmented", label: "Augmented", color: "#7f9bd1" }
  ];
  return (
    <div style={{
      width: 220,
      background: "#181c24",
      borderRight: "1.5px solid #232837",
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
      zIndex: 2
    }}>
      <div style={{
        color: "#7fd1b9",
        fontWeight: 700,
        fontSize: 16,
        padding: "18px 0 12px 24px",
        borderBottom: "1px solid #232837"
      }}>
        Datasets
      </div>
      <div style={{ color: "#b0bacf", padding: "16px 0" }}>
        {datasetTypes.map(ds => (
          <div
            key={ds.key}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              cursor: "pointer",
              borderLeft: `4px solid ${ds.color}`,
              marginBottom: 6,
              background: "none",
              borderRadius: 6,
              transition: "background 0.15s"
            }}
            onClick={() => onOpenDataset && onOpenDataset(ds.key)}
            title={`Open ${ds.label} dataset`}
          >
            <span style={{ flex: 1, fontWeight: 600, color: ds.color }}>{ds.label}</span>
            <span style={{
              background: ds.color,
              color: "#181c24",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              minWidth: 28,
              textAlign: "center",
              padding: "2px 8px",
              marginLeft: 8
            }}>
              {datasetCounts[ds.key] !== undefined ? datasetCounts[ds.key] : "—"}
            </span>
            <button
              style={{
                marginLeft: 8,
                background: "none",
                border: "none",
                color: "#b0bacf",
                cursor: "pointer",
                fontSize: 16
              }}
              title="Open in File Explorer"
              onClick={e => { e.stopPropagation(); onOpenDir && onOpenDir(ds.key); }}
            >📂</button>
            <button
              style={{
                marginLeft: 2,
                background: "none",
                border: "none",
                color: "#b0bacf",
                cursor: "pointer",
                fontSize: 16
              }}
              title="Export Dataset"
              onClick={e => { e.stopPropagation(); onExport && onExport(ds.key); }}
            >⬇️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabbedWorkspace({ selectedProject }) {
  // Minimal dashboard for now
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      background: "#232837",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        height: 38,
        background: "#181c24",
        borderBottom: "1.5px solid #232837",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        color: "#b0bacf",
        fontWeight: 500
      }}>
        <span style={{ color: "#7fd1b9" }}>Project Dashboard</span>
      </div>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b0bacf",
        fontSize: 20,
        flexDirection: "column"
      }}>
        <div style={{ fontSize: 28, color: "#7fd1b9", fontWeight: 700, marginBottom: 12 }}>
          {selectedProject?.name}
        </div>
        <div>
          Welcome to your project workspace!<br />
          Use the explorer to open a dataset, or open the Command Palette (Ctrl+Shift+P).
        </div>
      </div>
    </div>
  );
}

function ContextPanel({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div style={{
      width: 320,
      background: "#181c24",
      borderLeft: "1.5px solid #232837",
      minHeight: "0",
      zIndex: 2,
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        color: "#7fd1b9",
        fontWeight: 700,
        fontSize: 16,
        padding: "18px 0 12px 24px",
        borderBottom: "1px solid #232837",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        Context Panel
        <button
          style={{
            background: "none",
            color: "#b0bacf",
            border: "none",
            fontSize: 18,
            cursor: "pointer"
          }}
          onClick={onClose}
          title="Close"
        >✕</button>
      </div>
      <div style={{ color: "#b0bacf", padding: "16px 24px" }}>
        {/* TODO: Show context-sensitive properties/tools */}
        <span>[Context Panel Placeholder]</span>
      </div>
    </div>
  );
}

function StatusBar({ status }) {
  return (
    <div style={{
      width: "100%",
      height: 28,
      background: "#181c24",
      color: "#b0bacf",
      borderTop: "1.5px solid #232837",
      display: "flex",
      alignItems: "center",
      fontSize: 13,
      paddingLeft: 18,
      zIndex: 10
    }}>
      <span>{status || "Ready"}</span>
      {/* TODO: Add project info, operation status, notifications, GPU status, quick settings */}
    </div>
  );
}

function CommandBar({ onOpenPalette }) {
  return (
    <div style={{
      width: "100%",
      height: 48,
      background: "#181c24",
      color: "#e0e6ef",
      display: "flex",
      alignItems: "center",
      borderBottom: "1.5px solid #232837",
      position: "relative",
      zIndex: 10
    }}>
      <div style={{ marginLeft: 32, fontWeight: 700, fontSize: 18, color: "#7fd1b9" }}>
        SeekerAug
      </div>
      {/* Centered Command Palette button */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 11
      }}>
        <button
          style={{
            background: "#232837",
            color: "#7fd1b9",
            border: "1px solid #7fd1b9",
            borderRadius: 4,
            padding: "6px 18px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
          onClick={onOpenPalette}
          title="Open Command Palette (Ctrl+Shift+P)"
        >
          Command Palette
        </button>
      </div>
    </div>
  );
}

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [status, setStatus] = useState("");
  const [contextPanelOpen, setContextPanelOpen] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
        setPaletteOpen(true);
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        setContextPanelOpen(f => !f);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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

  // --- VS Code-like window/project workflow ---
  if (!selectedProject) {
    return (
      <>
        <WelcomePage
          projects={projects}
          onOpen={proj => setSelectedProject(proj)}
          onNew={() => setShowNewProject(true)}
          onDelete={proj => {/* TODO: Implement project deletion */}}
        />
        {/* New Project Modal */}
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
              onSubmit={async e => {
                e.preventDefault();
                setStatus("Creating project...");
                try {
                  const res = await fetch("http://localhost:5000/project/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_name: e.target.elements.projectName.value }),
                  });
                  const data = await res.json();
                  if (data.status === "success") {
                    setStatus("Project created successfully!");
                    setShowNewProject(false);
                    fetchProjects();
                  } else {
                    setStatus(data.error || "Error creating project");
                  }
                } catch (err) {
                  setStatus("Failed to connect to backend");
                }
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
                name="projectName"
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
          onCommand={() => setPaletteOpen(false)}
        />
      </>
    );
  }

  // --- Main application window structure ---
  return (
    <div style={{
      fontFamily: "sans-serif",
      minHeight: "100vh",
      background: "#232837",
      display: "flex",
      flexDirection: "column"
    }}>
      <CommandBar onOpenPalette={() => setPaletteOpen(true)} />
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        minWidth: 0
      }}>
        <ExplorerPane visible={true} />
        <TabbedWorkspace />
        <ContextPanel visible={contextPanelOpen} onClose={() => setContextPanelOpen(false)} />
      </div>
      <StatusBar status={status} />
      {/* Centered Command Palette overlay */}
      {paletteOpen && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(20,22,30,0.25)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onCommand={() => setPaletteOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
