# SeekerAug: Local Computer Vision Development Suite
## Product Requirements Document

This document outlines the plan for developing a local desktop application similar to Roboflow that provides a complete workflow for computer vision development - from annotation to augmentation to training.

## 1. Project Overview

### 1.1 Vision

SeekerAug aims to provide a complete, locally-run computer vision development environment that mimics the Roboflow workflow but operates entirely on the user's machine, offering enhanced privacy, reduced costs, and compatibility with local GPU acceleration.

### 1.2 Target Users

- Computer vision researchers and developers
- Organizations with privacy concerns that prevent cloud usage
- Educational institutions teaching computer vision
- Developers with limited budgets for cloud services
- Teams with powerful local GPU resources

### 1.3 Key Features

- Dataset management and versioning
- Image annotation with AI assistance
- Data preprocessing and augmentation
- Model training integration
- Export capabilities for various formats

## 2. Technology Stack

### 2.1 Frontend (Electron)

- **Framework**: Electron with React
- **UI Library**: Material UI or Tailwind CSS
- **State Management**: Redux
- **Build Tools**: Webpack, Babel
- **Packaging**: electron-builder, electron-installer-debian

### 2.2 Backend (Python)

- **Core**: Python 3.8+
- **Vision Libraries**:
  - OpenCV
  - Albumentations (for augmentation)
  - NVIDIA DALI (for GPU-accelerated data processing)
  - PyTorch / TensorFlow / Ultralytics YOLO
- **API Server**: Flask or FastAPI
- **Environment Management**: Miniconda (bundled)

### 2.3 Communication Layer

- **Electron-Python Bridge**: RESTful API using Flask/FastAPI
- **Heavy Data Processing**: ZeroMQ for high-performance communication
- **Launch Process**: Child process spawning and management

### 2.4 Storage

- **Dataset Storage**: SQLite for metadata, filesystem for images
- **Project Settings**: JSON configuration files
- **Model Storage**: Standard model formats (.pt, .h5, etc.)

## 3. System Architecture

### 3.1 Overall Structure

```
+---------------------+       +----------------------+
|                     |       |                      |
|  Electron Frontend  | <---> |   Python Backend     |
|  (UI + Node.js)     |       |   (Core Processing)  |
|                     |       |                      |
+---------------------+       +----------------------+
         ^                               ^
         |                               |
         v                               v
+---------------------+       +----------------------+
|                     |       |                      |
|  Local File System  | <---> |   GPU Acceleration   |
|  (Data Storage)     |       |   (CUDA/CuDNN)      |
|                     |       |                      |
+---------------------+       +----------------------+
```

### 3.2 Component Interaction

1. **Electron Frontend**:
   - Handles all UI rendering and user interactions
   - Manages application state and workflow
   - Communicates with Python backend for processing tasks

2. **Python Backend**:
   - Provides all computer vision functionality
   - Handles computation-intensive tasks
   - Accesses GPU resources when available

3. **Communication Layer**:
   - REST API for standard operations
   - WebSockets for real-time updates (annotation preview, training progress)
   - ZeroMQ for high-performance data transfer (image batches, augmentation)

### 3.3 Package & Installation Architecture

```
+----------------------+
|                      |
|    .deb Package      |
|                      |
+----------------------+
          |
          v
+----------------------+       +----------------------+
|                      |       |                      |
| Application Install  | ----> | Post-Install Script  |
|                      |       |                      |
+----------------------+       +----------------------+
                                         |
                                         v
                              +----------------------+
                              |                      |
                              | Miniconda Setup      |
                              | Environment Creation |
                              |                      |
                              +----------------------+
                                         |
                                         v
                              +----------------------+
                              |                      |
                              | Hardware Detection   |
                              | Package Installation |
                              |                      |
                              +----------------------+
```

## 4. Feature Breakdown

### 4.1 Project Management

- Create/open/save projects
- Project configuration and settings
- Dataset versioning and comparison
- Export/import datasets

### 4.2 Data Management

- Image/video import from local files
- Dataset visualization and exploration
- Class/label management
- Dataset statistics and insights

### 4.3 Annotation

- Manual annotation tools (bounding box, polygon, keypoint)
- AI-assisted annotation
- Annotation review and correction
- Multi-user annotation support (imported sessions)

### 4.4 Preprocessing & Augmentation

- Image resizing/cropping
- Color adjustments
- Noise addition
- Geometric transformations (rotation, flipping, etc.)
- Advanced augmentations (mosaic, mixup, etc.)
- GPU acceleration with NVIDIA DALI

### 4.5 Model Training

- Integration with popular frameworks (YOLO, TensorFlow, PyTorch)
- Training parameter configuration
- GPU utilization
- Training visualization (loss curves, metrics)
- Model evaluation

### 4.6 Export & Deployment

- Export in various formats (YOLO, TensorFlow, ONNX, etc.)
- Export annotations for other tools
- Export augmented datasets

## 5. User Interface Design

### 5.1 Main Application Flow

1. **Start Screen**:
   - Recent projects
   - Create new project
   - Application settings

2. **Project Dashboard**:
   - Project overview and statistics
   - Dataset versions
   - Quick actions

3. **Dataset View**:
   - Image grid/list view
   - Filtering and sorting
   - Selection tools

4. **Annotation Workspace**:
   - Image viewer with tools
   - Class/label selector
   - Annotation properties

5. **Augmentation Studio**:
   - Augmentation pipeline builder
   - Preview generator
   - Batch processing

6. **Training Configuration**:
   - Model selection
   - Parameter tuning
   - Hardware utilization settings

7. **Training Monitor**:
   - Progress visualization
   - Metrics display
   - Early stopping controls

### 5.2 Layout Structure

The application will use a consistent layout with:
- Left sidebar for navigation
- Top bar for global actions and search
- Main content area for the active view
- Right sidebar for context-sensitive tools and properties

## 6. Implementation Plan

### 6.1 Development Phases

#### Phase 1: Core Framework
- Set up Electron with Python integration
- Implement communication layer
- Create basic project management

#### Phase 2: Data & Annotation
- Implement dataset management
- Basic annotation tools
- Image viewing and navigation

#### Phase 3: Preprocessing & Augmentation
- Implement preprocessing pipeline
- Add augmentation capabilities
- Create preview system

#### Phase 4: Training Integration
- Connect to training frameworks
- Implement training configuration
- Add monitoring capabilities

#### Phase 5: Packaging & Deployment
- Create .deb packaging system
- Implement post-install scripts
- Test on various Ubuntu versions

### 6.2 Development Tools

- **Version Control**: Git
- **Issue Tracking**: GitHub Issues
- **CI/CD**: GitHub Actions
- **Documentation**: Markdown + Sphinx

## 7. Installation Process

### 7.1 User Experience

1. User downloads the .deb package
2. User installs via GUI package manager or `sudo dpkg -i seekeraug.deb`
3. Installation wizard handles:
   - Application installation
   - Miniconda setup
   - Environment creation
   - Hardware detection
   - Package installation based on detected hardware

### 7.2 Technical Implementation

#### 7.2.1 Debian Package Structure

```
seekeraug-1.0.0_amd64.deb
├── DEBIAN/
│   ├── control      # Package metadata
│   ├── preinst      # Pre-installation script
│   ├── postinst     # Post-installation script
│   └── conffiles    # Configuration files to preserve
├── usr/
│   ├── bin/
│   │   └── seekeraug    # Launch script
│   ├── lib/
│   │   └── seekeraug/   # Application files
│   │       ├── app/     # Electron app
│   │       ├── python/  # Python scripts
│   │       └── resources/
│   └── share/
│       ├── applications/
│       │   └── seekeraug.desktop    # Desktop entry
│       └── icons/
│           └── hicolor/
│               └── 256x256/
│                   └── apps/
│                       └── seekeraug.png
└── opt/
    └── seekeraug/
        └── conda/    # Miniconda distribution
```

#### 7.2.2 Post-Installation Script

The post-installation script will:

1. Install Miniconda if not already installed
2. Create a dedicated environment
3. Detect hardware (CPU/GPU)
4. Install appropriate packages:
   - For NVIDIA GPU: CUDA-enabled packages
   - For CPU-only: CPU optimized packages
5. Create necessary desktop integrations
6. Set up file associations

## 8. Code Implementation Details

### 8.1 Electron-Python Communication

#### 8.1.1 RESTful API Approach

```javascript
// In Electron
async function callPythonAPI(endpoint, data) {
  const response = await fetch(`http://localhost:5000/${endpoint}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
}

// Example usage
const annotations = await callPythonAPI('annotate/detect', {
  image_path: '/path/to/image.jpg',
  model: 'yolov8n'
});
```

```python
# In Python
from flask import Flask, request, jsonify
import cv2

app = Flask(__name__)

@app.route('/annotate/detect', methods=['POST'])
def auto_detect():
    data = request.json
    image_path = data['image_path']
    model_name = data['model']
    
    # Process with OpenCV or ML model
    image = cv2.imread(image_path)
    # ... detection logic
    
    return jsonify({"annotations": detections})

if __name__ == '__main__':
    app.run(port=5000)
```

#### 8.1.2 ZeroMQ for Performance-Critical Operations

```javascript
// In Electron
const zeromq = require('zeromq');
const requester = zeromq.socket('req');
requester.connect('tcp://127.0.0.1:5555');

async function augmentBatch(images, operations) {
  return new Promise((resolve, reject) => {
    requester.send(JSON.stringify({
      images: images,
      operations: operations
    }));
    
    requester.on('message', (reply) => {
      resolve(JSON.parse(reply.toString()));
    });
  });
}
```

```python
# In Python
import zmq
import json
import numpy as np
import cv2

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

while True:
    message = socket.recv()
    data = json.loads(message)
    
    # Process batch of images
    results = []
    for img_path in data['images']:
        img = cv2.imread(img_path)
        # Apply augmentations
        # ...
        results.append({"path": img_path, "status": "success"})
    
    socket.send(json.dumps(results).encode())
```

### 8.2 Packaging with electron-installer-debian

```javascript
// package.json scripts
"scripts": {
  "start": "electron .",
  "build": "electron-packager . seekeraug --platform linux --arch x64 --out dist/ --overwrite",
  "deb64": "electron-installer-debian --src dist/seekeraug-linux-x64/ --dest dist/installers/ --arch amd64 --config debian.json"
}

// debian.json
{
  "dest": "dist/installers/",
  "icon": "resources/icon.png",
  "categories": [
    "Development",
    "Science"
  ],
  "depends": [
    "libgtk-3-0",
    "libnotify4",
    "libnss3",
    "libxss1",
    "libxtst6",
    "xdg-utils"
  ],
  "scripts": {
    "postinst": "scripts/postinst.sh"
  }
}
```

### 8.3 Python Environment Setup Script

```bash
#!/bin/bash
# postinst.sh - Post-installation script

set -e

# Application paths
APP_DIR="/usr/lib/seekeraug"
CONDA_DIR="/opt/seekeraug/conda"
ENV_NAME="seekeraug_env"

# Install Miniconda if not already installed
if [ ! -d "$CONDA_DIR" ]; then
  echo "Installing Miniconda..."
  mkdir -p $(dirname "$CONDA_DIR")
  
  # Download and install Miniconda
  MINICONDA_URL="https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh"
  wget -q $MINICONDA_URL -O /tmp/miniconda.sh
  bash /tmp/miniconda.sh -b -p "$CONDA_DIR"
  rm /tmp/miniconda.sh
fi

# Add conda to path for this script
export PATH="$CONDA_DIR/bin:$PATH"

# Check for NVIDIA GPU
NVIDIA_GPU=$(lspci | grep -i nvidia)
if [ -n "$NVIDIA_GPU" ] && [ -x "$(command -v nvidia-smi)" ]; then
  echo "NVIDIA GPU detected, installing GPU packages..."
  
  # Create environment with GPU packages
  conda create -y -n $ENV_NAME python=3.9
  conda activate $ENV_NAME
  conda install -y -c pytorch pytorch torchvision cudatoolkit
  conda install -y -c nvidia cuda-nvcc
  pip install opencv-python-headless albumentations ultralytics flask zeromq
  
  # Install DALI
  pip install --extra-index-url https://developer.download.nvidia.com/compute/redist nvidia-dali-cuda110
else
  echo "No NVIDIA GPU detected, installing CPU-only packages..."
  
  # Create environment with CPU packages
  conda create -y -n $ENV_NAME python=3.9
  conda activate $ENV_NAME
  conda install -y -c pytorch pytorch torchvision cpuonly
  pip install opencv-python-headless albumentations ultralytics flask zeromq
fi

# Create application launcher
echo "Creating application launcher..."
update-desktop-database

echo "Installation complete!"
exit 0
```

## 9. Challenges and Mitigation Strategies

### 9.1 Packaging Complexity

**Challenge**: Packaging Python with Electron can be complex due to different runtime environments.

**Mitigation**:
- Use Miniconda for controlled Python environment
- Implement robust post-install scripts
- Extensive testing on various Ubuntu versions
- Fallback mechanisms for different configurations

### 9.2 GPU Compatibility

**Challenge**: Different GPU hardware and driver versions can cause compatibility issues.

**Mitigation**:
- Hardware detection in post-install
- Package version selection based on detection
- Graceful fallback to CPU if GPU setup fails
- Clear error messages and diagnostic tools

### 9.3 Performance

**Challenge**: Processing large datasets locally can strain system resources.

**Mitigation**:
- Implement batch processing
- Add resource usage monitoring
- Optimize memory usage for large datasets
- Allow user configuration of resource limits

### 9.4 User Experience

**Challenge**: Matching the polished UX of web-based applications in a desktop app.

**Mitigation**:
- Use modern UI frameworks
- Implement responsive design
- Add progress indicators for long-running tasks
- Provide clear workflow guidance

## 10. Future Expansion

### 10.1 Potential Features

- Multi-GPU support
- Distributed training across network
- Advanced model visualization
- Custom model architecture builder
- Export to edge devices
- Integration with version control systems

### 10.2 Platform Expansion

- Windows and macOS support
- Container-based deployment option
- Server deployment for team environments

## 11. Initial Development Roadmap

### Month 1: Framework and Core
- Set up Electron with Python integration
- Implement basic UI layout
- Create project management functions
- Establish communication layer

### Month 2: Data Management & Annotation
- Implement dataset import/export
- Create annotation tools
- Add AI-assisted annotation
- Build dataset versioning

### Month 3: Preprocessing & Augmentation
- Implement preprocessing pipeline
- Add GPU-accelerated augmentation
- Create augmentation preview system
- Build batch processing capabilities

### Month 4: Training & Packaging
- Implement model training integration
- Add training monitoring
- Create packaging system
- Test and optimize installation process

## 13. Detailed Workflow Implementation

### 13.1 Project Creation and Data Storage Architecture

When a user creates a new project, the application will:

1. Create a properly structured database in SQLite to track all project elements
2. Establish a dedicated directory structure in the user's home directory (e.g., `~/.seekeraug/projects/[project_name]`)
3. Initialize versioning metadata to track all changes

The project structure would look something like this:

```
~/.seekeraug/projects/my_project/
├── database.sqlite           # Main database for project metadata
├── raw/                      # Original unmodified images
├── annotations/              # Annotation data in JSON format
├── versions/                 # Dataset versions
│   ├── v1_initial/
│   ├── v2_augmented/
│   └── ...
└── temp/                     # Temporary processing files
```

### 13.2 Continuous Saving Mechanism

To ensure no progress is lost, we'll implement several layers of protection:

#### 13.2.1 Real-time Annotation Saving

The application will use a multi-tiered saving approach:

1. **In-memory caching**: Temporary storage for active work
2. **Background auto-save**: All annotations saved to database every few seconds
3. **Explicit save points**: Created when completing significant milestones
4. **Transaction-based operations**: Ensures database operations are atomic

For annotations specifically, we'll implement:

```python
# On the Python backend
@app.route('/annotations/save', methods=['POST'])
def save_annotation():
    data = request.json
    image_id = data['image_id']
    annotations = data['annotations']
    
    # Start database transaction
    db.begin_transaction()
    try:
        # Save each annotation
        for annotation in annotations:
            db.save_annotation(image_id, annotation)
        
        # Commit transaction only if all saves successful
        db.commit_transaction()
        return jsonify({"status": "success"})
    except Exception as e:
        # Roll back on any error
        db.rollback_transaction()
        return jsonify({"status": "error", "message": str(e)})
```

In the Electron frontend, we'll implement automatic saving:

```javascript
// Auto-save timer
let saveTimeout = null;

// Called whenever an annotation changes
function handleAnnotationChange() {
  // Clear any pending save
  if (saveTimeout) clearTimeout(saveTimeout);
  
  // Schedule a new save in 2 seconds
  saveTimeout = setTimeout(() => {
    saveAnnotations();
    // Show saving indicator
    setSavingStatus('Saving...');
  }, 2000);
}

// Actual save function
async function saveAnnotations() {
  try {
    const response = await callPythonAPI('annotations/save', {
      image_id: currentImage.id,
      annotations: currentAnnotations
    });
    
    if (response.status === 'success') {
      setSavingStatus('All changes saved');
    } else {
      setSavingStatus('Error saving');
      // Show error notification
    }
  } catch (error) {
    // Handle connection errors, retry logic
    setSavingStatus('Connection error, retrying...');
    scheduleRetry();
  }
}
```

### 13.3 Data Management Without File System Exposure

The application will completely abstract away the file system from the user:

1. **Internal path management**: All paths handled by the application
2. **Database-driven navigation**: Images and annotations accessed via database queries
3. **Virtual dataset concept**: Users work with collections, not files
4. **Import/export abstraction**: Users don't need to know where files are stored

This is achieved through a data access layer that separates storage from application logic:

```python
class DataManager:
    def __init__(self, project_path):
        self.project_path = project_path
        self.db = Database(os.path.join(project_path, 'database.sqlite'))
    
    def import_images(self, image_paths):
        """Import images into the project"""
        for path in image_paths:
            # Generate unique ID
            image_id = generate_uuid()
            
            # Copy to raw folder with standardized name
            dest_path = os.path.join(self.project_path, 'raw', f"{image_id}{os.path.splitext(path)[1]}")
            shutil.copy2(path, dest_path)
            
            # Create thumbnail
            thumb_path = os.path.join(self.project_path, 'raw', 'thumbs', f"{image_id}.jpg")
            create_thumbnail(path, thumb_path)
            
            # Add to database
            self.db.add_image(image_id, dest_path, thumb_path)
```

### 13.4 Export Pipeline

The export system will be flexible and format-aware:

1. User selects export type (raw, annotated, augmented)
2. User chooses format (COCO, YOLO, Pascal VOC, etc.)
3. Application generates correctly formatted files
4. User specifies destination folder
5. Export runs with progress bar

For example, exporting to YOLO format:

```python
def export_yolo_format(project_id, output_path):
    # Create the output directory structure
    os.makedirs(os.path.join(output_path, 'images'), exist_ok=True)
    os.makedirs(os.path.join(output_path, 'labels'), exist_ok=True)
    
    # Get project data
    images = db.get_all_images(project_id)
    classes = db.get_all_classes(project_id)
    
    # Create class mapping file
    with open(os.path.join(output_path, 'classes.txt'), 'w') as f:
        for cls in classes:
            f.write(f"{cls.name}\n")
    
    # Process each image
    for image in images:
        # Copy image to output
        shutil.copy2(
            image.path, 
            os.path.join(output_path, 'images', os.path.basename(image.path))
        )
        
        # Get annotations
        annotations = db.get_annotations(image.id)
        
        # Convert to YOLO format and write
        yolo_annotations = convert_to_yolo(annotations, image.width, image.height)
        label_path = os.path.join(
            output_path, 
            'labels', 
            f"{os.path.splitext(os.path.basename(image.path))[0]}.txt"
        )
        
        with open(label_path, 'w') as f:
            for ann in yolo_annotations:
                f.write(f"{ann.class_id} {ann.x} {ann.y} {ann.width} {ann.height}\n")
```

### 13.5 Workflow Integration

The complete workflow will be integrated with clear transitions between stages:

1. **Image Collection** → **Annotation** → **Augmentation** → **Training**

At each stage, the user can move forward or backward, with their progress always preserved. The UI will provide clear visual indicators showing:

1. Which stage they're in
2. What's completed
3. What's next
4. Saving status

The underlying data model ensures that each version of the dataset (raw, annotated, augmented) is properly tracked and can be exported independently.

This approach gives users complete flexibility in their workflow while ensuring data integrity and preventing loss of work at any stage. By abstracting away file system operations and focusing on the logical workflow, we create an intuitive experience that feels like working with the data directly rather than managing files.

## 17. Getting Started with Development

Starting from an empty repository with this PRD, here's a comprehensive step-by-step guide to begin building SeekerAug:

### 17.1 Project Initialization and Structure

First, set up the basic project structure:

```bash
# Create directory structure
mkdir -p src/{main,renderer,python,shared}
mkdir -p assets/icons

# Initialize package.json
npm init -y

# Create basic gitignore
echo "node_modules/\ndist/\n.vscode/\n__pycache__/\n*.pyc\nvenv/\nenv/\n.DS_Store" > .gitignore
```

### 17.2 Install Core Dependencies

Next, install the necessary Electron and development dependencies:

```bash
# Install Electron and development tools
npm install --save-dev electron electron-builder typescript webpack webpack-cli ts-loader
npm install --save-dev @types/node @types/react @types/react-dom
npm install --save react react-dom

# Install communication libraries for Python bridge
npm install --save zeromq electron-is-dev
```

### 17.3 Configure TypeScript and Project Settings

Create TypeScript configuration:

```bash
# Create tsconfig.json
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}' > tsconfig.json
```

### 17.4 Create Basic Electron Configuration Files

Create the main entry files:

```bash
# Create main process file
echo 'const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});' > src/main/index.js

# Create basic HTML template
echo '<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>SeekerAug</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./renderer.js"></script>
  </body>
</html>' > src/renderer/index.html
```

### 17.5 Set Up Python Environment

Create a Python virtual environment and install core dependencies:

```bash
# Create Python virtual environment
python -m venv env

# Activate environment (use appropriate command for your shell)
source env/bin/activate  # Linux/macOS
# or
.\env\Scripts\activate  # Windows

# Install Python dependencies
pip install flask flask-socketio numpy opencv-python pillow 
pip install pyzmq pynvml albumentations ultralytics
```

### 17.6 Create Python Service Skeleton

Set up a basic Flask API server to bridge with Electron:

```bash
# Create Python API server
echo 'from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import os
import sys
import numpy as np
import cv2

# Initialize Flask app and Socket.IO
app = Flask(__name__)
app.config["SECRET_KEY"] = "seekeraugsecret"
socketio = SocketIO(app, cors_allowed_origins="*")

# Basic health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

# Sample annotation endpoint
@app.route("/annotations/load", methods=["POST"])
def load_annotations():
    """Load annotations for an image"""
    data = request.json
    # Implementation will go here
    return jsonify({"result": "OK"})

# Start server if run directly
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host="127.0.0.1", port=port, debug=True)' > src/python/api.py
```

### 17.7 Create Python-Electron Bridge

Set up the communication bridge between Electron and Python:

```bash
# Create Python process manager in Electron
echo 'const { spawn } = require("child_process");
const path = require("path");
const isDev = require("electron-is-dev");

class PythonBridge {
  constructor() {
    this.pythonProcess = null;
    this.isRunning = false;
    this.port = 5000;
  }

  start() {
    if (this.isRunning) return;

    // Determine Python path and script location
    const pythonPath = isDev
      ? "python" // Use system Python in development
      : path.join(process.resourcesPath, "python", "bin", "python"); // Use bundled Python in production

    const scriptPath = isDev
      ? path.join(__dirname, "../python/api.py")
      : path.join(process.resourcesPath, "app", "python", "api.py");

    // Start Python process
    this.pythonProcess = spawn(pythonPath, [scriptPath], {
      env: { ...process.env, PORT: this.port.toString() }
    });

    // Handle output
    this.pythonProcess.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
    });

    this.pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    this.pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      this.isRunning = false;
    });

    this.isRunning = true;
  }

  stop() {
    if (!this.isRunning) return;
    
    this.pythonProcess.kill();
    this.isRunning = false;
  }
}

module.exports = new PythonBridge();' > src/main/python-bridge.js
```

### 17.8 Update package.json Scripts

Add useful npm scripts to your package.json:

```bash
# Update package.json scripts section
cat <<EOF > temp.json
{
  "scripts": {
    "start": "electron .",
    "dev": "concurrently \"npm run dev:react\" \"npm run dev:electron\"",
    "dev:react": "webpack --config webpack.config.js --watch",
    "dev:electron": "electron .",
    "build": "webpack --config webpack.config.js && electron-builder",
    "build:deb": "webpack --config webpack.config.js && electron-builder --linux deb"
  }
}
EOF

# Merge with existing package.json using jq (install if needed)
jq -s '.[0] * .[1]' package.json temp.json > package.json.new
mv package.json.new package.json
rm temp.json
```

### 17.9 Set Up Webpack Configuration

Create webpack configuration for bundling:

```bash
# Create webpack.config.js
echo 'const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/renderer/index.tsx",
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "src"),
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "renderer.js"
  }
};' > webpack.config.js
```

### 17.10 Create React Entry Point

Set up the React application entry point:

```bash
# Create React entry point
echo 'import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);' > src/renderer/index.tsx

# Create basic App component
echo 'import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    // Check if Python API is running
    fetch("http://localhost:5000/health")
      .then(response => response.json())
      .then(data => {
        setStatus("Connected to Python backend");
      })
      .catch(error => {
        setStatus("Failed to connect to Python backend");
        console.error("Error connecting to Python API:", error);
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>SeekerAug</h1>
        <p>Computer Vision Development Suite</p>
      </header>
      <main>
        <div className="status-indicator">
          Backend Status: {status}
        </div>
        <div className="welcome-container">
          <h2>Welcome to SeekerAug</h2>
          <p>Your local computer vision workflow tool</p>
        </div>
      </main>
    </div>
  );
};

export default App;' > src/renderer/App.tsx

# Create basic styles
echo 'body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #121212;
  color: #ffffff;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #1E1E1E;
  padding: 16px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

main {
  flex: 1;
  padding: 24px;
}

.status-indicator {
  background-color: #333333;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 24px;
}

.welcome-container {
  background-color: #1E1E1E;
  padding: 24px;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}' > src/renderer/styles.css
```

### 17.11 Set Up Electron Builder Configuration

Configure Electron Builder for creating installable packages:

```bash
# Add electron-builder configuration to package.json
cat <<EOF > temp.json
{
  "build": {
    "appId": "com.seekerapp.app",
    "productName": "SeekerAug",
    "files": [
      "dist/**/*",
      "src/renderer/index.html",
      "src/python/**/*",
      "package.json"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "release"
    },
    "linux": {
      "target": ["deb"],
      "category": "Graphics",
      "synopsis": "Computer Vision Development Suite",
      "description": "A complete local workflow for computer vision development - from annotation to training.",
      "desktop": {
        "Name": "SeekerAug",
        "Comment": "Computer Vision Development Suite",
        "Categories": "Graphics;Development"
      }
    }
  }
}
EOF

# Merge with existing package.json using jq
jq -s '.[0] * .[1]' package.json temp.json > package.json.new
mv package.json.new package.json
rm temp.json
```

### 17.12 Create Python Module Structure

Organize Python code into modules:

```bash
# Create Python module structure
mkdir -p src/python/{annotation,augmentation,dataset,training,utils}

# Create __init__.py files to make directories Python modules
touch src/python/__init__.py
touch src/python/annotation/__init__.py
touch src/python/augmentation/__init__.py
touch src/python/dataset/__init__.py
touch src/python/training/__init__.py
touch src/python/utils/__init__.py

# Create basic utility module
echo 'import cv2
import numpy as np
import os
from pathlib import Path

class ImageUtils:
    """Utility functions for image processing"""
    
    @staticmethod
    def load_image(path):
        """Load an image from disk"""
        img = cv2.imread(str(path))
        if img is None:
            raise ValueError(f"Could not load image: {path}")
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    @staticmethod
    def save_image(img, path):
        """Save an image to disk"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        if len(img.shape) == 3 and img.shape[2] == 3:
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        return cv2.imwrite(str(path), img)' > src/python/utils/image_utils.py
```

### 17.13 Implement Initial Python Modules

Create a skeleton for the annotation module based on your previous visualization tool:

```bash
# Create annotation module skeleton
echo 'import cv2
import numpy as np
from pathlib import Path
import json

class BoundingBox:
    """Represents a bounding box or polygon annotation"""
    
    def __init__(self, obj_class, points, is_polygon=False):
        self.obj_class = obj_class
        self.points = points
        self.is_polygon = is_polygon
    
    @classmethod
    def from_yolo_line(cls, line, width, height):
        """Create bounding box from YOLO format line"""
        values = [float(x) for x in line.strip().split()]
        obj_class = int(values[0])
        points = []
        is_polygon = len(values) > 9  # More than 4 points = polygon
        
        for i in range(1, len(values), 2):
            x = values[i] * width
            y = values[i + 1] * height
            points.append((x, y))
        
        return cls(obj_class, points, is_polygon)
    
    def to_yolo(self, width, height):
        """Convert to YOLO format"""
        result = [self.obj_class]
        for x, y in self.points:
            result.extend([x / width, y / height])
        return result

class AnnotationManager:
    """Manages annotation operations"""
    
    def __init__(self):
        self.class_names = []
        self.class_colors = []
    
    def load_annotations(self, image_path):
        """Load annotations for an image"""
        image_path = Path(image_path)
        
        # Try to find label file
        label_path = image_path.with_suffix(".txt")
        if not label_path.exists():
            # Try in labels subdirectory
            label_path = image_path.parent.parent / "labels" / f"{image_path.stem}.txt"
        
        # Load image to get dimensions
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        height, width = image.shape[:2]
        
        # Load annotations
        boxes = []
        if label_path.exists():
            with open(label_path, "r") as f:
                for line in f:
                    if line.strip():
                        box = BoundingBox.from_yolo_line(line, width, height)
                        boxes.append(box)
        
        return boxes, width, height
    
    def save_annotations(self, image_path, boxes, width, height):
        """Save annotations for an image"""
        image_path = Path(image_path)
        
        # Determine label path
        label_path = image_path.with_suffix(".txt")
        
        # Create parent directory if it doesn\'t exist
        label_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save annotations
        with open(label_path, "w") as f:
            for box in boxes:
                yolo_format = box.to_yolo(width, height)
                f.write(" ".join(map(str, yolo_format)) + "\\n")
        
        return True' > src/python/annotation/manager.py
```

### 17.14 Build a Basic Transformation Module

Create a foundation for the augmentation module:

```bash
# Create transformation module skeleton
echo 'import cv2
import numpy as np
from pathlib import Path

class ImageTransformer:
    """Handles image transformations"""
    
    @staticmethod
    def rotate(image, angle):
        """Rotate image by angle degrees"""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, matrix, (w, h))
    
    @staticmethod
    def flip(image, horizontal=True):
        """Flip image horizontally or vertically"""
        if horizontal:
            return cv2.flip(image, 1)  # 1 for horizontal flip
        return cv2.flip(image, 0)      # 0 for vertical flip
    
    @staticmethod
    def to_grayscale(image):
        """Convert image to grayscale"""
        if len(image.shape) == 2:  # Already grayscale
            return image
        return cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    
    @staticmethod
    def add_noise(image, sigma=25):
        """Add Gaussian noise to image"""
        noise = np.random.normal(0, sigma, image.shape).astype(np.uint8)
        noisy = cv2.add(image, noise)
        return noisy
    
    @staticmethod
    def gaussian_blur(image, kernel_size=5):
        """Apply Gaussian blur"""
        return cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)

class AugmentationPipeline:
    """Manages a sequence of image transformations"""
    
    def __init__(self):
        self.transformer = ImageTransformer()
        self.steps = []
    
    def add_step(self, transform_type, params):
        """Add transformation step to pipeline"""
        self.steps.append({
            "type": transform_type,
            "params": params
        })
    
    def clear(self):
        """Clear all steps from pipeline"""
        self.steps = []
    
    def apply(self, image):
        """Apply all transformations in pipeline to image"""
        result = image.copy()
        
        for step in self.steps:
            transform_type = step["type"]
            params = step["params"]
            
            if transform_type == "rotate":
                result = self.transformer.rotate(result, params["angle"])
            elif transform_type == "flip":
                result = self.transformer.flip(result, params["horizontal"])
            elif transform_type == "grayscale":
                result = self.transformer.to_grayscale(result)
            elif transform_type == "noise":
                result = self.transformer.add_noise(result, params["sigma"])
            elif transform_type == "blur":
                result = self.transformer.gaussian_blur(result, params["kernel_size"])
        
        return result' > src/python/augmentation/transformer.py
```

### 17.15 Run the Development Environment

Now you can start the development environment:

```bash
# Install concurrently for running multiple npm scripts
npm install --save-dev concurrently

# Start the development server
npm run dev
```

### 17.16 Next Steps

After this initial setup, you should have a basic Electron application with a React frontend and Python backend communication bridge. From here, you can:

1. Implement the core functionality modules one by one
2. Develop the user interface components according to the design guidelines
3. Build the annotation, augmentation, and training workflows
4. Create the database layer for project management
5. Implement GPU integration for accelerated processing
6. Set up packaging and installation scripts

This foundation follows the architecture outlined in the PRD and provides you with a functional starting point from which to build the complete SeekerAug application.

## 18. Conclusion

SeekerAug aims to provide a comprehensive, locally-run alternative to Roboflow for computer vision development. By leveraging the strengths of Electron for the UI and Python for vision processing, the application will provide a seamless experience for users while maintaining complete local operation.

The implementation plan outlined here provides a solid foundation for development. By focusing on user experience and robust technical architecture, SeekerAug can become a valuable tool for computer vision practitioners who prefer or require local processing capabilities.



