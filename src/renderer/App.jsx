import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage.jsx";

// Placeholder components for restoration
function CommandBar({ onCloseProject }) {
  return (
    <div style={{ height: 48, background: "#181c24", color: "#7fd1b9", display: "flex", alignItems: "center", paddingLeft: 32, fontWeight: 700, fontSize: 18 }}>
      SeekerAug
      <div style={{ marginLeft: "auto", marginRight: 32 }}>
        <button
          style={{
            background: "#232837",
            color: "#b0bacf",
            border: "1px solid #b0bacf",
            borderRadius: 4,
            padding: "6px 18px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: "pointer"
          }}
          onClick={onCloseProject}
          title="Close Project and return to Welcome"
        >
          Close Project
        </button>
      </div>
    </div>
  );
}

function ExplorerPane({ width }) {
  return (
    <div style={{ width, background: "#181c24", borderRight: "1.5px solid #232837", minHeight: 0 }}>
      <div style={{ color: "#7fd1b9", fontWeight: 700, fontSize: 16, padding: "18px 0 12px 24px", borderBottom: "1px solid #232837" }}>
        Datasets
      </div>
      <div style={{ color: "#b0bacf", padding: "16px 0" }}>
        {/* Dataset types placeholder */}
        <div style={{ padding: "8px 18px" }}>[Dataset Types]</div>
      </div>
    </div>
  );
}

function TabbedWorkspace() {
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, background: "#232837", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 38, background: "#181c24", borderBottom: "1.5px solid #232837", display: "flex", alignItems: "center", paddingLeft: 16, color: "#b0bacf", fontWeight: 500 }}>
        <span style={{ color: "#7fd1b9" }}>Project Dashboard</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#b0bacf", fontSize: 20 }}>
        [Workspace Placeholder]
      </div>
    </div>
  );
}

function ContextPanel({ width }) {
  return (
    <div style={{ width, background: "#181c24", borderLeft: "1.5px solid #232837", minHeight: 0 }}>
      <div style={{ color: "#7fd1b9", fontWeight: 700, fontSize: 16, padding: "18px 0 12px 24px", borderBottom: "1px solid #232837" }}>
        Context Panel
      </div>
      <div style={{ color: "#b0bacf", padding: "16px 24px" }}>
        [Context Panel Placeholder]
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{ width: "100%", height: 28, background: "#181c24", color: "#b0bacf", borderTop: "1.5px solid #232837", display: "flex", alignItems: "center", fontSize: 13, paddingLeft: 18 }}>
      <span>Ready</span>
    </div>
  );
}

// Splitter for resizable panes
function VerticalSplitter({ onResize, getPanelWidth, min, max, cursor = "col-resize" }) {
  function onMouseDown(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = getPanelWidth();
    function onMouseMove(ev) {
      const dx = ev.clientX - startX;
      let newWidth = startWidth + dx;
      if (newWidth < min) newWidth = min;
      if (newWidth > max) newWidth = max;
      onResize(newWidth);
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = cursor;
  }
  return (
    <div
      style={{
        width: 7,
        cursor,
        zIndex: 100,
        background: "transparent",
        position: "relative"
      }}
      onMouseDown={onMouseDown}
      tabIndex={-1}
      aria-label="Resize panel"
      role="separator"
    >
      <div style={{
        width: 3,
        height: "100%",
        margin: "0 auto",
        background: "#232837",
        borderRadius: 2
      }} />
    </div>
  );
}

function App() {
  const [explorerWidth, setExplorerWidth] = useState(220);
  const [contextWidth, setContextWidth] = useState(320);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects on mount (simulate async)
  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setProjects([{ name: "Example Project" }]);
    }, 200);
  }, []);

  // Show WelcomePage if no project selected
  if (!selectedProject) {
    return (
      <WelcomePage
        projects={projects}
        onOpen={proj => setSelectedProject(proj)}
        onNew={() => {/* TODO: New project modal */}}
        onDelete={proj => {/* TODO: Delete project */}}
      />
    );
  }

  // Main window if project selected
  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#232837", display: "flex", flexDirection: "column" }}>
      <CommandBar onCloseProject={() => setSelectedProject(null)} />
      <div style={{ flex: 1, display: "flex", minHeight: 0, minWidth: 0 }}>
        <ExplorerPane width={explorerWidth} />
        <VerticalSplitter
          onResize={setExplorerWidth}
          getPanelWidth={() => explorerWidth}
          min={140}
          max={400}
        />
        <TabbedWorkspace />
        <VerticalSplitter
          onResize={setContextWidth}
          getPanelWidth={() => contextWidth}
          min={180}
          max={500}
        />
        <ContextPanel width={contextWidth} />
      </div>
      <StatusBar />
    </div>
  );
}

