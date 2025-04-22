import React, { useRef } from "react";

// Simulated image import and grid view for the project dashboard
export default function ProjectDashboard({ project, images, onImportImages }) {
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImportImages(files);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      onImportImages(files);
    }
  }

  return (
    <div className="project-dashboard" style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "var(--background-primary)",
      color: "var(--foreground-primary)",
      padding: 0,
      minHeight: 0
    }}>
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
          }}>{project.name}</h2>
          <div style={{
            color: "var(--foreground-secondary)",
            fontSize: 13,
            marginTop: 4
          }}>
            {images.length} images imported
          </div>
        </div>
        <div>
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
        </div>
      </div>
      <div
        className="image-grid"
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
          padding: 32,
          overflowY: "auto"
        }}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {images.length === 0 && (
          <div style={{
            gridColumn: "1 / -1",
            color: "var(--foreground-secondary)",
            fontSize: 16,
            textAlign: "center",
            opacity: 0.7
          }}>
            No images imported yet. Drag and drop files here or use the import button.
          </div>
        )}
        {images.map((img, idx) => (
          <div key={img.id || idx} className="image-grid-item" style={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid var(--border-color)",
            background: "var(--background-tertiary)",
            display: "flex",
            flexDirection: "column"
          }}>
            <img
              src={img.url}
              alt={img.name}
              className="image-grid-thumbnail"
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                background: "var(--background-tertiary)"
              }}
            />
            <div className="image-grid-info" style={{
              padding: 8,
              fontSize: 12,
              borderTop: "1px solid var(--border-color)"
            }}>
              <div className="image-grid-filename" style={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>{img.name}</div>
              <div className="image-grid-metadata" style={{
                color: "var(--foreground-secondary)",
                fontSize: 11,
                marginTop: 4
              }}>
                {img.size ? `${(img.size / 1024).toFixed(1)} KB` : ""} {img.type ? `• ${img.type}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
