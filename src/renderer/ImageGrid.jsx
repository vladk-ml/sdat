import React, { useState } from "react";
import AnnotationEditor from "./AnnotationEditor";

/**
 * ImageGrid component for displaying project images with selection, rename, and delete features.
 * Props:
 *   images: Array of image objects ({ id, filename, original_filename, path, size, width, height, added })
 *   onRename: function(image, newName)
 *   onDelete: function(imageIds)
 */
import { useRef } from "react";

import { intakeToRefined } from "./projectApi";

export default function ImageGrid({ images, onRename, onDelete, project, onImportImages }) {
  const [selected, setSelected] = useState([]);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameInput, setRenameInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState("");

  const fileInputRef = useRef();

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onImportImages) {
      onImportImages(files);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0 && onImportImages) {
      onImportImages(files);
    }
  }

  // Selection logic
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const selectAll = () => setSelected(images.map((img) => img.id));
  const clearSelection = () => setSelected([]);

  // Rename logic
  const openRename = (img) => {
    setRenameTarget(img);
    setRenameInput(img.original_filename || img.filename);
  };
  const handleRename = () => {
    if (renameTarget && renameInput.trim()) {
      onRename(renameTarget, renameInput.trim());
      setRenameTarget(null);
      setRenameInput("");
    }
  };

  // Delete logic
  const handleDelete = () => {
    if (selected.length > 0) {
      onDelete(selected);
      setShowDeleteConfirm(false);
      setSelected([]);
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header with import and ingest button */}
      <div style={{
        padding: "24px 32px 12px 32px",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: "var(--accent-primary)"
          }}>{project?.name || "Dataset"}</h2>
          <div style={{
            color: "var(--foreground-secondary)",
            fontSize: 13,
            marginTop: 4
          }}>
            {images.length} images imported
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="button primary"
            style={{
              background: "var(--accent-primary)",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "8px 24px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer"
            }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            + Import Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.tif,.tiff"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="button"
            style={{
              background: "#2C5D93",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 24px",
              fontWeight: 600,
              fontSize: 14,
              cursor: ingesting ? "not-allowed" : "pointer",
              opacity: ingesting ? 0.7 : 1
            }}
            disabled={ingesting}
            onClick={async () => {
              if (!project) return;
              setIngesting(true);
              setIngestStatus("");
              try {
                await intakeToRefined(project.name);
                setIngestStatus("Ingested to Refined Dataset!");
              } catch (err) {
                setIngestStatus(err.message || "Failed to ingest");
              } finally {
                setIngesting(false);
                setTimeout(() => setIngestStatus(""), 2000);
              }
            }}
            title="Ingest all raw images to the Refined Dataset"
          >
            {ingesting ? "Ingesting..." : "Ingest to Refined Dataset"}
          </button>
          {ingestStatus && (
            <span style={{ marginLeft: 12, color: "#7fd1b9" }}>{ingestStatus}</span>
          )}
        </div>
      </div>

      {/* Batch action bar */}
      {selected.length > 0 && (
        <div
          style={{
            background: "var(--background-tertiary)",
            borderBottom: "1px solid var(--border-color)",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 2,
          }}
        >
          <span>{selected.length} selected</span>
          <button onClick={() => setShowDeleteConfirm(true)}>Delete</button>
          <button onClick={clearSelection}>Deselect All</button>
        </div>
      )}

      {/* Image grid with drag-and-drop */}
      <div
        className="image-grid"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
          padding: 32,
          background: "var(--background-primary)",
          overflowY: "auto"
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {images.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              color: "var(--foreground-secondary)",
              textAlign: "center",
              padding: 40,
              fontSize: 16,
              opacity: 0.7
            }}
          >
            No images imported yet. Drag and drop files here or use the import button.
          </div>
        )}
        {images.map((img) => (
          <div
            key={img.id}
            className="image-grid-item"
            style={{
              borderRadius: 3,
              background: "var(--background-tertiary)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 8,
              position: "relative",
              userSelect: "none",
              cursor: "pointer"
            }}
            onClick={e => {
              // Only open editor if not clicking on checkbox or action buttons
              if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "BUTTON"
              ) return;
              setEditorImage(img);
            }}
          >
            {/* Checkbox for selection */}
            <input
              type="checkbox"
              checked={selected.includes(img.id)}
              onChange={() => toggleSelect(img.id)}
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 1,
                accentColor: "var(--accent-color, #7fd1b9)",
              }}
              title="Select image"
            />
            {/* Thumbnail */}
            <img
              src={`file://${img.path}`}
              alt={img.original_filename || img.filename}
              className="image-grid-thumbnail"
              style={{
                width: 120,
                height: 90,
                objectFit: "cover",
                borderRadius: 2,
                marginBottom: 8,
                background: "#222",
              }}
              loading="lazy"
            />
            {/* Info */}
            <div
              className="image-grid-info"
              style={{
                width: "100%",
                padding: 4,
                textAlign: "center",
              }}
            >
              <div
                className="image-grid-filename"
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120,
                }}
                title={img.original_filename || img.filename}
              >
                {img.original_filename || img.filename}
              </div>
              <div
                className="image-grid-id"
                style={{
                  color: "var(--foreground-secondary)",
                  fontSize: 11,
                  marginTop: 2,
                  wordBreak: "break-all",
                }}
                title={img.id}
              >
                ID: {img.id}
              </div>
            </div>
            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 4,
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => openRename(img)}
                title="Rename"
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 2,
                  border: "none",
                  background: "var(--background-secondary)",
                  color: "var(--accent-color, #7fd1b9)",
                  cursor: "pointer",
                }}
              >
                Rename
              </button>
              <button
                onClick={() => {
                  setSelected([img.id]);
                  setShowDeleteConfirm(true);
                }}
                title="Delete"
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 2,
                  border: "none",
                  background: "var(--background-secondary)",
                  color: "#e57373",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Annotation Editor Modal */}
      {editorImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setEditorImage(null)}
        >
          <div
            style={{
              background: "var(--background-primary)",
              borderRadius: 8,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              minWidth: 400,
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={e => e.stopPropagation()}
          >
            <AnnotationEditor
              project={project}
              image={editorImage}
              onClose={() => setEditorImage(null)}
            />
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setRenameTarget(null)}
        >
          <div
            style={{
              background: "var(--background-primary)",
              padding: 24,
              borderRadius: 6,
              minWidth: 320,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>Rename Image</div>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              style={{
                padding: 8,
                fontSize: 14,
                borderRadius: 3,
                border: "1px solid var(--border-color)",
                background: "var(--background-secondary)",
                color: "var(--foreground-primary)",
              }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setRenameTarget(null)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 3,
                  border: "none",
                  background: "var(--background-tertiary)",
                  color: "var(--foreground-secondary)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!renameInput.trim()}
                style={{
                  padding: "6px 16px",
                  borderRadius: 3,
                  border: "none",
                  background: "var(--accent-color, #7fd1b9)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: renameInput.trim() ? "pointer" : "not-allowed",
                }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              background: "var(--background-primary)",
              padding: 24,
              borderRadius: 6,
              minWidth: 320,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              Delete {selected.length} image{selected.length > 1 ? "s" : ""}?
            </div>
            <div style={{ color: "var(--foreground-secondary)", fontSize: 13 }}>
              This action cannot be undone. Are you sure you want to delete the selected image{selected.length > 1 ? "s" : ""}?
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 3,
                  border: "none",
                  background: "var(--background-tertiary)",
                  color: "var(--foreground-secondary)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "6px 16px",
                  borderRadius: 3,
                  border: "none",
                  background: "#e57373",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
