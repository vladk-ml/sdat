# System Patterns: SeekerAug

## System Architecture

- **Frontend:** Electron app with React UI, Material UI or Tailwind CSS, Redux for state management.
- **Backend:** Python 3.8+ with Flask or FastAPI for REST API, OpenCV, Albumentations, NVIDIA DALI, PyTorch/TensorFlow/YOLO for vision tasks.
- **Communication Layer:** REST API for standard operations, WebSockets for real-time updates, ZeroMQ for high-performance data transfer.
- **Storage:** SQLite for metadata, filesystem for images, JSON for project settings, standard model formats for trained models.

## Key Technical Decisions

- **Local-Only Operation:** All data and computation are local, with no cloud dependencies.
- **Python-Electron Bridge:** Electron spawns and manages the Python backend as a child process, communicating via HTTP and ZeroMQ.
- **GPU Detection and Utilization:** Post-install scripts detect hardware and install appropriate packages for CPU or GPU.
- **Modular Python Backend:** Organized into annotation, augmentation, dataset, training, and utility modules.
- **Continuous Saving:** Multi-tiered saving (in-memory, background auto-save, explicit save points, transaction-based DB operations).
- **File System Abstraction:** Users interact with logical datasets and projects, not raw files; all paths and storage are managed internally.

## Design Patterns

- **Separation of Concerns:** UI, backend processing, and storage are cleanly separated.
- **Pipeline Pattern:** Augmentation and preprocessing use a pipeline of transformations.
- **Command Pattern:** Frontend issues commands to backend via API endpoints.
- **Observer Pattern:** Real-time updates (e.g., training progress) via WebSockets.
- **Versioning:** Dataset and annotation versions are tracked and can be compared/exported.

## Component Relationships

- **Electron Frontend** ↔ **Python Backend**: Communicate via REST, WebSockets, and ZeroMQ.
- **Frontend**: Manages UI, state, and user workflow.
- **Backend**: Handles all vision processing, annotation, augmentation, and training.
- **Storage Layer**: SQLite DB and filesystem, abstracted by a data access layer in Python.
- **Project Structure**: Each project has its own directory with database, raw images, annotations, versions, and temp files.

## Packaging & Deployment

- **.deb Package:** Bundles Electron app, Python scripts, and Miniconda environment.
- **Post-Install Script:** Installs Miniconda, sets up environment, detects hardware, installs packages, creates desktop integration.
- **Cross-Platform Roadmap:** Initial focus on Linux (.deb), with future plans for Windows/macOS and containerized/server deployments.

## Workflow Integration

- **Stage Transitions:** Image Collection → Annotation → Augmentation → Training, with clear UI indicators and data versioning at each stage.
- **Export Pipeline:** Flexible, format-aware export system for datasets and models.
