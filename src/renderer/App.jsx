import React from "react";
import WelcomePage from "./WelcomePage.jsx";
import ProjectDashboard from "./ProjectDashboard.jsx";
import ImageGrid from "./ImageGrid.jsx";
import { loadAndApplyTheme } from "./themeLoader.js";
import { listProjects, createProject, deleteProject, importProjectImages, listProjectImages, getRawMetadata } from "./projectApi";

// ...Sidebar, TabBar, Workspace, ContextPanel, StatusBar unchanged...

import { renameProjectImage, deleteProjectImage } from "./projectApi"; // Add these to projectApi.js

function App() {
  return <div style={{color: "white", padding: 40, fontSize: 32}}>App Loaded</div>;
}

export default App;
