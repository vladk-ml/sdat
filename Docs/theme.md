# SeekerAug Theme Design System

## Color Palette

### Base Colors

| Variable | Dark Theme | Light Theme | Description |
|----------|------------|-------------|-------------|
| `--background-primary` | #1E1E1E | #FFFFFF | Main application background |
| `--background-secondary` | #252526 | #F3F3F3 | Secondary surfaces (sidebars) |
| `--background-tertiary` | #2D2D2D | #E7E7E7 | Tertiary surfaces (dropdowns, etc.) |
| `--foreground-primary` | #CCCCCC | #333333 | Primary text color |
| `--foreground-secondary` | #9D9D9D | #6F6F6F | Secondary text color |
| `--accent-primary` | #0078D4 | #0078D4 | Primary accent (main actions) |
| `--accent-secondary` | #3794FF | #3794FF | Secondary accent (secondary actions) |
| `--border-color` | #474747 | #CECECE | Borders and dividers |
| `--hover-color` | #2A2D2E | #F0F0F0 | Hover state background |
| `--active-color` | #37373D | #E8E8E8 | Active/selected item background |
| `--error-color` | #F14C4C | #D83B01 | Error and warning indicators |
| `--success-color` | #6CCB7B | #107C10 | Success indicators |

### Dataset Status Colors

| Variable | Color | Description |
|----------|-------|-------------|
| `--raw-dataset-color` | #75BEFF | Raw dataset indicator |
| `--refined-dataset-color` | #B180D7 | Refined dataset indicator |
| `--annotated-dataset-color` | #F8AE3C | Annotated dataset indicator |
| `--augmented-dataset-color` | #3ECF8E | Augmented dataset indicator |
| `--model-color` | #E06C75 | Model indicator |
| `--unused-status` | #9D9D9D66 | Visual indicator for unused items |

### Syntax Highlighting Colors

| Variable | Dark Theme | Light Theme | Description |
|----------|------------|-------------|-------------|
| `--token-keyword` | #569CD6 | #0000FF | Keywords and operators |
| `--token-string` | #CE9178 | #A31515 | String values |
| `--token-comment` | #6A9955 | #008000 | Comments |
| `--token-function` | #DCDCAA | #795E26 | Functions |
| `--token-variable` | #9CDCFE | #001080 | Variables |
| `--token-number` | #B5CEA8 | #098658 | Numbers |
| `--token-class` | #4EC9B0 | #267F99 | Classes and types |

## Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|------------|
| Body text | 'Segoe UI', system-ui, sans-serif | 400 | 13px | 1.5 |
| UI labels | 'Segoe UI', system-ui, sans-serif | 400 | 12px | 1.4 |
| Headers | 'Segoe UI', system-ui, sans-serif | 600 | 16px/14px/12px | 1.4 |
| Monospace | 'Cascadia Code', 'Consolas', monospace | 400 | 13px | 1.5 |
| Buttons | 'Segoe UI', system-ui, sans-serif | 600 | 12px | 1.2 |

## UI Components

### Sidebar

```css
.sidebar {
  background-color: var(--background-secondary);
  color: var(--foreground-primary);
  width: 240px;
  height: 100vh;
  overflow-y: auto;
  user-select: none;
}

.sidebar-section {
  padding: 6px 0;
}

.sidebar-header {
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  color: var(--foreground-secondary);
  padding: 6px 12px;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  border-left: 2px solid transparent;
}

.sidebar-item:hover {
  background-color: var(--hover-color);
}

.sidebar-item.active {
  background-color: var(--active-color);
  border-left: 2px solid var(--accent-primary);
}

.sidebar-item-icon {
  margin-right: 8px;
  color: var(--foreground-secondary);
}

.sidebar-item.active .sidebar-item-icon {
  color: var(--foreground-primary);
}
```

### Tabs

```css
.tabs-container {
  display: flex;
  background-color: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
  height: 35px;
  user-select: none;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-right: 1px solid var(--border-color);
  background-color: var(--background-tertiary);
  color: var(--foreground-secondary);
  height: 100%;
  cursor: pointer;
  min-width: 100px;
  max-width: 200px;
}

.tab.active {
  background-color: var(--background-primary);
  color: var(--foreground-primary);
  border-bottom: 1px solid var(--accent-primary);
  margin-bottom: -1px;
}

.tab-icon {
  margin-right: 8px;
  font-size: 14px;
}

.tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.tab-close {
  margin-left: 8px;
  opacity: 0.6;
  border-radius: 4px;
  padding: 2px;
}

.tab-close:hover {
  opacity: 1;
  background-color: var(--hover-color);
}
```

### Buttons

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 2px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  min-width: 60px;
  height: 28px;
  background-color: var(--background-tertiary);
  color: var(--foreground-primary);
}

.button:hover {
  background-color: var(--hover-color);
}

.button:active {
  background-color: var(--active-color);
}

.button.primary {
  background-color: var(--accent-primary);
  color: white;
}

.button.primary:hover {
  background-color: var(--accent-secondary);
}

.button-icon {
  margin-right: 6px;
  font-size: 14px;
}
```

### Workspace (Center Panel)

```css
.workspace {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-primary);
  color: var(--foreground-primary);
}

.workspace-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--foreground-secondary);
}

.workspace-empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.workspace-empty-text {
  font-size: 16px;
  margin-bottom: 24px;
}
```

### Image Grid

```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
}

.image-grid-item {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-color);
  background-color: var(--background-tertiary);
}

.image-grid-thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background-color: var(--background-tertiary);
}

.image-grid-info {
  padding: 8px;
  font-size: 12px;
  border-top: 1px solid var(--border-color);
}

.image-grid-filename {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-grid-metadata {
  color: var(--foreground-secondary);
  font-size: 11px;
  margin-top: 4px;
}

.image-grid-item.unused {
  opacity: 0.6;
}

.image-grid-item.unused::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 10px,
    transparent 10px,
    transparent 20px
  );
  pointer-events: none;
}
```

### Status Bar

```css
.status-bar {
  display: flex;
  align-items: center;
  height: 22px;
  padding: 0 16px;
  background-color: var(--accent-primary);
  color: white;
  font-size: 12px;
  user-select: none;
}

.status-bar-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.status-bar-item-icon {
  margin-right: 6px;
  font-size: 14px;
}

.status-bar-spacer {
  flex: 1;
}

.status-bar-gpu {
  background-color: #2C5D93;
  padding: 2px 6px;
  border-radius: 3px;
}
```

### Context Panel (Right Sidebar)

```css
.context-panel {
  width: 280px;
  height: 100vh;
  background-color: var(--background-secondary);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
  user-select: none;
}

.context-section {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.context-header {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--foreground-primary);
  text-transform: uppercase;
}

.context-property {
  display: flex;
  font-size: 12px;
  margin-bottom: 6px;
}

.context-property-label {
  flex: 1;
  color: var(--foreground-secondary);
}

.context-property-value {
  flex: 1;
  text-align: right;
  font-family: 'Cascadia Code', 'Consolas', monospace;
}
```

## Command Palette

```css
.command-palette {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  max-width: 80vw;
  background-color: var(--background-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.command-palette-input {
  width: 100%;
  padding: 8px 12px;
  background-color: var(--background-tertiary);
  color: var(--foreground-primary);
  border: none;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  outline: none;
}

.command-palette-results {
  max-height: 60vh;
  overflow-y: auto;
}

.command-palette-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.command-palette-item:hover {
  background-color: var(--hover-color);
}

.command-palette-item.selected {
  background-color: var(--active-color);
}

.command-palette-item-icon {
  margin-right: 12px;
  color: var(--foreground-secondary);
  font-size: 16px;
}

.command-palette-item-label {
  flex: 1;
}

.command-palette-item-shortcut {
  color: var(--foreground-secondary);
  font-size: 12px;
  font-family: 'Cascadia Code', 'Consolas', monospace;
}
```

## Annotation Interface

```css
.annotation-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #1E1E1E;
  background-image: 
    linear-gradient(45deg, #2A2A2A 25%, transparent 25%), 
    linear-gradient(-45deg, #2A2A2A 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #2A2A2A 75%),
    linear-gradient(-45deg, transparent 75%, #2A2A2A 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.annotation-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}

.annotation-box {
  position: absolute;
  border: 2px solid #FFCC00;
  background-color: rgba(255, 204, 0, 0.1);
  cursor: move;
}

.annotation-box-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #FFCC00;
  border: 1px solid #000;
}

.annotation-polygon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.annotation-polygon-path {
  fill: rgba(0, 156, 255, 0.1);
  stroke: #009CFF;
  stroke-width: 2;
}

.annotation-toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--background-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.annotation-tool {
  padding: 6px;
  margin-right: 4px;
  border-radius: 3px;
  cursor: pointer;
  color: var(--foreground-secondary);
}

.annotation-tool:hover {
  background-color: var(--hover-color);
  color: var(--foreground-primary);
}

.annotation-tool.active {
  background-color: var(--accent-primary);
  color: white;
}
```

## Animation & Transitions

```css
/* Base transitions */
.transition-base {
  transition: all 0.2s ease;
}

/* Fade transitions */
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 0.2s ease;
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Slide transitions */
.slide-right-enter {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-right-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 0.2s ease;
}

.slide-right-exit {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-exit-active {
  transform: translateX(-20px);
  opacity: 0;
  transition: all 0.2s ease;
}
```

## Usage Examples

### Welcome Screen

```jsx
<div className="welcome-screen" style={{backgroundColor: 'var(--background-primary)', color: 'var(--foreground-primary)'}}>
  <div className="welcome-header">
    <img src="./logo.svg" alt="SeekerAug Logo" className="welcome-logo" />
    <h1 className="welcome-title">SeekerAug</h1>
    <p className="welcome-subtitle">Computer Vision Development Suite</p>
  </div>
  
  <div className="welcome-actions">
    <button className="button primary">
      <span className="button-icon">+</span>
      Create New Project
    </button>
    
    <button className="button">
      <span className="button-icon">📁</span>
      Open Project from Folder
    </button>
  </div>
  
  <div className="welcome-recent">
    <h2 className="welcome-section-title">Recent Projects</h2>
    <div className="welcome-recent-list">
      <div className="welcome-recent-item">
        <span className="welcome-recent-name">Aerial Imagery Dataset</span>
        <span className="welcome-recent-time">12h ago</span>
      </div>
      <div className="welcome-recent-item">
        <span className="welcome-recent-name">Building Detection</span>
        <span className="welcome-recent-time">2d ago</span>
      </div>
      <div className="welcome-recent-item">
        <span className="welcome-recent-name">Person Tracking</span>
        <span className="welcome-recent-time">5d ago</span>
      </div>
    </div>
  </div>
</div>
```

### Main Application Layout

```jsx
<div className="app">
  <div className="sidebar">
    <div className="sidebar-section">
      <div className="sidebar-header">Datasets</div>
      
      <div className="sidebar-item active">
        <span className="sidebar-item-icon" style={{color: 'var(--raw-dataset-color)'}}>📁</span>
        Raw Dataset
        <div className="sidebar-item-actions">
          <button className="sidebar-button">📁</button>
          <button className="sidebar-button">⬇️</button>
        </div>
      </div>
      
      <div className="sidebar-item">
        <span className="sidebar-item-icon" style={{color: 'var(--refined-dataset-color)'}}>📁</span>
        Refined Dataset
        <div className="sidebar-item-actions">
          <button className="sidebar-button">📁</button>
          <button className="sidebar-button">⬇️</button>
        </div>
      </div>
      
      <div className="sidebar-item">
        <span className="sidebar-item-icon" style={{color: 'var(--annotated-dataset-color)'}}>📁</span>
        Annotated Dataset
        <div className="sidebar-item-actions">
          <button className="sidebar-button">📁</button>
          <button className="sidebar-button">⬇️</button>
        </div>
      </div>
      
      <div className="sidebar-item">
        <span className="sidebar-item-icon" style={{color: 'var(--augmented-dataset-color)'}}>📁</span>
        Augmented Dataset
        <div className="sidebar-item-actions">
          <button className="sidebar-button">📁</button>
          <button className="sidebar-button">⬇️</button>
        </div>
      </div>
    </div>
    
    <div className="sidebar-section">
      <div className="sidebar-header">Models</div>
      <div className="sidebar-item">
        <span className="sidebar-item-icon" style={{color: 'var(--model-color)'}}>📦</span>
        Models
        <div className="sidebar-item-actions">
          <button className="sidebar-button">📁</button>
          <button className="sidebar-button">⬇️</button>
        </div>
      </div>
    </div>
  </div>
  
  <div className="workspace">
    <div className="tabs-container">
      <div className="tab active">
        <span className="tab-icon" style={{color: 'var(--raw-dataset-color)'}}>📁</span>
        <span className="tab-title">Raw Dataset</span>
        <span className="tab-close">✕</span>
      </div>
      <div className="tab">
        <span className="tab-icon">🖼️</span>
        <span className="tab-title">cat_001.jpg</span>
        <span className="tab-close">✕</span>
      </div>
    </div>
    
    <div className="image-grid">
      {/* Image grid items would go here */}
      <div className="image-grid-item">
        <img src="placeholder.jpg" className="image-grid-thumbnail" />
        <div className="image-grid-info">
          <div className="image-grid-filename">cat_001.jpg</div>
          <div className="image-grid-metadata">1920×1080 • 2.4MB</div>
        </div>
      </div>
      
      <div className="image-grid-item unused">
        <img src="placeholder.jpg" className="image-grid-thumbnail" />
        <div className="image-grid-info">
          <div className="image-grid-filename">cat_002.jpg</div>
          <div className="image-grid-metadata">1920×1080 • 2.1MB</div>
        </div>
      </div>
      
      {/* More items... */}
    </div>
  </div>
  
  <div className="context-panel">
    <div className="context-section">
      <div className="context-header">Properties</div>
      <div className="context-property">
        <span className="context-property-label">Selected</span>
        <span className="context-property-value">3 items</span>
      </div>
      <div className="context-property">
        <span className="context-property-label">Total Size</span>
        <span className="context-property-value">24.2 MB</span>
      </div>
      <div className="context-property">
        <span className="context-property-label">Dimensions</span>
        <span className="context-property-value">Mixed</span>
      </div>
    </div>
    
    <div className="context-section">
      <div className="context-header">Actions</div>
      <button className="button" style={{width: '100%', marginBottom: '8px'}}>
        <span className="button-icon">⚙️</span>
        Process Selected
      </button>
      <button className="button" style={{width: '100%', marginBottom: '8px'}}>
        <span className="button-icon">🗑️</span>
        Delete Selected
      </button>
      <button className="button" style={{width: '100%'}}>
        <span className="button-icon">⬇️</span>
        Export Selected
      </button>
    </div>
    
    <div className="context-section">
      <div className="context-header">History</div>
      <div className="context-property">
        <span className="context-property-label">Last Import</span>
        <span className="context-property-value">Today</span>
      </div>
      <div className="context-property">
        <span className="context-property-label">Added</span>
        <span className="context-property-value">342 files</span>
      </div>
    </div>
  </div>
  
  <div className="status-bar">
    <div className="status-bar-item">
      <span className="status-bar-item-icon">📁</span>
      342 images | 3 selected
    </div>
    
    <div className="status-bar-spacer"></div>
    
    <div className="status-bar-item">
      Process: 100%
    </div>
    <div className="status-bar-item status-bar-gpu">
      GPU: Active
    </div>
  </div>
</div>
```

## VS Code-Inspired Theme Implementation

To implement this theme in Electron/React:

1. Create a theme CSS file with CSS variables for both light and dark themes
2. Setup a theme provider context in React
3. Allow user toggling between themes
4. Persist theme preference in settings

```jsx
// Example ThemeProvider component
import React, { createContext, useState, useEffect } from 'react';
import './themes/dark-theme.css';
import './themes/light-theme.css';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

Implement the theme system while maintaining VS Code similarities for a familiar, professional experience that remains distinct to SeekerAug's brand.
