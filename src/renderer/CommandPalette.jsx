import React, { useState, useEffect, useRef } from "react";

const COMMANDS = [
  { label: "Create New Project", action: "createProject" },
  { label: "Import Images", action: "importImages" },
  { label: "List Project Images", action: "listImages" },
  { label: "Rename Selected Project", action: "renameProject" },
  { label: "Delete Selected Project", action: "deleteProject" },
  // Add more actions as needed
];

export default function CommandPalette({ open, onClose, onCommand }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(COMMANDS);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setQuery("");
      setFiltered(COMMANDS);
      setSelected(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setFiltered(
      COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSelected(0);
  }, [query]);

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      setSelected(s => Math.min(s + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelected(s => Math.max(s - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (filtered[selected]) {
        onCommand(filtered[selected].action);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(20,22,30,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          marginTop: "10vh",
          background: "var(--background-tertiary)",
          borderRadius: 8,
          boxShadow: "0 8px 32px #000a",
          minWidth: 420,
          maxWidth: 600,
          width: "40vw",
          padding: 0,
          border: "1.5px solid var(--border-color)",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          style={{
            background: "var(--background-tertiary)",
            color: "var(--foreground-primary)",
            border: "none",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottom: "1.5px solid var(--border-color)",
            fontSize: 17,
            padding: "16px 20px",
            outline: "none",
            fontFamily: "'Segoe UI', system-ui, sans-serif"
          }}
        />
        <div style={{ maxHeight: 320, overflowY: "auto", background: "var(--background-tertiary)" }}>
          {filtered.length === 0 && (
            <div style={{ color: "var(--foreground-secondary)", padding: 18, fontSize: 15 }}>
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.action}
              style={{
                background: i === selected ? "var(--active-color)" : "none",
                color: i === selected ? "var(--accent-primary)" : "var(--foreground-primary)",
                padding: "13px 20px",
                cursor: "pointer",
                fontWeight: i === selected ? 600 : 400,
                fontSize: 16,
                borderLeft: i === selected ? "3px solid var(--accent-primary)" : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                transition: "background 0.15s, color 0.15s"
              }}
              onMouseEnter={() => setSelected(i)}
              onMouseDown={() => {
                onCommand(cmd.action);
                onClose();
              }}
            >
              <span style={{ minWidth: 32, textAlign: 'center', marginRight: 18, color: "var(--foreground-secondary)", fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⌨️</span>
              <span style={{ flex: 1 }}>{cmd.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
