# VS Code UI Patterns & Implementation Notes for SeekerAug

> This file collects actionable design notes, code snippets, and implementation hints from the VS Code UI/UX analysis.  
> **Reference this file for practical details when building or refactoring SeekerAug UI components.**  
> Only read relevant sections/lines as needed to save tokens.

---

## Tab Bar / Editor Tabs

- **State Model:** Track open tabs, order, active, pinned, dirty, type (grid, image, annotation, etc.).
- **Component Pattern:** Horizontal flexbox, each tab is a button with:
  - Label, icon (optional), close button, dirty/pinned indicators.
  - Active tab: highlight border, background.
  - Overflow: scroll or dropdown for hidden tabs.
- **Actions:** Close, pin, split, reorder (drag-and-drop), context menu.
- **Keyboard:** Ctrl+Tab (next), Ctrl+Shift+Tab (prev), Ctrl+W (close), Ctrl+1..9 (jump).
- **Snippet (React/JSX):**
  ```jsx
  <div className="tab-bar">
    {tabs.map(tab => (
      <button
        className={`tab${tab.active ? " active" : ""}${tab.dirty ? " dirty" : ""}`}
        onClick={() => setActiveTab(tab.id)}
        onContextMenu={e => openTabContextMenu(tab, e)}
        draggable
        onDragStart={e => onTabDragStart(tab, e)}
      >
        <span className="tab-label">{tab.label}</span>
        {tab.dirty && <span className="tab-dot">*</span>}
        <button className="tab-close" onClick={e => closeTab(tab.id, e)}>×</button>
      </button>
    ))}
  </div>
  ```
- **CSS Variables:** Use `--tab-active-bg`, `--tab-border`, `--tab-hover-bg`, etc.

---

## Sidebar / Explorer

- **Tree Component:** Use a performant tree for datasets/files, with expand/collapse, icons, badges.
- **Header:** Section title, action icons (new, refresh, collapse all).
- **Context Menu:** Right-click for actions (open, rename, delete, etc.).
- **Drag-and-Drop:** Reorder datasets, move files.
- **Snippet:**
  ```jsx
  <div className="sidebar">
    <div className="sidebar-header">
      <span>Datasets</span>
      <button title="New">+</button>
      <button title="Refresh">⟳</button>
    </div>
    <TreeView ... />
  </div>
  ```

---

## Context Panel

- **Multi-pane:** Tabs or menu for switching between context tools (metadata, history, review, etc.).
- **Resizable:** Drag handle to adjust width.
- **Actions:** Panel-specific actions in header.
- **Snippet:**
  ```jsx
  <div className="context-panel">
    <div className="panel-tabs">
      <button>Metadata</button>
      <button>History</button>
    </div>
    <div className="panel-content">...</div>
  </div>
  ```

---

## Status Bar

- **Left/Right Containers:** Project info, notifications (left); GPU status, quick actions (right).
- **Entry Model:** Each item has id, label, icon, command, alignment, priority.
- **Context Menu:** Right-click to hide/show entries.
- **Snippet:**
  ```jsx
  <footer className="status-bar">
    <div className="status-left">
      <span>Project: {projectName}</span>
      <span>Status: {status}</span>
    </div>
    <div className="status-right">
      <span>GPU: {gpuStatus}</span>
      <button title="Settings">⚙️</button>
    </div>
  </footer>
  ```

---

## Layout & Responsiveness

- **Grid/Flexbox:** Use CSS grid or flexbox for main layout.
- **Resizable Panes:** Implement drag handles between sidebar, workspace, context panel.
- **Movable Panes:** Allow sidebar/context panel to be moved (left/right).
- **Persistence:** Store layout state in local storage.

---

## Theming

- **CSS Variables:** All colors, spacing, and font sizes as variables.
- **Semantic Naming:** `--background-primary`, `--sidebar-border`, `--tab-active-bg`, etc.
- **Dynamic Theme Switching:** Update variables on theme change.

---

## Keyboard Shortcuts

- **Central Registry:** Map shortcuts to commands, support platform-specific bindings.
- **Contextual Activation:** Only active in relevant UI state.
- **User Remapping:** (Future) Allow user to override shortcuts.

---

## General Hints & Gotchas

- Use ARIA roles and keyboard navigation for accessibility.
- Use context menus for all major interactive elements.
- Use React state for all UI models (tabs, sidebar, status bar, etc.).
- Avoid hardcoding colors; always use theme variables.
- For drag-and-drop, use libraries like React DnD for best results.
- Persist UI state (open tabs, layout, sidebar state) for a professional experience.

---

## Scaling, Sizing, and Visual Polish

> Reference this section for font sizes, weights, button sizing, spacing, and other polish details to match VS Code's professional look.

### Typography

- **Body text:** 'Segoe UI', system-ui, sans-serif; 400; 13px; line-height: 1.5
- **UI labels:** 'Segoe UI', system-ui, sans-serif; 400; 12px; line-height: 1.4
- **Headers:** 'Segoe UI', system-ui, sans-serif; 600; 16px/14px/12px; line-height: 1.4
- **Monospace:** 'Cascadia Code', 'Consolas', monospace; 400; 13px; line-height: 1.5
- **Buttons:** 'Segoe UI', system-ui, sans-serif; 600; 12px; line-height: 1.2

### Buttons

- Height: 28px; Min width: 60px; Padding: 6px 12px; Border-radius: 2px
- Font-size: 12px; Font-weight: 600
- Primary: background `--accent-primary`, color white; hover: `--accent-secondary`
- Secondary: background `--background-tertiary`, color `--foreground-primary`
- Icon size: 14px; Icon margin-right: 6px

### Tabs

- Height: 35px; Min width: 100px; Max width: 200px; Padding: 0 12px
- Font-size: 13px; Font-weight: 400
- Active tab: border-bottom 1px solid `--accent-primary`, background `--background-primary`
- Inactive: background `--background-tertiary`, color `--foreground-secondary`
- Close button: margin-left: 8px; opacity: 0.6; border-radius: 4px; padding: 2px

### Sidebar

- Width: 240px (default); min/max as needed for resizability
- Section header: uppercase, 11px, font-weight 600, color `--foreground-secondary`, padding 6px 12px
- Item: padding 6px 12px; border-left 2px solid transparent; active: border-left `--accent-primary`
- Icon: margin-right 8px; color `--foreground-secondary` (active: `--foreground-primary`)

### Status Bar

- Height: 22px; font-size: 12px; color: white; background: `--accent-primary`
- Item: margin-right: 16px; icon size: 14px; GPU badge: background #2C5D93, border-radius: 3px

### Workspace

- Main area: flex: 1; background: `--background-primary`; color: `--foreground-primary`
- Empty state: center-aligned, font-size: 16px, icon size: 64px, color: `--foreground-secondary`

### Spacing & Borders

- Borders: 1px solid `--border-color` (panels, tabs, grid items)
- Padding: 6-12px for most UI elements
- Border-radius: 2-4px for buttons, grid items, panels

### Animation & Transitions

- Use `transition: all 0.2s ease` for hover/focus/active states
- Fade and slide transitions for overlays, modals, and palette

### General Polish

- Subtle hover/active backgrounds: `--hover-color`, `--active-color`
- Consistent iconography and spacing
- High-contrast, accessible color choices
- Responsive sizing for ultrawide and small screens

> See Docs/theme.md for full CSS and variable definitions.

---

> **Update this file with new patterns, snippets, and hints as you discover them. Reference only relevant lines/sections as needed to save tokens.

---

## VS Code Source File Insights

> Key patterns, algorithms, and code structures extracted from VS Code source files (editorTabsControl.ts, explorerView.ts, viewPaneContainer.ts, panelPart.ts, statusbarPart.ts, layout.ts, colorRegistry.ts, keybindingsRegistry.ts).

### Tab Bar (editorTabsControl.ts)
- **Tab State Model:** Use a model to track open tabs, order, active, pinned, sticky, dirty, and group context.
- **Context Keys:** Use context keys to manage tab state (active, pinned, sticky, first/last, available actions) for dynamic UI and context menus.
- **Toolbar Integration:** Render tab actions (split, close, pin) in a toolbar within the tab bar, with overflow handling.
- **Drag & Drop:** Support drag-and-drop for tab reordering, moving between groups, and opening in new windows.
- **Context Menus:** Right-click on tabs for context menus with tab-specific actions.
- **Overflow Handling:** When tabs exceed available space, use scroll or dropdown for overflow.
- **Keyboard Shortcuts:** Integrate keybindings for tab actions (close, move, split, etc.).

### Sidebar/Explorer (explorerView.ts)
- **Tree-Based Structure:** Use a tree component for folders/files, supporting expand/collapse, multi-root, compressed folders.
- **Context Keys:** Manage focus, selection, read-only, parent/child, etc. for dynamic UI and context menus.
- **Header Actions:** Section header includes icons for "New", "Refresh", "Collapse All", with tooltips and keyboard shortcuts.
- **Drag & Drop:** Enable drag-and-drop for moving files/folders, with delayed drag handlers and visual feedback.
- **Selection & Focus:** Multi-selection, keyboard navigation, and focus management for accessibility.
- **Auto-Reveal:** Auto-reveal the active file in the tree when changed in the editor.
- **Editable State:** Inline renaming/editing of files/folders with state management.
- **Decorations:** File/folder icons, badges, and decorations are theme-aware and update dynamically.
- **Persistence:** Tree view state (expanded/collapsed nodes, scroll position) is persisted.

### Pane Management (viewPaneContainer.ts)
- **Pane Container:** Manage multiple sidebar panes (Explorer, Search, etc.), each as a child component.
- **Pane Management:** Support adding/removing/reordering panes, with drag-and-drop and keyboard shortcuts.
- **Section Headers:** Each pane has a header with a title, collapse/expand toggle, and action icons.
- **Context Menus:** Right-click on pane headers for pane-specific actions (move, close, settings).
- **Persistence:** Store pane order, size, and visibility in local storage.
- **Orientation:** Support vertical (sidebar) and horizontal (panel) layouts.

### Context Panel (panelPart.ts)
- **Panel as Composite Part:** Host multiple "panes" (Output, Terminal, Problems), each with its own title, actions, and content.
- **Panel Switching:** Tab bar or menu for switching between context panes, with active/inactive styling and keyboard shortcuts.
- **Panel Actions:** Header includes actions for hiding, moving, aligning, and toggling label/icon display.
- **Resizing:** Panel supports resizing and adapts to different positions (bottom, right, top).
- **Persistence:** Active panel, size, and position are persisted.

### Status Bar (statusbarPart.ts)
- **Entry Model:** Each status bar item has id, label, icon, command, alignment, priority.
- **Left/Right Layout:** Split into left and right containers, with items arranged by alignment and priority.
- **Compact Groups:** Entries can be grouped compactly for minimal spacing, with hover/focus feedback.
- **Context Menus:** Right-click for entry/status bar actions (hide/show, settings).
- **Focus & Accessibility:** Keyboard-focusable, with ARIA roles and focus outlines.
- **Theming:** All colors are theme-driven.

### Layout (layout.ts)
- **Grid-Based Layout:** Main window is a grid, with each major UI region as a "part".
- **Resizable & Movable Panes:** All regions are resizable, and some can be moved (sidebar, panel).
- **Visibility & Persistence:** Visibility, size, and position of all parts are persisted.
- **Dynamic Arrangement:** Layout adapts to ultrawide, maximized, and fullscreen modes.
- **Focus Management:** Each part can be focused via keyboard.
- **Responsive Design:** Layout adapts to window size.

### Theming (colorRegistry.ts)
- **Central Color Registry:** All theme colors are registered centrally and mapped to CSS variables.
- **Semantic Naming:** Colors are named by UI role, not hex value.
- **Dynamic Updates:** Theme changes propagate via CSS variables.

### Keyboard Shortcuts (keybindingsRegistry.ts)
- **Central Registry:** All keybindings are registered centrally, supporting built-in and extension-provided shortcuts.
- **Platform Awareness:** Keybindings can be specified per platform.
- **Contextual Activation:** Keybindings can be enabled/disabled based on context expressions.
- **Command Registration:** Keybindings are linked to commands, registered centrally.
- **Priority & Sorting:** Keybindings have weights and priorities.

---

> Use this section for practical implementation details and patterns from the actual VS Code codebase. Reference only relevant lines/sections as needed.
