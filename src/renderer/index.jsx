import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { loadAndApplyTheme } from "./themeLoader.js"; // Import theme loader

console.log("Renderer loaded!");

// Load theme before rendering the app
loadAndApplyTheme("dark");

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
