import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage.jsx";
import ProjectDashboard from "./ProjectDashboard.jsx";
import { loadAndApplyTheme } from "./themeLoader.js";
import { listProjects, createProject, deleteProject, importProjectImages, listProjectImages } from "./projectApi";

function CommandBar({ onOpenPalette, onCloseProject, showClose }) {
  return (
    <div className="command-bar" style={{
      height: 48,
      background: "var(--background-primary)",
      color: "var(--accent-primary)",
      display: "flex",
      alignItems: "center",
      paddingLeft: 32,
      fontWeight: 700,
      fontSize: 18,
      borderBottom: "1px solid var(--border-color)"
    }}>
      SeekerAug
      <div style={{ marginLeft: "auto", marginRight: 32, display: "flex", gap: 12 }}>
        <button className="button" onClick={onOpenPalette} title="Command Palette (Ctrl+Shift+P)">
          <span className="button-icon">⌨️</span> Command Palette
        </button>
        {showClose && (
          <button className="button" onClick={onCloseProject} title="Close Project">
            <span className="button-icon">⏏️</span> Close Project
          </button>
        )}
      </div>
    </div>
  );
}

function Sidebar({ width }) {
  return (
    <div className="sidebar" style={{
      width,
      background: "var(--background-secondary)",
      borderRight: "1px solid var(--border-color)",
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="sidebar-header" style={{
        textTransform: "uppercase",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--foreground-secondary)",
        padding: "6px 12px",
        marginBottom: 4,
        letterSpacing: 0.5
      }}>
        Datasets
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* TODO: Dataset tree, actions, badges */}
        <div className="sidebar-item" style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
          cursor: "pointer"
        }}>
          <span className="sidebar-item-icon" style={{ marginRight: 8, color: "var(--raw-dataset-color)" }}>📁</span>
          Raw Dataset
        </div>
        {/* More dataset types... */}
      </div>
    </div>
  );
}

function TabBar({ tabs, activeTab, onSelectTab, onCloseTab }) {
  return (
    <div className="tabs-container" style={{
      display: "flex",
      background: "var(--background-primary)",
      borderBottom: "1px solid var(--border-color)",
      height: 35,
      userSelect: "none"
    }}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab${tab.id === activeTab ? " active" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderRight: "1px solid var(--border-color)",
            background: tab.id === activeTab ? "var(--background-primary)" : "var(--background-tertiary)",
            color: tab.id === activeTab ? "var(--foreground-primary)" : "var(--foreground-secondary)",
            height: "100%",
            cursor: "pointer",
            minWidth: 100,
            maxWidth: 200
          }}
          onClick={() => onSelectTab(tab.id)}
        >
          <span className="tab-title" style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1
          }}>{tab.title}</span>
          <button
            className="tab-close"
            style={{
              marginLeft: 8,
              opacity: 0.6,
              borderRadius: 4,
              padding: 2,
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
            title="Close Tab"
          >✕</button>
        </div>
      ))}
    </div>
  );
}

function Workspace({ activeTab }) {
  return (
    <div className="workspace" style={{
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      background: "var(--background-primary)",
      color: "var(--foreground-primary)",
      display: "flex",
      flexDirection: "column"
    }}>
      <TabBar
        tabs={activeTab ? [{ id: activeTab, title: "Sample Tab" }] : []}
        activeTab={activeTab}
        onSelectTab={() => {}}
        onCloseTab={() => {}}
      />
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--foreground-secondary)",
        fontSize: 20
      }}>
        {activeTab ? "[Workspace Content]" : "[Workspace Empty]"}
      </div>
    </div>
  );
}

function ContextPanel({ width }) {
  return (
    <div className="context-panel" style={{
      width,
      background: "var(--background-secondary)",
      borderLeft: "1px solid var(--border-color)",
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="context-header" style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "18px 0 12px 24px",
        borderBottom: "1px solid var(--border-color)",
        color: "var(--foreground-primary)",
        textTransform: "uppercase"
      }}>
        Context Panel
      </div>
      <div style={{ color: "var(--foreground-secondary)", padding: "16px 24px" }}>
        [Context Panel Placeholder]
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="status-bar" style={{
      width: "100%",
      height: 22,
      background: "var(--accent-primary)",
      color: "white",
      display: "flex",
      alignItems: "center",
      fontSize: 12,
      paddingLeft: 18,
      userSelect: "none"
    }}>
      <span>Ready</span>
      <div style={{ flex: 1 }} />
      <span style={{
        background: "#2C5D93",
        padding: "2px 6px",
        borderRadius: 3,
        marginRight: 12
      }}>GPU: Active</span>
      <button className="button" style={{
        background: "var(--background-tertiary)",
        color: "var(--foreground-primary)",
        border: "none",
        borderRadius: 2,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer"
      }}>⚙️</button>
    </div>
  );
}

function App() {
  useEffect(() => {
    loadAndApplyTheme("dark");
  }, []);

  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [contextWidth, setContextWidth] = useState(280);
  const [activeTab, setActiveTab] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectImages, setProjectImages] = useState({}); // { [projectName]: [images] }
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createName, setCreateName] = useState("");

  // Load projects from backend on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const list = await listProjects();
        setProjects(list);
      } catch (err) {
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  // Project creation modal logic
  function openCreateModal() {
    setCreateName("");
    setCreateError("");
    setShowCreateModal(true);
  }
  function closeCreateModal() {
    setShowCreateModal(false);
    setCreateError("");
    setCreateName("");
    setCreateLoading(false);
  }
  async function handleCreateProject() {
    setCreateError("");
    const name = createName.trim();
    // Validation: non-empty, unique, no illegal chars
    if (!name) {
      setCreateError("Project name cannot be empty.");
      return;
    }
    if (projects.some(p => p.name === name)) {
      setCreateError("A project with this name already exists.");
      return;
    }
    if (!/^[\w\- ]+$/.test(name)) {
      setCreateError("Project name can only contain letters, numbers, spaces, dashes, and underscores.");
      return;
    }
    setCreateLoading(true);
    try {
      const proj = await createProject(name);
      const list = await listProjects();
      setProjects(list);
      setCurrentProject(proj);
      setShowWelcome(false);
      closeCreateModal();
    } catch (err) {
      setCreateError(err.message || "Failed to create project.");
      setCreateLoading(false);
    }
  }
  // Legacy handler for compatibility (used by WelcomePage)
  function handleNewProject() {
    openCreateModal();
  }
  function handleOpenProject(proj) {
    setCurrentProject(proj);
    setShowWelcome(false);
  }
  async function handleDeleteProject(proj) {
    try {
      await deleteProject(proj.name);
      const list = await listProjects();
      setProjects(list);
      if (currentProject && currentProject.name === proj.name) {
        setCurrentProject(null);
        setShowWelcome(true);
      }
      setProjectImages(prev => {
        const copy = { ...prev };
        delete copy[proj.name];
        return copy;
      });
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  }
  function handleCloseProject() {
    setCurrentProject(null);
    setShowWelcome(true);
  }

  // Image import logic (now persistent)
  async function handleImportImages(files) {
    if (!currentProject) return;
    setLoading(true);
    setError(null);
    try {
      await importProjectImages(currentProject.name, files);
      // After upload, fetch the updated image list
      const result = await listProjectImages(currentProject.name);
      setProjectImages(prev => ({
        ...prev,
        [currentProject.name]: result.images || []
      }));
    } catch (err) {
      setError(err.message || "Failed to import images");
    } finally {
      setLoading(false);
    }
  }

  // Project creation modal component
  function ProjectCreateModal() {
    if (!showCreateModal) return null;
    return (
      <div style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
        background: "var(--background-primary)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          background: "var(--background-secondary)",
          borderRadius: 10,
          boxShadow: "0 8px 32px #000a",
          minWidth: 340,
          maxWidth: 420,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch"
        }}>
          <h2 style={{
            color: "var(--accent-primary)",
            fontWeight: 700,
            fontSize: 22,
            margin: 0,
            marginBottom: 18
          }}>Create New Project</h2>
          <label style={{
            fontSize: 14,
            color: "var(--foreground-primary)",
            marginBottom: 6,
            fontWeight: 500
          }}>Project Name</label>
          <input
            type="text"
            value={createName}
            autoFocus
            maxLength={48}
            onChange={e => { setCreateName(e.target.value); setCreateError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleCreateProject(); }}
            style={{
              fontSize: 16,
              padding: "10px 12px",
              borderRadius: 5,
              border: "1.5px solid var(--border-color)",
              marginBottom: 10,
              outline: "none",
              background: "var(--background-primary)",
              color: "var(--foreground-primary)"
            }}
            placeholder="e.g. My Vision Project"
            disabled={createLoading}
          />
          {createError && (
            <div style={{
              color: "#b94a48",
              background: "#ffeded",
              borderRadius: 4,
              padding: "6px 10px",
              fontSize: 13,
              marginBottom: 8
            }}>{createError}</div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              className="button primary"
              style={{
                background: "var(--accent-primary)",
                color: "white",
                border: "none",
                borderRadius: 5,
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: 15,
                cursor: createLoading ? "not-allowed" : "pointer",
                opacity: createLoading ? 0.7 : 1
              }}
              onClick={handleCreateProject}
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create"}
            </button>
            <button
              className="button"
              style={{
                background: "var(--background-tertiary)",
                color: "var(--foreground-primary)",
                border: "1.5px solid var(--border-color)",
                borderRadius: 5,
                padding: "10px 24px",
                fontWeight: 500,
                fontSize: 15,
                cursor: createLoading ? "not-allowed" : "pointer"
              }}
              onClick={closeCreateModal}
              disabled={createLoading}
            >Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <>
        <WelcomePage
          projects={projects}
          onOpen={handleOpenProject}
          onNew={handleNewProject}
          onDelete={handleDeleteProject}
        />
        <ProjectCreateModal />
      </>
    );
  }

  // Show project dashboard after project selection
  if (currentProject) {
    return (
      <div className="app" style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
        background: "var(--background-primary)",
        display: "flex",
        flexDirection: "column"
      }}>
        <CommandBar
          onOpenPalette={() => {}}
          onCloseProject={handleCloseProject}
          showClose={true}
        />
        <ProjectDashboard
          project={currentProject}
          images={projectImages[currentProject.name] || []}
          onImportImages={handleImportImages}
        />
        <StatusBar />
      </div>
    );
  }

  // Fallback (should not happen)
  return null;
}

export default App;
