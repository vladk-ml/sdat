## Integration with Image Processing Pipeline

### 1. Annotation Transfer During Augmentation

When images are augmented, their annotations must be properly transformed to match:

```typescript
// Example function to transform annotations during augmentation
function transformAnnotations(
  annotations: Annotation[], 
  transformation: Transformation, 
  sourceImageId: string,
  targetImageId: string
): Annotation[] {
  return annotations.map(annotation => {
    // Create a new annotation object with copied base properties
    const newAnnotation: Annotation = {
      id: generateUUID(),
      type: annotation.type,
      class: annotation.class,
      parentId: annotation.id, // Reference original annotation as parent
      imageId: targetImageId,
      metadata: {
        ...annotation.metadata,
        createdAt: new Date(),
        modifiedAt: new Date(),
        transformations: [
          ...annotation.metadata.transformations,
          transformation
        ],
        usageStatus: annotation.metadata.usageStatus, // Inherit usage status
        source: 'transformation'
      }
    };
    
    // Transform coordinates based on transformation type
    switch (transformation.type) {
      case 'flip-horizontal':
        newAnnotation.coordinates = flipHorizontalCoordinates(
          annotation.coordinates, 
          sourceImageMetadata.width
        );
        break;
      case 'rotate':
        newAnnotation.coordinates = rotateCoordinates(
          annotation.coordinates,
          transformation.parameters.angle,
          sourceImageMetadata.width,
          sourceImageMetadata.height
        );
        break;
      // Additional transformation types...
      default:
        newAnnotation.coordinates = annotation.coordinates;
    }
    
    return newAnnotation;
  });
}
```

### 2. Cross-Dataset Visualization

Implement a specialized view to show annotations across different stages of the pipeline:

1. **Side-by-Side Comparison**:
   - Original image with annotations next to augmented/refined versions
   - Highlighting of corresponding annotations
   - Interactive selection that highlights related annotations

2. **Annotation Tree View**:
   - Hierarchical visualization of annotation relationships
   - Filtering options to focus on specific branches
   - Heat map visualization showing annotation density

## Exporting and Interoperability

### 1. Export Formats

Support exporting annotations in various formats while preserving lineage metadata:

- **Standard Formats**:
  - COCO JSON
  - YOLO TXT
  - Pascal VOC XML
  - CSV

- **SeekerAug Format**:
  - Extended JSON format that includes all lineage information
  - Full transformation history
  - Usage marking data
  - Complete parent-child relationships

### 2. Import with Lineage Recovery

When importing annotations from external sources, implement smart recovery of lineage:

- **Coordinate Matching**: Match annotations by coordinate similarity
- **Class Matching**: Use class information to improve matching
- **Confidence Scoring**: Assign confidence scores to potential matches
- **Manual Review Interface**: Allow users to review and correct automatic matches

## Performance Considerations

### 1. Database Optimization

Optimize the database schema for efficient lineage queries:

- **Indexing**: Create indices on parentId, imageId, and other frequently queried fields
- **Denormalization**: Store precomputed lineage information for frequently accessed relationships
- **Caching**: Implement a caching layer for expensive lineage queries
- **Pagination**: Use cursor-based pagination for large annotation sets

### 2. UI Performance

Ensure the UI remains responsive even with complex lineage visualization:

- **Virtualized Rendering**: Only render visible annotations and lineage nodes
- **Progressive Loading**: Load lineage information progressively as needed
- **Web Workers**: Offload complex lineage calculations to background threads
- **GPU Acceleration**: Use WebGL for lineage visualization rendering

## Conclusion

This annotation system design provides SeekerAug with a powerful, local-first solution that maintains complete data lineage throughout the computer vision workflow. By focusing on tracking relationships between datasets and implementing an intuitive usage marking system, SeekerAug will offer users unprecedented control and visibility into their annotation process.

The combination of efficient annotation tools, AI assistance, and robust lineage tracking creates a unique value proposition that differentiates SeekerAug from cloud-based alternatives while delivering a professional, VS Code-inspired user experience optimized for ultrawidescreen workflows.# SeekerAug Annotation Tool Implementation Guide

## Overview

This guide outlines how to implement a robust annotation system for SeekerAug, inspired by Roboflow's annotation capabilities but designed for a local-only workflow with complete data lineage tracking.

## Key Components

### 1. Core Annotation Features

SeekerAug should support both bounding box and polygon annotations as primary annotation types. While bounding boxes are faster to create, polygons provide more precision for certain tasks, particularly segmentation.

#### Annotation Tools to Implement:

- **Bounding Box Tool**: For quick rectangular annotations
- **Polygon Tool**: For precise shape tracing
- **Smart Polygon Tool**: AI-assisted polygon creation with minimal clicks
- **Selection Tool**: For selecting, moving, and editing existing annotations
- **Class Selector**: For assigning categories to annotations

### 2. AI-Assisted Annotation

Implement these AI-assisted features for efficient annotation:

- **Label Assist**: A feature that uses previously trained model checkpoints to suggest annotations
- **Smart Polygon**: Leverage the Segment Anything Model (SAM) to create polygon annotations with just a few clicks
- **Auto Label**: Automated labeling system that can process batches of images using foundation models

### 3. Technical Implementation Approach

The annotation system should be built using:

1. **Canvas Rendering**:
   - Use a WebGL-based rendering engine for high-performance display of large images
   - Support for zooming, panning, and rotation with hardware acceleration
   - Implement separate rendering layers for image, annotations, and UI elements

2. **Data Structures**:
   - Efficient in-memory representation of annotations for real-time manipulation
   - Background synchronization with SQLite database
   - Optimized data structures for large datasets (thousands of annotations)

3. **Backend Processing**:
   - Python-based annotation processing using OpenCV
   - Integration with PyTorch for AI-assisted annotation
   - ZeroMQ for high-performance communication between frontend and backend

### 4. Annotation Interface

The annotation interface should include:

- **Canvas Area**: Central workspace where image and annotations are displayed
- **Toolbar**: Contains annotation tools and options
- **Class Panel**: Shows available classes and allows class management
- **History Panel**: Shows annotation history and parentage
- **Metadata Panel**: Shows image information and annotation statistics

#### Interface Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Annotation Tools] [View Options] [AI Assist] [Save] [Export]               │
├──────────┬──────────────────────────────────────────┬────────────────────┤
│          │                                          │                    │
│ CLASSES  │                                          │ ANNOTATION DATA    │
│ ├─ Person│                                          │                    │
│ │  ├─ Head                                          │ Selected:          │
│ │  ├─ Body│                                         │ Class: Person/Head │
│ │  └─ Legs│                                         │ Type: Polygon      │
│ ├─ Vehicle                                          │ Coordinates: [...]│
│ │  ├─ Car │                                         │                    │
│ │  └─ Truck            [Canvas Area]                │ HISTORY            │
│ └─ Animal │                                         │                    │
│    ├─ Dog │          Image + Annotations            │ Created: 2023-05-12│
│    └─ Cat │                                         │ Modified: 2023-05-13│
│          │                                          │ Parent: cat_001.jpg│
│ TOOLS    │                                          │ Children: 3        │
│ ├─ Box   │                                          │                    │
│ ├─ Polygon│                                         │ LINEAGE            │
│ ├─ Smart │                                          │ [Lineage Graph]    │
│ └─ Select│                                          │                    │
├──────────┴──────────────────────────────────────────┴────────────────────┤
│ Saved | cat_001.jpg | 3 annotations | Used: 2 | Unused: 1                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Keyboard Shortcuts and Efficiency Features

Implement an efficient keyboard shortcut system for fast annotation that includes shortcuts for selecting tools, manipulating annotations, and navigating between images.

Key shortcuts to implement:
- **B**: Switch to Bounding Box tool
- **P**: Switch to Polygon tool
- **S**: Switch to Smart Polygon tool
- **V**: Switch to Selection tool
- **Delete/Backspace**: Remove selected annotation
- **Ctrl+Z**: Undo last action
- **Ctrl+Y**: Redo last action
- **Arrow keys**: Navigate between images
- **Number keys (1-9)**: Quick select annotation classes
- **Space+Drag**: Pan the canvas
- **Ctrl+Wheel**: Zoom in/out
- **Shift+Drag**: Select multiple annotations
- **Ctrl+C/Ctrl+V**: Copy/paste annotations
- **U**: Mark selected annotation as unused/used
- **L**: Show lineage of selected annotation

### 6. Annotation Workflow

A streamlined annotation workflow should include:

1. **Image Selection**: Select images to annotate from dataset view
2. **Annotation Creation**: Draw annotations using appropriate tools
3. **Class Assignment**: Assign classes to annotations
4. **Verification**: Review and adjust annotations as needed
5. **Batch Operations**: Apply changes across multiple images
6. **Lineage Tracking**: Record relationships between annotations

### 7. Usage Marking System

Implement a usage marking system that allows users to selectively include or exclude annotations:

#### Features:

1. **Mark/Unmark UI**:
   - Visual indicators for used/unused status
   - Bulk marking operations for multiple annotations
   - Filtering options to show only used or unused items

2. **Inheritance Rules**:
   - When marking a parent annotation as unused:
     - All child annotations are automatically marked as unused
     - Visual indicators show inherited unused status
     - Option to override for specific children
   - When marking a previously unused annotation as used:
     - Option to restore all child annotations
     - Smart suggestions for which children to restore

3. **Database Implementation**:

```typescript
// Function to mark annotation as unused
async function markAnnotationAsUnused(annotationId: string, recursive = true) {
  // Update the current annotation
  await db.annotations.update(
    { id: annotationId },
    { $set: { 'metadata.usageStatus': 'unused' } }
  );
  
  // If recursive, mark all children as unused
  if (recursive) {
    const childIds = await getAllChildrenIds(annotationId);
    await db.annotations.updateMany(
      { id: { $in: childIds } },
      { $set: { 'metadata.usageStatus': 'unused' } }
    );
  }
}

// Function to mark annotation as used
async function markAnnotationAsUsed(annotationId: string, recursive = false) {
  // Update the current annotation
  await db.annotations.update(
    { id: annotationId },
    { $set: { 'metadata.usageStatus': 'used' } }
  );
  
  // If recursive, mark selected children as used
  if (recursive) {
    // This could implement smart logic to determine which
    // children should be marked as used based on transformations
    const childIdsToRestore = await getRecommendedChildrenToRestore(annotationId);
    await db.annotations.updateMany(
      { id: { $in: childIdsToRestore } },
      { $set: { 'metadata.usageStatus': 'used' } }
    );
  }
}
```

## Data Lineage Implementation

### Parent-Child Relationships

The core of SeekerAug's differentiation is robust lineage tracking:

1. **Annotation Data Structure**:
```typescript
interface Annotation {
  id: string;
  type: 'box' | 'polygon';
  coordinates: number[][];
  class: string;
  parentId?: string;  // Reference to parent annotation if derived
  imageId: string;    // Reference to image this annotation belongs to
  metadata: {
    createdAt: Date;
    modifiedAt: Date;
    transformations: Transformation[];
    usageStatus: 'used' | 'unused';
    confidence?: number;  // For AI-assisted annotations
    source: 'manual' | 'ai-assisted' | 'auto-label'; // Origin of annotation
  };
}

interface Transformation {
  type: string;       // e.g., 'flip', 'rotate', 'crop', etc.
  parameters: any;    // Parameters of the transformation
  appliedAt: Date;    // When the transformation was applied
  appliedBy: string;  // User or system that applied the transformation
}
```

2. **Tracking Mechanisms**:
   - Each annotation stores its parent ID
   - Full history of transformations is recorded
   - Usage status propagates from parent to child
   - UI shows visual indicators of lineage and usage status
   - Database queries can traverse the parent-child tree in either direction

### Lineage Visualization

Implement a dedicated lineage view that shows:

1. **Ancestry Tree**: Visual representation of parent-child relationships
2. **Transformation Timeline**: Chronological view of all changes applied
3. **Impact Analysis**: Shows how changes to a parent would affect children
4. **Filtering**: Filter by transformation type, date, or usage status

```typescript
// Example database query to get full lineage tree for an annotation
function getAnnotationLineage(annotationId: string): AnnotationNode[] {
  // Get ancestors (parents)
  const ancestors = [];
  let currentId = annotationId;
  
  while (currentId) {
    const parent = db.annotations.findOne({ id: currentId });
    if (parent && parent.parentId) {
      ancestors.unshift(parent);
      currentId = parent.parentId;
    } else {
      break;
    }
  }
  
  // Get descendants (children)
  const descendants = getAllDescendants(annotationId);
  
  return {
    ancestors,
    current: db.annotations.findOne({ id: annotationId }),
    descendants
  };
}

function getAllDescendants(annotationId: string): AnnotationNode[] {
  const children = db.annotations.find({ parentId: annotationId });
  
  return children.flatMap(child => ({
    annotation: child,
    children: getAllDescendants(child.id)
  }));
}
```