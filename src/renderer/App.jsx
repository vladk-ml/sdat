import React, { useEffect, useState } from "react";
import WelcomePage from "./WelcomePage.jsx";
import ProjectDashboard from "./ProjectDashboard.jsx";
import ImageGrid from "./ImageGrid.jsx";
import { loadAndApplyTheme } from "./themeLoader.js";
import { listProjects, createProject, deleteProject, importProjectImages, listProjectImages, getRawMetadata } from "./projectApi";
import Sidebar from "./Sidebar.jsx";
import TabBar from "./TabBar.jsx";
import Workspace from "./Workspace.jsx";
import ContextPanel from "./ContextPanel.jsx";
import StatusBar from "./StatusBar.jsx";
import { renameProjectImage, deleteProjectImage } from "./projectApi"; // Add these to projectApi.js

function App() {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentPage, setCurrentPage] = useState("welcome");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    loadAndApplyTheme();
    refreshProjectList();
  }, []);

  function refreshProjectList() {
    listProjects().then(setProjects);
  }

  function handleProjectClick(projectId) {
    setCurrentProjectId(projectId);
    setCurrentPage("projectDashboard");
  }

  function handleCreateProject(newProjectName) {
    createProject(newProjectName).then(() => {
      refreshProjectList();
      setCurrentPage("projectDashboard");
    });
  }

  function handleDeleteProject(projectId) {
    deleteProject(projectId).then(refreshProjectList);
  }

  function handleImportImages(projectId, imageFiles) {
    setIsImporting(true);
    importProjectImages(projectId, imageFiles, (progress) => {
      setExportProgress(progress);
    }).then(() => {
      setIsImporting(false);
      setExportProgress(0);
    });
  }

  function handleExportImages(projectId) {
    setIsExporting(true);
    listProjectImages(projectId).then((images) => {
      // Logic to export images
      setIsExporting(false);
    });
  }

  function handleImageClick(imageId) {
    // Logic to handle image click
  }

  function handleRenameImage(imageId, newName) {
    renameProjectImage(imageId, newName);
  }

  function handleDeleteImage(imageId) {
    deleteProjectImage(imageId);
  }

  function renderCurrentPage() {
    switch (currentPage) {
      case "welcome":
        return <WelcomePage onCreateProject={handleCreateProject} />;
      case "projectDashboard":
        return (
          <ProjectDashboard
            projectId={currentProjectId}
            onImportImages={handleImportImages}
            onExportImages={handleExportImages}
            onImageClick={handleImageClick}
            onRenameImage={handleRenameImage}
            onDeleteImage={handleDeleteImage}
          />
        );
      case "imageGrid":
        return <ImageGrid projectId={currentProjectId} />;
      default:
        return <WelcomePage />;
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        projects={projects}
        onProjectClick={handleProjectClick}
        onDeleteProject={handleDeleteProject}
      />
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <TabBar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          {renderCurrentPage()}
        </div>
        <StatusBar
          isImporting={isImporting}
          isExporting={isExporting}
          exportProgress={exportProgress}
        />
      </div>
      <ContextPanel />
    </div>
  );
}

export default App;
