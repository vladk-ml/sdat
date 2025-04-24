import React, { useState, useEffect } from "react";
import {
  getRecentProjects,
  getArchivedProjects,
  archiveProject,
  restoreProject,
  deleteProject,
  openProjectLocation,
  markProjectAccessed,
  renameProject, // Added renameProject
} from "./projectApi";

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

  // Rename state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectToRename, setProjectToRename] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  // Context Menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, project, isArchived }

  const reloadData = async () => {
    // Close modals/menus on reload
    setShowDeleteConfirm(false);
    setShowRenameModal(false);
    setContextMenu(null);

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
  }, []); // Load on mount - Removed contextMenu dependency here

  // Separate useEffect for managing document listeners based on menu/modal state
  useEffect(() => {
    // Function to close menu on click outside
    function handleClickOutside(event) {
      // Use a class name to identify the context menu element
      if (contextMenu && !event.target.closest('.context-menu-class')) {
        setContextMenu(null);
      }
      // Could add similar logic for modals if needed, but Esc handler covers them
    }

    // Function to close menu/modals on Esc
    function handleEsc(event) {
        if (event.key === 'Escape') {
            setContextMenu(null);
            setShowDeleteConfirm(false);
            setShowRenameModal(false);
        }
    }

    // Conditionally add mousedown listener only when menu is open, using setTimeout
    let timeoutId = null;
    if (contextMenu) {
      // Delay adding the listener slightly to prevent the opening click from closing it
      timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    } else {
      // Ensure listener is removed if menu closes via Esc or action
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Always listen for Esc key when modals or menu might be open
    if (contextMenu || showDeleteConfirm || showRenameModal) {
        document.addEventListener('keydown', handleEsc);
    } else {
        document.removeEventListener('keydown', handleEsc);
    }


    // Cleanup function to remove listeners when component unmounts or effect re-runs
    return () => {
      clearTimeout(timeoutId); // Clear the timeout if component unmounts before listener is added
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
    // Re-run this effect if any relevant state changes
  }, [contextMenu, showDeleteConfirm, showRenameModal]); // Dependencies remain the same

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

  const handleShowRenameModal = (project) => {
    setContextMenu(null); // Close context menu
    setProjectToRename(project);
    setRenameInput(project.name); // Pre-fill with current name
    setShowRenameModal(true);
  };

  const handleCancelRename = () => {
    setShowRenameModal(false);
    setProjectToRename(null);
    setRenameInput("");
  };

  const handleConfirmRename = async () => {
    if (!projectToRename || !renameInput || renameInput === projectToRename.name) {
      handleCancelRename(); // Close if no change or invalid
      return;
    }
    try {
      await renameProject(projectToRename.name, renameInput);
      handleCancelRename(); // Close modal
      reloadData(); // Refresh lists
    } catch (err) {
      console.error("Failed to rename project:", err);
      setError(err.message || "Failed to rename project.");
      // Keep modal open on error? Or close? Closing for now.
      handleCancelRename();
    }
  };

  const handleContextMenu = (event, project, isArchived = false) => {
    event.preventDefault(); // Keep this to prevent default browser menu
    // Removed event.stopPropagation();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      project: project,
      isArchived: isArchived,
    });
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
                <li
                  key={proj.name}
                  style={styles.listItem}
                  onContextMenu={(e) => handleContextMenu(e, proj, false)}
                >
                  <div style={styles.listItemContent}>
                    <span
                      onClick={() => handleOpenProject(proj)}
                      style={styles.projectName}
                      title={`Open ${proj.name}`}
                    >
                      {proj.name}
                    </span>
                    <span style={styles.projectPath} title={proj.path}>
                      {/* Simple path shortening */}
                      {proj.path.length > 40 ? `...${proj.path.slice(-37)}` : proj.path}
                    </span>
                  </div>
                  {/* Removed inline action buttons */}
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
                      <li
                        key={proj.name}
                        style={styles.listItem}
                        onContextMenu={(e) => handleContextMenu(e, proj, true)}
                      >
                        <div style={styles.listItemContent}>
                           {/* Apply dimmed style directly */}
                          <span style={{ ...styles.projectName, opacity: 0.7 }}>
                            {proj.name}
                          </span>
                          <span style={{ ...styles.projectPath, opacity: 0.7 }}>
                             {/* Simple path shortening */}
                            {proj.path.length > 40 ? `...${proj.path.slice(-37)}` : proj.path}
                          </span>
                        </div>
                         {/* Removed inline action buttons */}
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

      {/* Context Menu - Rendered based on contextMenu state */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          project={contextMenu.project}
          isArchived={contextMenu.isArchived}
          onOpen={handleOpenProject}
          onOpenLocation={handleOpenLocation}
          onRename={handleShowRenameModal}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onDelete={handleShowDeleteConfirm}
          onClose={() => setContextMenu(null)}
        />
      )}

       {/* Rename Modal - Rendered based on showRenameModal state */}
       <Modal
        isOpen={showRenameModal}
        onClose={handleCancelRename}
        title={`Rename Project "${projectToRename?.name}"`}
      >
        <p style={{ color: "var(--foreground-secondary)", marginBottom: 16 }}>
          Enter the new name for the project:
        </p>
        <input
          type="text"
          value={renameInput}
          onChange={(e) => setRenameInput(e.target.value)}
          placeholder="New project name"
          style={styles.confirmInput} // Reuse delete confirm input style
          onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()} // Submit on Enter
        />
        <div style={styles.modalActions}>
          <button onClick={handleCancelRename} style={styles.modalButton}>
            Cancel
          </button>
          <button
            onClick={handleConfirmRename}
            disabled={!renameInput || renameInput === projectToRename?.name}
            style={{
              ...styles.modalButton, // Base style
              ...(renameInput && renameInput !== projectToRename?.name
                ? styles.modalButtonPrimary // Use a primary style for enabled confirm
                : styles.modalButtonDisabled),
            }}
          >
            Rename
          </button>
        </div>
      </Modal>


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

// --- Context Menu Component ---
function ContextMenu({ x, y, project, isArchived, onOpen, onOpenLocation, onRename, onArchive, onRestore, onDelete, onClose }) {
  // Removed redundant useEffect for closing on outside click, parent handles this.

  const handleAction = (action) => {
    // Ensure project is passed to the action handler
    action(project);
    onClose();
  };

  return (
    <div
      className="context-menu-class" // Class for click outside detection
      style={{ ...styles.contextMenu, top: y, left: x }}
    >
      <div style={styles.contextMenuItem} onClick={() => handleAction(onOpen)}>Open</div>
      <div style={styles.contextMenuItem} onClick={() => handleAction(onOpenLocation)}>Open Location</div>
      <div style={styles.contextMenuItem} onClick={() => handleAction(onRename)}>Rename...</div>
      <hr style={styles.contextMenuSeparator} />
      {isArchived ? (
        <div style={styles.contextMenuItem} onClick={() => handleAction(onRestore)}>Restore</div>
      ) : (
        <div style={styles.contextMenuItem} onClick={() => handleAction(onArchive)}>Remove from List (Archive)</div>
      )}
      <div style={{ ...styles.contextMenuItem, color: "var(--error-color)" }} onClick={() => handleAction(onDelete)}>Delete Permanently...</div>
    </div>
  );
}


// --- Styles ---
// (Styles remain largely the same, ensure contextMenu, contextMenuItem, contextMenuSeparator are defined)
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
    marginBottom: 6,
    display: "flex",
    alignItems: "center", // Vertically align items if path wraps (though it shouldn't now)
    justifyContent: "space-between",
    background: "var(--background-tertiary)",
    borderRadius: 6,
    padding: "10px 12px", // Slightly more vertical padding
    border: "1px solid var(--border-color)",
    transition: "background 0.2s",
    cursor: "default",
     "&:hover": { // Example for hover effect if not using dynamic styles
       background: "var(--hover-color)",
     }
  },
  listItemContent: {
    display: "flex", // Changed to flex for inline layout
    justifyContent: "space-between", // Space out name and path
    alignItems: "center", // Align items vertically
    flexGrow: 1,
    overflow: "hidden", // Prevent overflow
    // Removed marginRight as actions are gone
  },
  projectName: {
    color: "var(--foreground-primary)",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    // Removed display: block and marginBottom
    marginRight: "16px", // Add space between name and path
    flexShrink: 1, // Allow name to shrink if needed, but prioritize showing it
  },
  projectPath: {
    color: "var(--accent-primary)", // Use accent color for path
    fontSize: 13, // Slightly larger path font
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "right", // Align path to the right
    flexShrink: 0, // Prevent path from shrinking
    // Removed display: block
  },
  // Removed listItemActions style block
  actionButton: { // Kept for potential future use, but not used in list items now
    background: "none",
    border: "none",
    color: "var(--foreground-secondary)",
    padding: "4px",
    marginLeft: 4,
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
    display: "flex",
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
    marginTop: 8, // Ensure space below list before this button
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
   modalButtonPrimary: { // Style for enabled Rename button
    background: "var(--accent-primary)",
    color: "white",
    borderColor: "var(--accent-primary)",
  },
  modalButtonConfirm: { // Style for Delete button
    background: "var(--error-color)",
    color: "white",
    borderColor: "var(--error-color)",
  },
  modalButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  // Context Menu Styles
  contextMenu: {
    position: 'fixed',
    background: 'var(--background-secondary)', // Ensure opaque background
    border: '1px solid var(--border-color)', // Ensure border definition
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', // Keep shadow for depth
    padding: '6px 0',
    minWidth: '180px',
    zIndex: 1001, // Ensure it's above modal overlay
  },
  contextMenuItem: {
    padding: '8px 16px',
    color: 'var(--foreground-primary)',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
     '&:hover': { // Pseudo-selector example
       background: 'var(--hover-color)',
     }
  },
   contextMenuSeparator: {
    height: '1px',
    background: 'var(--border-color)',
    border: 'none',
    margin: '6px 0',
  },
};

// Add hover effects dynamically if needed, or use CSS classes / libraries like Radium/Styled Components
// Note: Simple JS style objects don't directly support pseudo-classes like :hover.
// The examples above are illustrative. For real hover effects, you'd typically use:
// 1. CSS Modules or regular CSS classes.
// 2. Styled-components or Emotion.
// 3. Inline styles with onMouseEnter/onMouseLeave handlers to change styles.
// For simplicity, explicit hover styles are omitted here but should be added via CSS.
