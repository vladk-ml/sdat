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

- **Tabbed Navigation:** Each open image, annotation, or tool is represented as a tab. Tabs can be closed, reordered (future), and navigated with keyboard shortcuts. Tabs can go full screen for ultrawide screens.
- **Class Editor Pattern:** Dedicated tab for exploring/editing classes, ontological hierarchy, searching, exporting, and viewing class metadata/cropped previews.
- **Auto-Annotation Pattern:** User annotates a small set of images, system trains a quick PyTorch model (with augmentation), and auto-annotates the rest. User can review/correct/accept auto-annotations.
- **Separation of Concerns:** UI, backend processing, and storage are cleanly separated.
- **Pipeline Pattern:** Augmentation and preprocessing use a pipeline of transformations.
- **Command Pattern:** Frontend issues commands to backend via API endpoints.
- **Observer Pattern:** Real-time updates (e.g., training progress) via WebSockets.
- **Versioning:** Dataset and annotation versions are tracked and can be compared/exported.
- **Audit Trail:** All dataset changes are logged for traceability and inspection.

## Component Relationships

- **Electron Frontend** ↔ **Python Backend**: Communicate via REST, WebSockets, and ZeroMQ.
- **Frontend**: Manages UI, state, and user workflow; provides professional, information-dense, VS Code-like experience.
- **Backend**: Handles all vision processing, annotation, augmentation, training, and dataset history.
- **Storage Layer**: SQLite DB and filesystem, abstracted by a data access layer in Python.
- **Project Structure**: Each project has its own directory with database, raw images, processed images, annotations, versions, temp files, and history.

## Packaging & Deployment

- **.deb Package:** Bundles Electron app, Python scripts, and Miniconda environment.
- **Post-Install Script:** Installs Miniconda, sets up environment, detects hardware, installs packages, creates desktop integration.
- **Cross-Platform Roadmap:** Initial focus on Linux (.deb), with future plans for Windows/macOS and containerized/server deployments.

## Workflow Integration

- **Stage Transitions:** Raw Dataset (original files) → Refined Dataset (JPG + metadata) → Annotation → Augmentation → Training, with clear UI indicators and data versioning at each stage.
- **Tabbed Workspace:** Opening a project shows a blank workspace with an explorer pane; clicking an image opens a viewer tab; annotation/augmentation/training tabs are planned.
- **Export Pipeline:** Flexible, format-aware export system for datasets and models.
- **History/Audit:** All dataset changes are logged and viewable in a dedicated history panel.
- **Extensibility:** Tab system and explorer are designed for future expansion (multi-image tabs, drag-and-drop, advanced navigation, collaborative features).
