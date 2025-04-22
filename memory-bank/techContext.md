# Tech Context: SeekerAug

## Technologies Used

### Frontend
- **Electron**: Desktop application shell
- **React**: UI framework
- **Material UI** or **Tailwind CSS**: UI component library/styling
- **Redux**: State management
- **Webpack, Babel**: Build tools
- **TypeScript**: (optional, for type safety)

### Backend
- **Python 3.8+**
- **Flask** or **FastAPI**: REST API server
- **OpenCV**: Image processing
- **Albumentations**: Data augmentation
- **NVIDIA DALI**: GPU-accelerated data processing
- **PyTorch / TensorFlow / Ultralytics YOLO**: Model training/inference
- **ZeroMQ**: High-performance inter-process communication
- **Miniconda**: Python environment management

### Communication Layer
- **REST API**: Standard operations
- **WebSockets**: Real-time updates (annotation, training progress)
- **ZeroMQ**: Bulk data transfer (image batches, augmentation)

### Storage
- **SQLite**: Project metadata and versioning
- **Filesystem**: Image and annotation storage
- **JSON**: Project settings/configuration
- **Standard model formats**: (.pt, .h5, ONNX, etc.)

### Packaging & Deployment
- **electron-builder, electron-installer-debian**: App packaging
- **Miniconda**: Bundled for Python environment
- **Post-install scripts**: Hardware detection, environment setup

### Development Tools
- **Git**: Version control
- **GitHub Issues**: Issue tracking
- **GitHub Actions**: CI/CD
- **Markdown + Sphinx**: Documentation

## Development Setup

- Node.js and npm required for frontend development.
- Python 3.8+ and Miniconda for backend development.
- Linux (Debian/Ubuntu) is the primary target for initial development and packaging.
- All dependencies are managed via npm (frontend) and conda/pip (backend).
- Development environment supports hot-reloading for React and live-reloading for Python API.

## UI/UX Implementation Recommendations

- Use React context for sharing UI state across components.
- Implement virtual scrolling for large image grids and lists.
- Lazy load images and thumbnails for performance.
- Consider WebGL for image rendering when possible.
- Use WebSockets for real-time updates from long-running processes.
- Implement proper keyboard focus management for accessibility and workflow speed.
- Make table views sortable by all metadata fields.
- Support drag-and-drop for augmentation pipeline steps and workspace layout.
- Provide resizable panels with drag handles and snap-to guides for layout customization.
- Offer theme customization options and custom keyboard shortcut mapping.

## Technical Constraints

- All processing and storage must be local; no cloud dependencies.
- Must support both CPU-only and GPU-accelerated environments, with hardware detection at install time.
- Initial packaging targets .deb (Debian/Ubuntu); cross-platform support is a future goal.
- All user data must be abstracted from the file system and managed via the application.

## Key Dependencies

- Electron, React, Redux, Material UI/Tailwind, Webpack, Babel, TypeScript (frontend)
- Python, Flask/FastAPI, OpenCV, Albumentations, NVIDIA DALI, PyTorch/TensorFlow/YOLO, ZeroMQ, Miniconda (backend)
- SQLite, JSON (storage)
- electron-builder, electron-installer-debian (packaging)
