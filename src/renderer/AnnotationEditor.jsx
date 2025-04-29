import React, { useEffect, useState } from "react";
import { getAnnotation, saveAnnotation } from "./projectApi";

/**
 * AnnotationEditor component for viewing and editing per-image annotation files.
 * Props:
 *   project: current project object
 *   image: image object ({ filename, id, ... })
 *   onClose: function to close the editor
 */
export default function AnnotationEditor({ project, image, onClose }) {
  const [annotation, setAnnotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getAnnotation(project.name, image.filename);
        setAnnotation(data);
      } catch (err) {
        setError(err.message || "Failed to load annotation");
      } finally {
        setLoading(false);
      }
    }
    if (project && image) load();
  }, [project, image]);

  async function handleSave() {
    setSaving(true);
    setSaveStatus("");
    try {
      await saveAnnotation(project.name, image.filename, annotation);
      setSaveStatus("Saved!");
    } catch (err) {
      setError(err.message || "Failed to save annotation");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(""), 1500);
    }
  }

  function handleAnnotationChange(idx, field, value) {
    setAnnotation((prev) => {
      const updated = { ...prev };
      updated.annotations = [...(updated.annotations || [])];
      updated.annotations[idx] = { ...updated.annotations[idx], [field]: value };
      return updated;
    });
  }

  function handleAddAnnotation() {
    setAnnotation((prev) => ({
      ...prev,
      annotations: [
        ...(prev.annotations || []),
        {
          id: `ann-${Date.now()}`,
          type: "bbox",
          class: "",
          coordinates: [0, 0, 0, 0],
          created_by: "user",
          created_at: new Date().toISOString(),
          properties: {},
        },
      ],
    }));
  }

  function handleDeleteAnnotation(idx) {
    setAnnotation((prev) => {
      const updated = { ...prev };
      updated.annotations = [...(updated.annotations || [])];
      updated.annotations.splice(idx, 1);
      return updated;
    });
  }

  if (loading) return <div style={{ padding: 32 }}>Loading annotation...</div>;
  if (error) return <div style={{ color: "#e57373", padding: 32 }}>{error}</div>;
  if (!annotation) return null;

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0, color: "var(--accent-primary)" }}>
        Annotation Editor: {image.filename}
      </h2>
      <div style={{ marginBottom: 16, color: "var(--foreground-secondary)" }}>
        <div>
          <b>Image ID:</b> {annotation.image_id || annotation.slice_id}
        </div>
        <div>
          <b>Dimensions:</b> {annotation.dimensions?.join(" x ")}
        </div>
        <div>
          <b>Parent Raw:</b> {annotation.parent_raw_filename} ({annotation.parent_raw_id})
        </div>
        {annotation.parent_refined_filename && (
          <div>
            <b>Parent Refined:</b> {annotation.parent_refined_filename} ({annotation.parent_refined_id})
          </div>
        )}
      </div>
      <h3>Annotations</h3>
      {annotation.annotations && annotation.annotations.length > 0 ? (
        annotation.annotations.map((ann, idx) => (
          <div key={ann.id || idx} style={{ border: "1px solid var(--border-color)", borderRadius: 4, padding: 12, marginBottom: 12 }}>
            <div>
              <b>Type:</b>{" "}
              <input
                value={ann.type}
                onChange={e => handleAnnotationChange(idx, "type", e.target.value)}
                style={{ width: 80 }}
              />
            </div>
            <div>
              <b>Class:</b>{" "}
              <input
                value={ann.class}
                onChange={e => handleAnnotationChange(idx, "class", e.target.value)}
                style={{ width: 120 }}
              />
            </div>
            <div>
              <b>Coordinates:</b>{" "}
              <input
                value={ann.coordinates.join(",")}
                onChange={e =>
                  handleAnnotationChange(
                    idx,
                    "coordinates",
                    e.target.value.split(",").map(Number)
                  )
                }
                style={{ width: 180 }}
              />
            </div>
            <button
              onClick={() => handleDeleteAnnotation(idx)}
              style={{
                marginTop: 8,
                background: "#e57373",
                color: "#fff",
                border: "none",
                borderRadius: 3,
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <div style={{ color: "var(--foreground-secondary)", marginBottom: 12 }}>
          No annotations yet.
        </div>
      )}
      <button
        onClick={handleAddAnnotation}
        style={{
          background: "var(--accent-primary)",
          color: "#fff",
          border: "none",
          borderRadius: 3,
          padding: "6px 18px",
          fontWeight: 600,
          marginBottom: 16,
          cursor: "pointer",
        }}
      >
        + Add Annotation
      </button>
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "var(--accent-primary)",
            color: "#fff",
            border: "none",
            borderRadius: 3,
            padding: "8px 24px",
            fontWeight: 600,
            marginRight: 12,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onClose}
          style={{
            background: "var(--background-tertiary)",
            color: "var(--foreground-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 3,
            padding: "8px 24px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Close
        </button>
        {saveStatus && (
          <span style={{ marginLeft: 16, color: "var(--accent-primary)" }}>{saveStatus}</span>
        )}
      </div>
    </div>
  );
}
