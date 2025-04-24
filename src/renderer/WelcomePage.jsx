import React, { useState, useEffect } from "react";
import {
  getRecentProjects,
  getArchivedProjects,
  archiveProject,
  restoreProject,
  deleteProject,
  openProjectLocation,
  markProjectAccessed,
} from "./projectApi"; // Assuming projectApi.js is in the same directory

// --- Helper Components ---

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, color: "var(--foreground-primary)" }}>{title}</h3>
          <button onClick={onClose} style={styles.modalCloseButton}>&times;</button>
        </div>
        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function WelcomePage({ onOpen: onOpenProp, onNew }) {
  const [recentProjects, setRecentProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  const reloadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recent, archived] = await Promise.all([
        getRecentProjects(5), // Fetch top 5 recent
        getArchivedProjects(),
      ]);
      setRecentProjects(recent);
      setArchivedProjects(archived);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []); // Load on mount

  // --- Action Handlers ---

  const handleOpenProject = async (project) => {
    try {
      await markProjectAccessed(project.name); // Mark accessed first
      onOpenProp(project); // Then call the original open handler
    } catch (err) {
      console.error("Failed to mark project accessed:", err);
      // Optionally show an error, but still try to open
      onOpenProp(project);
    }
  };

  const handleArchive = async (project) => {
    try {
      await archiveProject(project.name);
      reloadData(); // Refresh lists
    } catch (err) {
      console.error("Failed to archive project:", err);
      setError(err.message || "Failed to archive project.");
    }
  };

  const handleRestore = async (project) => {
    try {
      await restoreProject(project.name);
      reloadData(); // Refresh lists
    } catch (err) {
      console.error("Failed to restore project:", err);
      setError(err.message || "Failed to restore project.");
    }
  };

  const handleOpenLocation = async (project) => {
    try {
      await openProjectLocation(project.name);
    } catch (err) {
      console.error("Failed to open project location:", err);
      setError(err.message || "Failed to open project location.");
    }
  };

  const handleShowDeleteConfirm = (project) => {
    setProjectToDelete(project);
    setDeleteConfirmInput(""); // Clear input
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
    setDeleteConfirmInput("");
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete || deleteConfirmInput !== projectToDelete.name) {
      return; // Should not happen if button is disabled, but safety check
    }
    try {
      await deleteProject(projectToDelete.name);
      handleCancelDelete(); // Close modal
      reloadData(); // Refresh lists
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError(err.message || "Failed to delete project.");
      // Keep modal open on error? Or close? Closing for now.
      handleCancelDelete();
    }
  };

  // --- Render ---

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentBox}>
        {/* Header */}
        <div style={styles.logoContainer}>
          <span style={{ fontSize: 36, color: "white" }}>🧠</span>
        </div>
        <h1 style={styles.title}>Welcome to SeekerAug</h1>
        <p style={styles.subtitle}>
          Start by opening a project or creating a new one.<br />
          <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Tip:</span>{" "}
          <span style={{ color: "var(--foreground-primary)" }}>
            Use <kbd style={styles.kbd}>Ctrl+Shift+P</kbd> for the command palette.
          </span>
        </p>

        {/* New Project Button */}
        <button onClick={onNew} style={styles.newProjectButton}>
          + New Project
        </button>

        {/* Loading/Error State */}
        {loading && <p style={{ color: "var(--foreground-secondary)" }}>Loading projects...</p>}
        {error && <p style={{ color: "var(--error-color)", fontWeight: 500 }}>Error: {error}</p>}

        {/* Recent Projects List */}
        {!loading && !error && (
          <div style={styles.listContainer}>
            <h3 style={styles.listTitle}>Recent Projects</h3>
            <ul style={styles.list}>
              {recentProjects.length === 0 && (
                <li style={styles.noProjects}>No recent projects found.</li>
              )}
              {recentProjects.map((proj) => (
                <li key={proj.name} style={styles.listItem}>
                  <div style={styles.listItemContent}>
                    <span
                      onClick={() => handleOpenProject(proj)}
                      style={styles.projectName}
                      title={`Open ${proj.name}`}
                    >
                      {proj.name}
                    </span>
                    <span style={styles.projectPath} title={proj.path}>
                      {/* Simple path shortening - replace with better logic if needed */}
                      {proj.path.length > 40 ? `...${proj.path.slice(-37)}` : proj.path}
                    </span>
                  </div>
                  <div style={styles.listItemActions}>
                    <button
                      onClick={() => handleOpenLocation(proj)}
                      style={styles.actionButton}
                      title="Open Folder Location"
                    >
                      <FolderIcon /> {/* Replace with actual icon */}
                    </button>
                    <button
                      onClick={() => handleArchive(proj)}
                      style={styles.actionButton}
                      title="Remove from Recent List (Archive)"
                    >
                      <ArchiveIcon /> {/* Replace with actual icon */}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Archived Projects Toggle/List */}
            {(archivedProjects.length > 0 || showArchived) && (
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  style={styles.moreButton}
                >
                  {showArchived ? "Hide" : "Show"} Archived Projects ({archivedProjects.length})
                </button>
                {showArchived && (
                  <ul style={{ ...styles.list, marginTop: 8 }}>
                    {archivedProjects.length === 0 && (
                       <li style={styles.noProjects}>No archived projects.</li>
                    )}
                    {archivedProjects.map((proj) => (
                      <li key={proj.name} style={styles.listItem}>
                        <div style={styles.listItemContent}>
                          <span style={{ ...styles.projectName, opacity: 0.7 }}>
                            {proj.name}
                          </span>
                          <span style={{ ...styles.projectPath, opacity: 0.7 }}>
                            {proj.path.length > 40 ? `...${proj.path.slice(-37)}` : proj.path}
                          </span>
                        </div>
                        <div style={styles.listItemActions}>
                          <button
                            onClick={() => handleRestore(proj)}
                            style={styles.actionButton}
                            title="Restore to Recent List"
                          >
                            <RestoreIcon /> {/* Replace with actual icon */}
                          </button>
                          <button
                            onClick={() => handleShowDeleteConfirm(proj)}
                            style={{ ...styles.actionButton, color: "var(--error-color)" }}
                            title="Delete Permanently"
                          >
                            <DeleteIcon /> {/* Replace with actual icon */}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Links */}
        <div style={styles.footerLinks}>
          <a href="#" style={styles.link}>Documentation</a> {/* Update href */}
          <a href="#" style={styles.link}>Support</a> {/* Update href */}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        title={`Delete Project "${projectToDelete?.name}"?`}
      >
        <p style={{ color: "var(--foreground-secondary)", marginBottom: 16 }}>
          This action cannot be undone. All project data will be permanently removed.
          To confirm, please type the project name below:
        </p>
        <input
          type="text"
          value={deleteConfirmInput}
          onChange={(e) => setDeleteConfirmInput(e.target.value)}
          placeholder={projectToDelete?.name}
          style={styles.confirmInput}
        />
        <div style={styles.modalActions}>
          <button onClick={handleCancelDelete} style={styles.modalButton}>
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleteConfirmInput !== projectToDelete?.name}
            style={{
              ...styles.modalButton,
              ...(deleteConfirmInput === projectToDelete?.name
                ? styles.modalButtonConfirm
                : styles.modalButtonDisabled),
            }}
          >
            Delete Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
}

// --- Placeholder Icons ---
// Replace these with actual SVG icons or an icon library (e.g., Material UI Icons)
const FolderIcon = () => <span> F </span>;
const ArchiveIcon = () => <span> A </span>;
const RestoreIcon = () => <span> R </span>;
const DeleteIcon = () => <span> D </span>;


// --- Styles ---
// Using JS objects for simplicity, consider CSS Modules or styled-components
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "var(--background-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px", // Added padding
    boxSizing: "border-box",
  },
  contentBox: {
    background: "var(--background-secondary)",
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)", // Adjusted shadow
    padding: "48px 40px",
    minWidth: 420,
    maxWidth: 600,
    width: "90%", // More responsive width
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
  logoContainer: {
    marginBottom: 24,
    width: 64,
    height: 64,
    borderRadius: 12,
    background: "var(--accent-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "var(--accent-primary)",
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  subtitle: {
    color: "var(--foreground-primary)",
    margin: "18px 0 32px 0",
    textAlign: "center",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5, // Added line height
  },
  kbd: {
    background: "var(--background-tertiary)",
    color: "var(--foreground-primary)",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 13,
    margin: "0 2px",
    border: "1px solid var(--border-color)",
  },
  newProjectButton: {
    background: "var(--accent-primary)",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "12px 32px",
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 32,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Adjusted shadow
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: "background 0.2s",
  },
  listContainer: {
    width: "100%",
    marginTop: 8,
  },
  listTitle: {
    color: "var(--foreground-primary)",
    margin: "0 0 12px 0",
    fontWeight: 500,
    fontSize: 15,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  noProjects: {
    color: "var(--foreground-secondary)", // Changed color
    padding: "12px 0",
    fontSize: 14,
    textAlign: "center", // Centered text
  },
  listItem: {
    marginBottom: 6, // Reduced margin
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Space between content and actions
    background: "var(--background-tertiary)",
    borderRadius: 6,
    padding: "8px 12px", // Adjusted padding
    border: "1px solid var(--border-color)",
    transition: "background 0.2s",
    cursor: "default", // Default cursor for the li itself
  },
  listItemContent: {
    display: "flex",
    flexDirection: "column", // Stack name and path
    flexGrow: 1,
    marginRight: 8, // Space before actions
    overflow: "hidden", // Prevent overflow
  },
  projectName: {
    color: "var(--foreground-primary)", // Changed color
    fontWeight: 600, // Adjusted weight
    fontSize: 15,
    cursor: "pointer", // Cursor only on the name
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block", // Ensure ellipsis works
    marginBottom: 2, // Space between name and path
  },
  projectPath: {
    color: "var(--foreground-secondary)",
    fontSize: 12, // Smaller font size
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block", // Ensure ellipsis works
  },
  listItemActions: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0, // Prevent actions from shrinking
  },
  actionButton: {
    background: "none",
    border: "none",
    color: "var(--foreground-secondary)",
    padding: "4px",
    marginLeft: 4, // Space between buttons
    cursor: "pointer",
    fontSize: 16, // Adjust as needed for icons
    lineHeight: 1,
    display: "flex", // Center icon
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    transition: "background 0.2s, color 0.2s",
  },
  moreButton: {
    background: "none",
    border: "none",
    color: "var(--accent-primary)",
    padding: "4px 0",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  footerLinks: {
    marginTop: 32,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    color: "var(--accent-primary)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)", // Optional: Add a slight blur to the background
  },
  modalContent: {
    background: "var(--background-secondary)", // Use secondary background for modal body
    padding: "24px",
    borderRadius: 8,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)", // Match contentBox shadow
    minWidth: 300,
    maxWidth: 500,
    width: "80%",
    border: "1px solid var(--border-color)", // Add border for definition
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: 12, // Increased padding
  },
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: 24,
    color: "var(--foreground-secondary)", // Use secondary text color
    cursor: "pointer",
    padding: "0 4px", // Add some padding for easier clicking
    lineHeight: 1,
  },
  modalBody: {
     color: "var(--foreground-primary)", // Ensure body text uses primary color
  },
  confirmInput: {
    width: "100%",
    padding: "10px 12px", // Increased padding
    marginBottom: 16,
    borderRadius: 4,
    border: "1px solid var(--border-color)",
    background: "var(--background-input)", // Use specific input background if available, else tertiary
    color: "var(--foreground-primary)", // Ensure text is primary color
    boxSizing: "border-box",
    fontSize: "14px", // Ensure font size is readable
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    padding: "8px 16px",
    marginLeft: 8,
    borderRadius: 4,
    border: "1px solid var(--border-color)",
    background: "var(--background-tertiary)",
    color: "var(--foreground-primary)",
    cursor: "pointer",
  },
  modalButtonConfirm: {
    background: "var(--error-color)",
    color: "white",
    borderColor: "var(--error-color)",
  },
  modalButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

// Add hover effects dynamically if needed, or use CSS classes
styles.newProjectButton[':hover'] = { background: "var(--accent-primary-dark)" }; // Example
styles.actionButton[':hover'] = { background: "var(--hover-color)", color: "var(--foreground-primary)" };
styles.moreButton[':hover'] = { textDecoration: "underline" };
styles.modalButton[':hover'] = { background: "var(--hover-color)" };
styles.modalButtonConfirm[':hover'] = { background: "darkred" }; // Example hover for confirm
