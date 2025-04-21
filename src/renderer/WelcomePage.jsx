import React, { useState, useRef, useEffect } from "react";

export default function WelcomePage({ projects, onOpen, onNew, onDelete }) {
  const [contextMenu, setContextMenu] = useState(null); // { x, y, project }
  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (contextMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setContextMenu(null);
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [contextMenu]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #232837 60%, #181c24 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#232837",
          borderRadius: 16,
          boxShadow: "0 8px 32px #000a",
          padding: "48px 40px",
          minWidth: 420,
          maxWidth: 600,
          width: "40vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          src="https://img.icons8.com/fluency/96/000000/artificial-intelligence.png"
          alt="SeekerAug"
          style={{ marginBottom: 24, filter: "brightness(0.8)" }}
        />
        <h1 style={{ color: "#7fd1b9", margin: 0, fontSize: 32, fontWeight: 700 }}>
          Welcome to SeekerAug
        </h1>
        <p style={{ color: "#b0bacf", margin: "18px 0 32px 0", textAlign: "center" }}>
          Start by opening a project or creating a new one.<br />
          <span style={{ color: "#7fd1b9" }}>Tip:</span> Use <kbd style={{
            background: "#181c24",
            color: "#7fd1b9",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 14,
            margin: "0 2px"
          }}>Ctrl+Shift+P</kbd> for the command palette.
        </p>
        <button
          onClick={onNew}
          style={{
            background: "#7fd1b9",
            color: "#181c24",
            border: "none",
            borderRadius: 6,
            padding: "12px 32px",
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 32,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0002"
          }}
        >
          + New Project
        </button>
        <div style={{ width: "100%", marginTop: 8 }}>
          <h3 style={{ color: "#b0bacf", margin: "0 0 12px 0", fontWeight: 500 }}>
            Recent Projects
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {projects.length === 0 && (
              <li style={{ color: "#7fd1b9", padding: "12px 0" }}>
                No projects found.
              </li>
            )}
            {projects.map((proj) => (
              <li
                key={proj.name}
                style={{ marginBottom: 8, display: "flex", alignItems: "center", position: "relative" }}
                onContextMenu={e => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    project: proj
                  });
                }}
              >
                <button
                  onClick={() => onOpen(proj)}
                  style={{
                    background: "#181c24",
                    color: "#e0e6ef",
                    border: "1px solid #2e3647",
                    borderRadius: 6,
                    padding: "10px 18px",
                    width: "100%",
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#232837")}
                  onMouseOut={e => (e.currentTarget.style.background = "#181c24")}
                >
                  <span style={{ color: "#7fd1b9", fontWeight: 700 }}>{proj.name}</span>
                  <span style={{ color: "#b0bacf", fontSize: 13, marginLeft: 8 }}>
                    {proj.path}
                  </span>
                </button>
                <button
                  title="Delete"
                  style={{
                    background: "#232837",
                    color: "#b94a48",
                    border: "1px solid #b94a48",
                    borderRadius: 6,
                    marginLeft: 8,
                    padding: "4px 10px",
                    fontSize: 16,
                    cursor: "pointer"
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (window.confirm(`Delete project "${proj.name}"? This cannot be undone.`)) {
                      onDelete(proj);
                    }
                  }}
                >🗑️</button>
              </li>
            ))}
          </ul>
        </div>
        {contextMenu && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              background: "#232837",
              border: "1.5px solid #2e3647",
              borderRadius: 8,
              boxShadow: "0 4px 16px #000a",
              minWidth: 160,
              zIndex: 9999
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                color: "#e0e6ef"
              }}
              onClick={() => {
                onOpen(contextMenu.project);
                setContextMenu(null);
              }}
            >Open</div>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                color: "#b94a48"
              }}
              onClick={() => {
                if (window.confirm(`Delete project "${contextMenu.project.name}"? This cannot be undone.`)) {
                  onDelete(contextMenu.project);
                }
                setContextMenu(null);
              }}
            >Delete</div>
          </div>
        )}
      </div>
    </div>
  );
}
