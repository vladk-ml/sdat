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
        background: "rgba(20,22,30,0.6)",
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
          background: "#232837",
          borderRadius: 10,
          boxShadow: "0 8px 32px #000a",
          minWidth: 420,
          maxWidth: 600,
          width: "40vw",
          padding: 0,
          border: "1.5px solid #333a",
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
            background: "#181c24",
            color: "#e0e6ef",
            border: "none",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            fontSize: 18,
            padding: "18px 20px",
            outline: "none"
          }}
        />
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ color: "#b0bacf", padding: 18 }}>No commands found</div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.action}
              style={{
                background: i === selected ? "#2e3647" : "none",
                color: i === selected ? "#7fd1b9" : "#e0e6ef",
                padding: "14px 20px",
                cursor: "pointer",
                fontWeight: i === selected ? "bold" : "normal"
              }}
              onMouseEnter={() => setSelected(i)}
              onMouseDown={() => {
                onCommand(cmd.action);
                onClose();
              }}
            >
              {cmd.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
