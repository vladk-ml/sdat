import React, { useState, useRef, useEffect } from "react";

// VS Code-inspired Welcome Page with theme variables and polish
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
        background: "var(--background-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "var(--background-secondary)",
          borderRadius: 12,
          boxShadow: "0 8px 32px #000a",
          padding: "48px 40px",
          minWidth: 420,
          maxWidth: 600,
          width: "40vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1,
          boxSizing: "border-box"
        }}
      >
        <div style={{
          marginBottom: 24,
          width: 64,
          height: 64,
          borderRadius: 12,
          background: "var(--accent-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{ fontSize: 36, color: "white" }}>🧠</span>
        </div>
        <h1 style={{
          color: "var(--accent-primary)",
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}>
          Welcome to SeekerAug
        </h1>
        <p style={{
          color: "var(--foreground-primary)",
          margin: "18px 0 32px 0",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 400
        }}>
          Start by opening a project or creating a new one.<br />
          <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Tip:</span>{" "}
          <span style={{ color: "var(--foreground-primary)" }}>
            Use <kbd style={{
              background: "var(--background-tertiary)",
              color: "var(--foreground-primary)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 13,
              margin: "0 2px",
              border: "1px solid var(--border-color)"
            }}>Ctrl+Shift+P</kbd> for the command palette.
          </span>
        </p>
        <button
          onClick={onNew}
          className="button primary"
          style={{
            background: "var(--accent-primary)",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "12px 32px",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 32,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0002",
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}
        >
          + New Project
        </button>
        <div style={{ width: "100%", marginTop: 8 }}>
          <h3 style={{
            color: "var(--foreground-primary)",
            margin: "0 0 12px 0",
            fontWeight: 500,
            fontSize: 15,
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}>
            Recent Projects
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {(!projects || projects.length === 0) && (
              <li style={{
                color: "var(--accent-primary)",
                padding: "12px 0",
                fontSize: 14
              }}>
                No projects found.
              </li>
            )}
            {projects && projects.map((proj) => (
              <li
                key={proj.name}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  position: "relative"
                }}
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
                    background: "var(--background-tertiary)",
                    color: "var(--foreground-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 6,
                    padding: "10px 18px",
                    width: "100%",
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "var(--hover-color)")}
                  onMouseOut={e => (e.currentTarget.style.background = "var(--background-tertiary)")}
                >
                  <span style={{
                    color: "var(--accent-primary)",
                    fontWeight: 700,
                    fontSize: 15
                  }}>{proj.name}</span>
                  <span style={{
                    color: "var(--foreground-secondary)",
                    fontSize: 13,
                    marginLeft: 8
                  }}>
                    {proj.path}
                  </span>
                </button>
                <button
                  title="Delete"
                  style={{
                    background: "var(--background-secondary)",
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
        <div style={{
          marginTop: 32,
          width: "100%",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <a
            href="https://github.com/your-org/seekeraug"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500
            }}
          >Documentation</a>
          <a
            href="https://your-org.com/support"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500
            }}
          >Support</a>
        </div>
        {contextMenu && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              background: "var(--background-secondary)",
              border: "1.5px solid var(--border-color)",
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
                color: "var(--foreground-primary)"
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
