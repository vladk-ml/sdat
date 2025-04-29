import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage.jsx";
import ProjectDashboard from "./ProjectDashboard.jsx";
import ImageGrid from "./ImageGrid.jsx";
import { loadAndApplyTheme } from "./themeLoader.js";
import { listProjects, createProject, deleteProject, importProjectImages, listProjectImages, getRawMetadata } from "./projectApi";

// ...Sidebar, TabBar, Workspace, ContextPanel, StatusBar unchanged...

import { renameProjectImage, deleteProjectImage } from "./projectApi"; // Add these to projectApi.js

function App() {
  // ...all App state and handlers above unchanged...

  // --- Refined Dataset Tab Handler ---
  function handleOpenRefinedTab() {
    if (!currentProject) return;
    handleOpenTab({
      id: `refined-${currentProject.name}`,
      title: `${currentProject.name} Refined`,
      type: 'refined'
    });
  }

  // ...rest of App function unchanged, including rendering Sidebar with onOpenRefinedTab={handleOpenRefinedTab}...
}

export default App;
