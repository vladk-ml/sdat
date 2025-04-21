# Active Context: SeekerAug

## Current Work Focus

- Robust, project-isolated dataset management with a professional, workstation-grade UI.
- End-to-end workflow: project creation, raw dataset import (including TIFFs), dataset processing (JPG conversion, metadata extraction), and dataset history/audit trail.
- Preparing for annotation, augmentation, and training integration.

## Recent Changes

- Projects are now fully isolated: each has its own directory, database, and raw/processed datasets.
- Raw dataset workflow: supports import of images (jpg, png, tif, etc.) with original filenames preserved for user clarity.
- Refined dataset workflow: all raw images can be processed to high-quality JPGs, with metadata (dimensions, format, TIFF tags, etc.) extracted and stored.
- Dataset history: all additions/removals to the raw dataset are logged in a per-project audit trail, viewable in the UI.
- UI/UX: Wide, responsive image grid; original filenames shown; VS Code-like navigation, command palette, and context menus.
- Immediate import for empty projects; staged import for non-empty projects.
- Backend endpoints for all major operations, with strict project scoping.
- **Bugfixes:** Added missing import json to backend modules, resolving backend crashes on image import/delete. Added ErrorBoundary to the frontend, so React errors now show a clear message instead of a blank screen. Added useState for processedMetadata in App.jsx, fixing ReferenceError and preventing frontend crash. All processed dataset summary and grid views now have robust error handling and null checks.

## Next Steps

- Implement VS Code-style tab system:
  - Tab types:
    - Grid view (dataset overview)
    - Image viewer (quick, lightweight)
    - Image annotator (bounding box, polygon, etc.)
    - Dataset manipulator (advanced dataset operations, grouping, filtering, reordering)
    - Class editor (explore/edit classes, ontological hierarchy, search, export, metadata/cropped previews)
    - [Future] More tab types as needed (e.g., training, metrics, augmentation pipeline)
  - Blank background when no tabs are open; tabs can be opened/closed.
  - Clicking an image in the grid opens a viewer tab (default), with option to switch to annotation/augmentation.
  - One image per tab (for now); future extensibility for multi-image tabs.
  - Tabs can go full screen, optimized for ultrawide screens.
  - Standard keyboard shortcuts (e.g., Ctrl+Tab to switch tabs, but not Ctrl+W to close).
  - Switching datasets while tabs are open is not allowed; prompt user to close tabs first.
  - Explorer is focused on information and quick actions; main work is done in the workspace/tabs.
  - Advanced dataset/class manipulation (grouping, ontological hierarchy, export) is available in dedicated tabs, not the explorer.
- Implement auto-annotation feature:
  - User annotates a small set of images (e.g., 10-20).
  - System trains a quick PyTorch model (with augmentation) on the GPU.
  - Model is used to auto-annotate remaining images (bounding boxes, polygons, pose [future]).
  - User can review, correct, and accept/reject auto-annotations.
- Explorer pane always shows all datasets (raw, refined, augmented) and allows navigation, but switching datasets while tabs are open is not allowed. Attempting to switch prompts the user to close tabs first.
  - Explorer can be resized or minimized (0:100, 30:70, 50:50 splits).
  - Advanced dataset manipulation (e.g., grouping by time/place, reordering) should be available in a dedicated tab, not the explorer itself.
  - Explorer is focused on information and quick actions; main work is done in the workspace/tabs.
- Implement annotation workflow: annotation UI, backend endpoints, and storage (COCO, YOLO, etc.).
- Develop augmentation pipeline: UI for building augmentation steps, backend for applying them, and visualization of augmented data.
- Integrate model training: training config UI, backend job management, and training dashboard.
- Advanced metadata: support for geospatial/scale info, especially for scientific/aerial imagery.
- Dataset/annotation versioning and diff tools.
- Continue to refine the UI for a dense, information-rich, and professional experience.
- Plan for future collaborative features (multi-client, P2P, real-time sync).

## Active Decisions & Considerations

- All dataset operations are strictly project-scoped; no cross-project data leakage.
- Raw and refined datasets are clearly separated, with full metadata and audit trails.
- The UI is designed for ultrawide, high-resolution workstation displays, with a focus on productivity and clarity.
- All implementation and documentation are kept in sync via the Memory Bank.
- Linux (Debian/Ubuntu) is the primary target, with local-only operation and no cloud dependencies.
