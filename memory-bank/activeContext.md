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

## Next Steps

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
