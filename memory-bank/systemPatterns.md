# System Patterns: SeekerAug

## System Architecture

- **Frontend:** Electron app with React UI, custom VS Code-like design, command palette, context menus, and tabbed interface.
  - Tab types: grid view, image viewer, image annotator, dataset manipulator, class editor (ontological hierarchy, search, export, metadata/cropped previews), [future] training, metrics, augmentation pipeline, etc.
- **Backend:** Python 3.8+ with Flask for REST API, OpenCV, Albumentations, PIL, PyTorch/TensorFlow/YOLO for vision tasks.
- **Communication Layer:** REST API for standard operations, WebSockets for real-time updates, ZeroMQ for high-performance data transfer.
- **Storage:** SQLite for metadata and history, filesystem for images (raw, processed, annotated, augmented), JSON for project settings and metadata, standard model formats for trained models.

## Key Technical Decisions

- **VS Code-Style Tab System:** Main workspace uses tabs for images, annotation, augmentation, and other tools. Tabs can be opened/closed, and the main area shows a blank state when no tabs are open.
- **Explorer Pane:** Always visible on the left, showing all datasets (raw, refined, augmented) and allowing navigation/switching. Can be resized or minimized; future support for drag-and-drop reordering.
- **Project Isolation:** Each project is fully isolated with its own directory, database, and datasets.
- **Raw/Refined Dataset Workflow:** Raw images (jpg, png, tif, etc.) are imported and preserved; refined dataset is generated via conversion to JPG and metadata extraction (including TIFF tags, geospatial info).
- **Dataset History/Audit Trail:** All additions/removals to the raw dataset are logged in a per-project audit table, viewable in the UI.
- **Local-Only Operation:** All data and computation are local, with no cloud dependencies.
- **Python-Electron Bridge:** Electron spawns and manages the Python backend as a child process, communicating via HTTP and ZeroMQ.
- **Modular Python Backend:** Organized into dataset, annotation, augmentation, training, and utility modules.OK
- **Continuous Saving:** Multi-tiered saving (in-memory, background auto-save, explicit save points, transaction-based DB operations).
- **File System Abstraction:** Users interact with logical datasets and projects, not raw files; all paths and storage are managed internally.

## Design Patterns

- **Implemented UI/UX Patterns:** 
  - Main application window structure scaffolded and functional: persistent explorer pane, centered command bar with command palette button, tabbed workspace, context panel, and status bar.
  - Explorer Pane implemented: dataset types (Raw, Refined, Annotated, Augmented) with color-coded badges and action buttons.
  - Command Palette button centered in the top bar; modal overlay centered on screen.
  - "New Project" modal and logic restored; dashboard shown after opening a project.
- **Application Window Structure:** 
  - Professional welcome page (VS Code style) with project creation, recent projects, and quick documentation access.
  - Main layout: left explorer pane (dataset types only, badges, color coding, export/open buttons), center tabbed workspace (dashboard, dataset tabs, annotation/augmentation studios), optional right context panel (properties, metadata, context-sensitive tools), bottom status bar (project info, notifications, hardware status), top command bar (global actions, command palette).
- **Tabbed Navigation:** Each open image, annotation, or tool is represented as a tab. Tabs can be closed, reordered (future), and navigated with keyboard shortcuts. Tabs can go full screen for ultrawide screens. Blank workspace when no tabs are open.
- **Explorer Pane Pattern:** Always visible, resizable, collapsible to icons-only. Shows only dataset types (raw, refined, annotated, augmented) with badges, color coding, and quick actions (export, open in file explorer). No dropdowns for image lists; images open in tabs.
- **Workspace Customization:** Resizable panels, snap-to guides, layout presets, theme customization, and custom keyboard shortcut mapping.
- **Annotation Studio Pattern:** Dedicated tab for annotation with drawing tools (box, polygon, brush, smart select, point), class management (hierarchy, color coding), AI assistance, annotation history (timeline, revert, compare), batch operations, review/approval workflows, and keyboard shortcuts.
- **Augmentation Studio Pattern:** Tab for building augmentation pipelines (drag-and-drop steps, parameter adjustment, save/load, real-time preview, before/after comparison, batch processing, class-aware suggestions).
- **Usage Marking Pattern:** Mark images/annotations as used/unused at any stage, with visual indicators, batch operations, inheritance rules (downward propagation/restoration), and dedicated usage management UI.
- **Lineage Visualization Pattern:** Interactive graph/timeline of dataset and annotation relationships, with branching, filtering, and cross-dataset referencing.
- **Data Integrity Principles:** Raw data is never modified after import; all transformations are tracked, reversible, and versioned. Complete audit trail and version control for datasets and annotations.
- **Export Pattern:** Dedicated export options for each dataset type and models, with format selection (COCO, YOLO, Pascal VOC, custom), export preview, progress indicators, and support for exporting selected items.
- **Keyboard Shortcut Conventions:** VS Code-inspired shortcuts for navigation, tab management, tool switching, search, and workspace actions.

- **Class Editor Pattern:** Dedicated tab for exploring/editing classes, ontological hierarchy, searching, exporting, and viewing class metadata/cropped previews.
- **Auto-Annotation Pattern:** User annotates a small set of images, system trains a quick PyTorch model (with augmentation), and auto-annotates the rest. User can review/correct/accept auto-annotations.
- **Separation of Concerns:** UI, backend processing, and storage are cleanly separated.
- **Pipeline Pattern:** Augmentation and preprocessing use a pipeline of transformations.
- **Command Pattern:** Frontend issues commands to backend via API endpoints.
- **Observer Pattern:** Real-time updates (e.g., training progress) via WebSockets.
- **Versioning:** Dataset and annotation versions are tracked and can be compared/exported.
- **Audit Trail:** All dataset changes are logged for traceability and inspection.

---

## VS Code-Inspired UI/UX Architecture & Design Rules (2025-04-21)

**Layout & Structure**
- Grid/flexbox layout for all major regions: title bar, sidebar, tab bar, workspace, context panel, status bar, activity bar (optional).
- All panes resizable, movable (where appropriate), and visibility/persistence managed in local storage.
- Responsive/adaptive for ultrawide, maximized, and focus/zen modes.

**Sidebar & Pane Management**
- Tree-based sidebar with section headers, action icons, context menus, drag-and-drop, and multi-pane support.
- Sidebar container manages multiple panes (datasets, search, history, etc.), with drag-to-reorder and keyboard shortcuts.

**Tab System**
- Tab bar with stateful model (open tabs, order, active, pinned, dirty, etc.), overflow handling, context menus, drag-and-drop, and theming.
- Tab actions (close, split, pin, etc.) and keyboard navigation.

**Context Panel**
- Multi-pane context panel with tab/menu switching, resizable, movable, and context-aware actions.
- Panel actions, context menus, and theming.

**Status Bar**
- Left/right containers for entries (project info, notifications, GPU status, quick actions, etc.), with context menus, compact grouping, and theming.
- Keyboard focus and accessibility.

**Theming**
- All colors mapped to CSS variables, with semantic naming and dynamic theme switching.
- Central theme file as source of truth, supporting dark/light/custom themes.

**Keyboard Shortcuts**
- Central registry for all shortcuts, with platform awareness, context activation, priorities, and dynamic updates.
- All actions/commands registered centrally and linked to shortcuts.

**Professional Look & Feel**
- Subtle borders, spacing, and focus rings.
- Consistent typography and iconography.
- High-contrast, accessible, and responsive design.

---

**This section is the canonical reference for all future UI/UX work in SeekerAug.**

---

## April 29, 2025: Recovery & LLM Workflow Lessons

- LLM-generated changes can be highly destructive if not guided by a strong memory bank and clear context.
- Always work from a known good commit and cherry-pick only clear, positive changes.
- Maintain a strong Memory Bank and document every feature, pattern, and workflow.
- Exclude build artifacts from version control and code reviews.
- Use CLI tools to compare only meaningful source code changes:
  - `git diff main recovery-fresh --unified=0 --diff-filter=AM | grep '^+[^+]'`
  - Exclude build artifacts with: `-- ':!src/renderer/renderer.js' ':!src/renderer/renderer.js.map'`
- Keep .clinerules updated with project intelligence and workflow patterns as they are discovered.
