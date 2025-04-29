import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage.jsx";
import ProjectDashboard from "./ProjectDashboard.jsx";
import ImageGrid from "./ImageGrid.jsx";
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

// Modified Sidebar to accept onToggleMinimize prop
function Sidebar({ width, onToggleMinimize, onOpenGridTab }) {
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
        color: "var(--foreground-primary)", // Keep outer div primary
        padding: "6px 12px",
        marginBottom: 4,
        letterSpacing: 0.5,
        display: "flex", // Added for icon positioning
        justifyContent: "space-between", // Added for icon positioning
        alignItems: "center" // Added for icon positioning
      }}>
        <span className="sidebar-header-text">Datasets</span> {/* Apply class */}
        {/* Replaced button with span for icon */}
        <span
          onClick={onToggleMinimize}
          className="sidebar-collapse-icon" // Apply class
          title="Collapse Explorer"
          style={{
            // Remove inline color, rely on class
            cursor: "pointer",
            padding: "0 6px",
            fontSize: "20px",
            lineHeight: 1,
            userSelect: "none" // Prevent text selection on click
          }}
        >
          ‹{/* Left-pointing chevron */}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* TODO: Dataset tree, actions, badges */}
        <div className="sidebar-item" style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
          cursor: "pointer",
          color: "var(--foreground-primary)" // Added theme color for text
        }}
        onClick={onOpenGridTab}
        >
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
              cursor: "pointer",
              color: "var(--foreground-primary)" // Use theme variable for visibility
            }}
            onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
            title="Close Tab"
          >✕</button>
        </div>
      ))}
    </div>
  );
}

// Updated Workspace component - Added projectImages and handleImportImages to props
function Workspace({
  openTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  currentProject,
  projectImages,
  handleImportImages,
  handleRenameImage,
  handleDeleteImages
}) {
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

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
        tabs={openTabs}
        activeTab={activeTabId}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
      />
      {/* Render content based on active tab */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start"
      }}>
        {activeTab ? (
          activeTab.type === 'dashboard' ? (
            // Only show dashboard content, NOT image grid
            <ProjectDashboard
              project={currentProject}
              images={[]} // No images in dashboard
              onImportImages={handleImportImages}
            />
          ) : activeTab.type === 'grid' ? (
            <ImageGrid
              images={projectImages[currentProject?.name] || []}
              onRename={handleRenameImage}
              onDelete={handleDeleteImages}
              project={currentProject}
              onImportImages={handleImportImages}
            />
          ) : (
            <div style={{ padding: 20 }}>
              Content for Tab: {activeTab.title} (Type: {activeTab.type || 'unknown'})
            </div>
          )
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground-secondary)", fontSize: 20 }}>
            [Workspace Empty]
          </div>
        )}
      </div>
    </div>
  );
}

// Modified ContextPanel to accept onToggleMinimize prop
function ContextPanel({ width, onToggleMinimize }) {
  return (
    <div className="context-panel" style={{
      width,
      background: "var(--background-secondary)",
      borderLeft: "1px solid var(--border-color)",
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      color: "var(--foreground-primary)" // Ensure all children inherit theme color
    }}>
      <div className="context-header" style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "18px 0 12px 24px",
        borderBottom: "1px solid var(--border-color)",
        color: "var(--foreground-primary)",
        textTransform: "uppercase",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ color: "var(--foreground-primary)" }}>Context Panel</span>
        <span
          onClick={onToggleMinimize}
          title="Collapse Context Panel"
          style={{
            color: "var(--foreground-secondary)",
            cursor: "pointer",
            padding: "0 6px",
            fontSize: "20px",
            lineHeight: 1,
            userSelect: "none"
          }}
        >
          ›
        </span>
      </div>
      {/* Apply color to parent div AND directly to placeholder via inline style with !important */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
         <div className="context-placeholder-text">
            [Context Panel Placeholder]
         </div>
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

import { renameProjectImage, deleteProjectImage } from "./projectApi"; // Add these to projectApi.js

function App() {
  // Removed useEffect for theme loading, now done in index.jsx

  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [contextWidth, setContextWidth] = useState(280);
  const [openTabs, setOpenTabs] = useState([]); // Array of { id: string, title: string, type: string, ... }
  const [activeTabId, setActiveTabId] = useState(null); // ID of the active tab
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectImages, setProjectImages] = useState({}); // { [projectName]: [images] }
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createName, setCreateName] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for general operations
  const [error, setError] = useState(null); // Added error state for general operations

  // State for resizing panes
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingContext, setIsResizingContext] = useState(false);

  // --- Resizing Logic ---
  const MIN_PANE_WIDTH = 150; // Minimum width for side panes
  const MAX_PANE_WIDTH = 500; // Maximum width
  const MINIMIZE_THRESHOLD = 50; // Width below which pane minimizes

  const handleMouseDownSidebar = (e) => {
    e.preventDefault(); // Prevent text selection during drag
    setIsResizingSidebar(true);
  };

  const handleMouseDownContext = (e) => {
    e.preventDefault();
    setIsResizingContext(true);
  };

  const handleMouseUp = () => {
    setIsResizingSidebar(false);
    setIsResizingContext(false);
  };

  const handleMouseMove = (e) => {
    if (isResizingSidebar) {
      const newWidth = e.clientX;
      if (newWidth < MINIMIZE_THRESHOLD) {
        setIsExplorerMinimized(true); // Minimize if dragged too small
      } else {
        setIsExplorerMinimized(false); // Ensure it's shown if dragged larger
        setSidebarWidth(Math.max(MIN_PANE_WIDTH, Math.min(newWidth, MAX_PANE_WIDTH)));
      }
    } else if (isResizingContext) {
      const newWidth = window.innerWidth - e.clientX;
       if (newWidth < MINIMIZE_THRESHOLD) {
        setIsContextMinimized(true); // Minimize if dragged too small
      } else {
        setIsContextMinimized(false); // Ensure it's shown if dragged larger
        setContextWidth(Math.max(MIN_PANE_WIDTH, Math.min(newWidth, MAX_PANE_WIDTH)));
      }
    }
  };

  // Add global listeners when resizing starts
  useEffect(() => {
    if (isResizingSidebar || isResizingContext) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingContext]); // Re-run when resizing state changes
  // --- End Resizing Logic ---


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
  // Updated handleOpenProject to fetch images first
  async function handleOpenProject(proj) {
    setCurrentProject(proj);
    setShowWelcome(false);

    // Fetch images for the project before opening the tab
    try {
      const result = await listProjectImages(proj.name);
      setProjectImages(prev => ({
        ...prev,
        [proj.name]: result.images || []
      }));
    } catch (err) {
      console.error("Failed to fetch project images:", err);
      setProjectImages(prev => ({
        ...prev,
        [proj.name]: [] // Set empty array on error
      }));
    }

    // Do not open any tab by default; workspace will be empty
    setOpenTabs([]);
    setActiveTabId(null);
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
    // Close all tabs when closing the project
    setOpenTabs([]);
    setActiveTabId(null);
  }

  // --- Tab Management ---
  function handleOpenGridTab() {
    if (!currentProject) return;
    handleOpenTab({
      id: `grid-${currentProject.name}`,
      title: `${currentProject.name} Images`,
      type: 'grid'
    });
  }

  function handleSelectTab(tabId) {
    setActiveTabId(tabId);
  }

  function handleCloseTab(tabIdToClose) {
    setOpenTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(tab => tab.id === tabIdToClose);
      if (tabIndex === -1) return prevTabs; // Tab not found

      const newTabs = prevTabs.filter(tab => tab.id !== tabIdToClose);

      // If the closed tab was the active one, select a new active tab
      if (activeTabId === tabIdToClose) {
        if (newTabs.length === 0) {
          setActiveTabId(null); // No tabs left
        } else {
          // Select the previous tab, or the first tab if the closed one was the first
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
        }
      }
      return newTabs;
    });
  }

  // Opens a new tab or focuses an existing one if the ID matches
  function handleOpenTab(tabData) { // tabData = { id: string, title: string, type: string, ... }
    setOpenTabs(prevTabs => {
      // Check if a tab with the same ID already exists
      const existingTab = prevTabs.find(tab => tab.id === tabData.id);
      if (existingTab) {
        // If tab exists, just make it active
        setActiveTabId(tabData.id);
        return prevTabs;
      } else {
        // If tab doesn't exist, add it and make it active
        setActiveTabId(tabData.id);
        return [...prevTabs, tabData];
      }
    });
  }
  // --- End Tab Management ---


  // Image import logic (now persistent) - Reverted file path extraction, API expects File objects
  async function handleImportImages(files) { // 'files' is an array of File objects
    if (!currentProject) return;
    setLoading(true);
    setError(null);
    try {
      // Pass File objects directly to the API
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

  // --- Image Rename/Delete Handlers ---
  async function handleRenameImage(image, newName) {
    if (!currentProject) return;
    try {
      await renameProjectImage(currentProject.name, image.id, newName);
      // Refresh image list
      const result = await listProjectImages(currentProject.name);
      setProjectImages(prev => ({
        ...prev,
        [currentProject.name]: result.images || []
      }));
    } catch (err) {
      alert("Failed to rename image: " + (err.message || err));
      // Optionally, log error for debugging
      console.error("Rename image error:", err);
    }
  }

  async function handleDeleteImages(imageIds) {
    if (!currentProject) return;
    try {
      // Support batch delete by calling API for each image
      for (const id of imageIds) {
        await deleteProjectImage(currentProject.name, id);
      }
      // Refresh image list
      const result = await listProjectImages(currentProject.name);
      setProjectImages(prev => ({
        ...prev,
        [currentProject.name]: result.images || []
      }));
    } catch (err) {
      alert("Failed to delete image(s): " + (err.message || err));
    }
  }
  // --- End Image Rename/Delete Handlers ---

  // New state for pane visibility
  const [isExplorerMinimized, setIsExplorerMinimized] = useState(true);
  const [isContextMinimized, setIsContextMinimized] = useState(true);

  // Toggle handlers for panes - ensure click on minimized icon always shows the pane
  const toggleExplorer = () => {
    // If minimized, clicking the icon should always show it.
    // If not minimized, clicking the (future) header icon should minimize it.
    // For now, this simplifies to just toggling. If we add header icons later, this needs refinement.
    setIsExplorerMinimized(!isExplorerMinimized);
  };
  const toggleContext = () => {
    setIsContextMinimized(!isContextMinimized);
  };


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
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Explorer Pane - Pass toggle function */}
          {!isExplorerMinimized && (
            <Sidebar
              width={sidebarWidth}
              onToggleMinimize={toggleExplorer}
              onOpenGridTab={handleOpenGridTab}
            />
          )}
          {/* Minimized Explorer Icon */}
          {isExplorerMinimized && (
            <div
              style={{
                width: 40,
                background: "var(--background-secondary)",
                borderRight: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none"
              }}
              title="Show Explorer"
              onClick={toggleExplorer}
            >
              📁
            </div>
          )}

          {/* Sidebar Resizer (only show if pane is not minimized) */}
          {!isExplorerMinimized && (
            <div
              className="resizer vertical"
              style={{
              width: '5px',
              cursor: 'col-resize',
              background: 'var(--border-color)', // Make it visible
              minHeight: 0, // Ensure it fills height in flex
            }}
              onMouseDown={handleMouseDownSidebar} // Attach handler
            />
          )}

          {/* Workspace - Pass new props */}
          <Workspace
            openTabs={openTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            currentProject={currentProject}
            projectImages={projectImages}
            handleImportImages={handleImportImages}
            handleRenameImage={handleRenameImage}
            handleDeleteImages={handleDeleteImages}
          />

          {/* Context Panel Resizer (only show if pane is not minimized) */}
          {!isContextMinimized && (
            <div
              className="resizer vertical"
              style={{
              width: '5px',
              cursor: 'col-resize',
              background: 'var(--border-color)', // Make it visible
              minHeight: 0, // Ensure it fills height in flex
            }}
              onMouseDown={handleMouseDownContext} // Attach handler
            />
          )}

          {/* Context Panel - Pass toggle function */}
          {!isContextMinimized && (
            <ContextPanel width={contextWidth} onToggleMinimize={toggleContext} />
          )}
          {/* Minimized Context Icon */}
          {isContextMinimized && (
            <div
              style={{
                width: 40,
                background: "var(--background-secondary)",
                borderLeft: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none"
              }}
              title="Show Context Panel"
              onClick={toggleContext}
            >
              ⚙️
            </div>
          )}
        </div>
        <StatusBar />
      </div>
    );
  }

  // Fallback (should not happen)
  return null;
}

// Ensure themeable placeholder text class is injected before React renders
if (typeof document !== 'undefined' && !document.getElementById('context-placeholder-style')) {
  const style = document.createElement('style');
  style.id = 'context-placeholder-style';
  style.innerHTML = `.context-placeholder-text { color: var(--foreground-secondary); font-size: 20px; padding: 16px 24px; }`;
  document.head.appendChild(style);
}

export default App;
