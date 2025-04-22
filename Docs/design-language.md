# SeekerAug Design Language & UI/UX Guidelines

## Application Window Structure

### Welcome Page (VS Code Style)
- Application opens to a professional welcome page with:
  - **Create New Project** button
  - **Open Recent Project** list with timestamps
  - **Open Project from Folder** button
  - Quick access to documentation/tutorials
  - Recent activity summary

### Main Layout Components (Post-Project Selection)
1. **Left Sidebar/Explorer Pane**
   - Always visible, resizable (collapsible to icons-only)
   - Shows dataset types (raw, refined, annotated, augmented)
   - Quick actions for dataset operations
   - No dropdowns for image lists (handled in tabs instead)
   - Export/open directory buttons for each dataset type

2. **Tabbed Workspace (Center)**
   - Main content area where work happens
   - Shows a project dashboard when no tabs are open
   - Tabs can be reordered, closed, and potentially split
   - Each dataset opens as a tab, not in the explorer

3. **Right Context Panel** (optional)
   - Properties, metadata, and context-sensitive tools
   - Can be toggled open/closed
   - Changes based on active tab and selected content

4. **Status Bar (Bottom)**
   - Shows current project, operation status, notifications
   - Quick access to settings, hardware status (GPU)
   - Progress indicators for background operations

5. **Command Bar (Top)**
   - Search/command palette accessible via Ctrl+P or similar
   - Global actions and quick navigation

## File Explorer & Dataset Interaction

### Key Behaviors
- Explorer shows **dataset types only** - not individual images
- Each dataset type has:
  - **Open in File Explorer** button - opens OS file explorer to that directory
  - **Export Dataset** button - exports dataset with metadata to chosen location
- Clicking a dataset in explorer opens it as a tab with grid view
- Within the tab: options to switch to list view, search, filter, etc.
- Clicking an image in grid/list either:
  - Changes the current tab to image viewer for that image
  - Opens a new tab with that image (configurable preference)
- Clear visual indicators show which dataset type you're viewing
- Explorer remains focused on organization, not content browsing

### Dataset Representation
- Explorer shows dataset categories (Raw, Refined, Annotated, Augmented)
- Badges show counts next to dataset names
- Color coding differentiates dataset types
- Status indicators show processed/unprocessed state

## Dataset Lineage & Relationship Tracking

### Parent-Child Relationships
- **Raw Dataset as Root Parent**: All datasets stem from the raw dataset
  - Raw dataset is preserved in its original form
  - Each transformation creates a child dataset
  - Complete ancestry maintained for every derived image
- **Lineage Visualization**: Interactive graph showing dataset relationships
  - Timeline view of transformations
  - Branching visualization for different processing paths
  - Filter by specific transformations or time periods

### Image History Tracking
- Every augmented/refined image maintains references to its parent
- Full transformation history recorded for each image
- Ability to trace any image back to its raw source
- Comparison views to see before/after for any transformation

### Annotation Lineage
- Annotations maintain parent-child relationships
- When an annotation is modified:
  - Original annotation is preserved
  - New version is created with reference to parent
  - Full history of changes maintained
- When raw/refined images are annotated, those annotations become parents of annotations in augmented images

### Cross-Dataset Referencing
- Click on any image to see:
  - Its raw parent
  - Its refined version
  - Its annotations
  - Its augmented versions
- Click on any annotation to see:
  - Parent annotation (if applicable)
  - Child annotations in augmented images
  - Full transformation history applied to it

## Selective Usage System

### Usage Marking
- Mark any image or annotation as "used" or "unused" at any stage
  - Any dataset type (raw, refined, annotated, augmented)
  - Visual indicators show usage status
  - Batch operations for marking multiple items
  - Smart filters for finding unused items

### Inheritance Rules
- **Downward Propagation**: When marking an item as unused
  - All child items are automatically marked as unused
  - Visual indicators show inherited unused status
  - Can be overridden if needed
- **Restoration**: When marking an unused item as used
  - Option to restore child items or keep them unused
  - Smart suggestions for which children to restore

### Usage in Training
- Training automatically respects usage markers
- Clear indicators of which images are included/excluded
- Statistics showing used vs. unused proportions
- Ability to create dataset versions with different usage patterns

### Usage Management UI
- Dedicated panel for managing usage status
- Bulk operations for efficient workflow
- Filter by usage status across all datasets
- Search by usage reason or notes

## Annotation Interface Design

### Annotation Studio Tab
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SeekerAug] File Edit View Tools Help                    [Command Palette]  │
├──────────┬──────────────────────────────────────────┬────────────────────┤
│          │ Annotation Studio: dog_001.jpg  [History] [AI Assist]          │
│ DATASETS │ ┌────────────────────────────────────┐   │ ANNOTATION         │
│ ├─ Raw   │ │                                    │   │                    │
│   [📁]   │ │                                    │   │ Class: Dog         │
│   [⬇️]   │ │                                    │   │ ├─ Face [Selected] │
│ ├─ Refined│ │                                    │   │ ├─ Body            │
│   [📁]   │ │          [Image with               │   │ ├─ Tail            │
│   [⬇️]   │ │           active annotation]       │   │ └─ Legs            │
│ ├─ Annotated│ │                                    │   │                    │
│   [📁]   │ │                                    │   │ TOOLS              │
│   [⬇️]   │ │                                    │   │ ├─ Box             │
│ └─ Augmented│ └────────────────────────────────────┘   │ ├─ Polygon         │
│   [📁]   │                                          │ ├─ Auto Detect     │
│   [⬇️]   │ History:                                 │ └─ Mask           │
│          │ ├─ Raw Image Import (2023-05-12)        │                    │
│ MODELS   │ ├─ Refined to JPEG (2023-05-12)         │ METADATA           │
│ [📁]     │ └─ Previous Annotations (2)             │ Class Count: 1     │
│ [⬇️]     │                                          │ Objects: 3         │
├──────────┴──────────────────────────────────────────┴────────────────────┤
│ Auto-save: Up to date                                   GPU: Active      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tools & Features

1. **Drawing Tools**
   - Bounding Box: Standard rectangular regions
   - Polygon: Precise shape tracing for irregular objects
   - Brush/Eraser: For segmentation masks
   - Smart Select: AI-assisted object boundary detection
   - Point: For landmark and keypoint detection

2. **Class Management**
   - Hierarchical class structure
   - Color coding for classes
   - Quick class selection
   - Class filters for visibility

3. **AI Assistance**
   - Auto-detection suggestions
   - Boundary refinement
   - Smart polygon placement
   - One-click whole image detection
   - Active learning integration

4. **Annotation History**
   - Timeline of changes
   - Revert to previous versions
   - Compare annotations over time
   - Audit trail of modifications

### Annotation Workflow Optimization

1. **Keyboard Shortcuts**
   - Class selection (number keys)
   - Tool switching (B for box, P for polygon, etc.)
   - Navigating images (arrow keys)
   - Manipulation (delete, copy, paste)

2. **Batch Operations**
   - Copy annotations to similar images
   - Multi-select for bulk editing
   - Apply same class to multiple annotations
   - Bulk verification of AI-assisted annotations

3. **Review Process**
   - Comment on annotations
   - Mark for review
   - Approval workflows
   - Quality metrics

### Augmentation Studio Tab
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SeekerAug] File Edit View Tools Help                    [Command Palette]  │
├──────────┬──────────────────────────────────────────┬────────────────────┤
│          │ Augmentation Studio: dog_001.jpg  [Preview All] [Apply]        │
│ DATASETS │ ┌────────────────┐ ┌────────────────┐   │ AUGMENTATION PIPELINE│
│ ├─ Raw   │ │                │ │                │   │                    │
│   [📁]   │ │                │ │                │   │ 1. Flip Horizontal │
│   [⬇️]   │ │  Original      │ │  Preview       │   │ 2. Rotate 15°      │
│ ├─ Refined│ │  Image        │ │  Augmented     │   │ 3. Brightness +10% │
│   [📁]   │ │                │ │                │   │                    │
│   [⬇️]   │ │                │ │                │   │ [+ Add Step]       │
│ ├─ Annotated│ └────────────────┘ └────────────────┘   │                    │
│   [📁]   │                                          │ OPTIONS            │
│   [⬇️]   │ AVAILABLE AUGMENTATIONS                  │                    │
│ └─ Augmented│ ┌─────────┐ ┌─────────┐ ┌─────────┐     │ Copies: 3         │
│   [📁]   │ │ Flip    │ │ Rotate  │ │ Crop    │     │ Random Seed: 42   │
│   [⬇️]   │ └─────────┘ └─────────┘ └─────────┘     │ Apply to: All     │
│          │ ┌─────────┐ ┌─────────┐ ┌─────────┐     │ Keep Original: Yes │
│ MODELS   │ │ Color   │ │ Noise   │ │ Blur    │     │                    │
│ [📁]     │ └─────────┘ └─────────┘ └─────────┘     │ [Save Pipeline]    │
│ [⬇️]     │                                          │ [Load Pipeline]    │
├──────────┴──────────────────────────────────────────┴────────────────────┤
│ Ready to apply augmentations                            GPU: Active      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Augmentation Features

1. **Pipeline Builder**
   - Drag-and-drop augmentation steps
   - Reorder operations
   - Adjust parameters for each step
   - Save/load augmentation pipelines

2. **Previewing**
   - Real-time preview of augmentations
   - Before/after comparison
   - Grid view of multiple augmentations
   - Annotation preview (how annotations transform)

3. **Batch Processing**
   - Apply to entire dataset
   - Apply to selection
   - Progress tracking for large datasets
   - GPU acceleration for processing

4. **Smart Augmentation**
   - Class-aware augmentation suggestions
   - Balance augmentations based on class distribution
   - Auto-augmentation for underrepresented classes
   - Preview impact on dataset balance

## Workflow Navigation

### Stage Progression
- Clear visual indicators of current workflow stage:
  ```
  [IMPORT] → [REFINE] → [ANNOTATE] → [AUGMENT] → [TRAIN] → [EXPORT]
  ```
- Status indicators showing completion state of each stage
- One-click progression between stages when prerequisites are met
- Option to jump directly to a stage if prerequisites are satisfied

### Workflow Stages in Detail

#### 1. Import
- Add images to raw dataset (preserve originals)
- View dataset summary and statistics
- Check for common issues (duplicates, corruptions)
- Begin tracking dataset history

#### 2. Refine
- Convert to standard formats (e.g., JPG)
- Extract and organize metadata
- Basic image corrections
- Dataset preparation for annotation

#### 3. Annotate
- Manual annotation tools
- AI-assisted annotation
- Annotation validation
- Class management

#### 4. Augment
- Build augmentation pipelines
- Preview augmentations
- Generate augmented datasets
- Version control for augmentations

#### 5. Train
- Model selection
- Training configuration
- Performance monitoring
- Model evaluation

#### 6. Export
- Export datasets in various formats
- Export trained models
- Export project configuration
- Documentation generation

### Context-Sensitive Actions
- Right-click menus adapt to selected content
- Toolbar changes based on active tab type
- Command palette filters suggestions by context
- Keyboard shortcuts optimized for each workflow stage

## Design Rules & Theme

### Professional Aesthetic
- Dark theme as default (reduced eye strain)
- High contrast for important elements
- Accent colors for actions and status indicators
- Color coding for different dataset types
- Information density suited for professional work

### Ultrawide Optimization
- Horizontal layouts that utilize width effectively
- Side-by-side view options
- Multi-panel layouts that scale with available space
- Tab arrangements that maximize horizontal space

### Typography & Visual Elements
- Monospace for technical information
- Sans-serif for UI elements
- Clear visual hierarchy through sizing and weight
- Consistent iconography throughout
- Subtle animations for state changes

## Critical Workflows

### Dataset Viewing
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SeekerAug] File Edit View Tools Help                    [Command Palette]  │
├──────────┬──────────────────────────────────────────┬────────────────────┤
│          │ Project A > Raw Dataset  [Grid] [List] [Search]                │
│ PROJECTS │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │ PROPERTIES         │
│ ├─ Proj1 │ │      │ │      │ │      │ │      │     │                    │
│   ├─ Raw │ │ Img1 │ │ Img2 │ │ Img3 │ │ Img4 │     │ Selected: 3 items  │
│   ├─ Ref │ └──────┘ └──────┘ └──────┘ └──────┘     │                    │
│   └─ Aug │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │ Total Size: 24 MB  │
│ └─ Proj2 │ │      │ │      │ │      │ │      │     │ Dimensions: Mixed  │
│   ├─ Raw │ │ Img5 │ │ Img6 │ │ Img7 │ │ Img8 │     │                    │
│   └─ Ref │ └──────┘ └──────┘ └──────┘ └──────┘     │ ACTIONS            │
│          │                                      │   │                    │
│ ACTIONS  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │ [Process Selected] │
│ ├─ Import│ │      │ │      │ │      │ │      │     │ [Delete Selected]  │
│ ├─ Export│ │ Img9 │ │Img10 │ │Img11 │ │Img12 │     │ [Export Selected]  │
│ └─ Create│ └──────┘ └──────┘ └──────┘ └──────┘     │                    │
│          │                                      │   │ HISTORY            │
│          │                                          │                    │
│          │                                          │ Last import: Today │
├──────────┴──────────────────────────────────────────┴────────────────────┤
│ 342 images | 3 selected                                 Process: 100%    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Image Viewing & Annotation
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SeekerAug] File Edit View Tools Help                    [Command Palette]  │
├──────────┬──────────────────────────────────────────┬────────────────────┤
│          │ Raw > img008.jpg  [View] [Annotate] [Augment]                  │
│ PROJECTS │ ┌────────────────────────────────────┐   │ METADATA           │
│ ├─ Proj1 │ │                                    │   │                    │
│   ├─ Raw │ │                                    │   │ Original: cat.jpg  │
│   ├─ Ref │ │                                    │   │ Size: 2.4 MB       │
│   └─ Aug │ │                                    │   │ Dimensions: 1920x1080│
│ └─ Proj2 │ │          [Image content]           │   │ Format: JPEG       │
│          │ │                                    │   │ Imported: 2023-05-12│
│ ACTIONS  │ │                                    │   │                    │
│ ├─ Import│ │                                    │   │ ANNOTATION         │
│ ├─ Export│ │                                    │   │                    │
│ └─ Create│ │                                    │   │ Status: Annotated  │
│          │ └────────────────────────────────────┘   │ Classes: 2         │
│          │                                          │ Objects: 4         │
│          │                                          │                    │
│          │                                          │ [Open in Annotation]│
│          │                                          │ [Export Annotations]│
├──────────┴──────────────────────────────────────────┴────────────────────┤
│ Raw image: Original preserved                           GPU: Active      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Integrity & Workflow Principles

### Raw Data Sanctity
- Raw dataset is **never** modified after import
- All operations work on copies or references
- Original files preserved for reproducibility
- Clear indicators when viewing raw vs. processed data

### Dataset Transformation Tracking
- All processes that transform data are logged
- Conversion from raw to refined is tracked and reversible
- Refinement process preserves all meaningful metadata
- Complete audit trail of all modifications

### Dataset History & Versioning
- Full history of dataset changes maintained
- Version control for important milestones
- Comparison tools for dataset versions
- Export/import of version snapshots

## Dataset & Model Export

### Export Options
- Each dataset type (Raw, Refined, Annotated, Augmented) has dedicated export options:
  - **Open in File Explorer**: Open OS file explorer to view files directly
  - **Export Dataset**: Package dataset with all relevant metadata
  - **Export Selected**: Export only selected images with metadata

### Export Formats
- **Raw Dataset**: Original files with import metadata
- **Refined Dataset**: Processed JPGs with extracted metadata
- **Annotated Dataset**: Support for multiple formats
  - COCO JSON format
  - YOLO TXT format
  - Pascal VOC XML format
  - Custom SeekerAug format (with full metadata)
- **Augmented Dataset**: Augmented images with transformation history
- **Models**: Export trained models in multiple formats
  - PyTorch (.pt)
  - ONNX (.onnx)
  - TensorFlow (.h5)
  - TensorRT optimized (where applicable)

### Export Process
1. User selects export type and destination
2. System offers format options based on content type
3. Export preview shows what will be included
4. Progress indicator during export
5. Success confirmation with path to exported content

## Implementation Recommendations

- Use React context for sharing UI state across components
- Implement virtual scrolling for large image grids
- Lazy load images and thumbnails
- Consider WebGL for image rendering when possible
- Use WebSockets for real-time updates from long-running processes
- Implement proper keyboard focus management
- Make table view sortable by all metadata fields

## Keyboard Shortcuts (VS Code-inspired)

- **Ctrl+P**: Command palette
- **Ctrl+Tab**: Cycle through tabs
- **Ctrl+Shift+Tab**: Cycle through tabs (reverse)
- **Ctrl+W**: Close current tab
- **Ctrl+K Ctrl+W**: Close all tabs
- **Ctrl+\\**: Split current tab
- **Ctrl+1/2/3**: Focus on first/second/third tab
- **Ctrl+B**: Toggle sidebar visibility
- **F11**: Toggle fullscreen
- **Ctrl+Space**: Trigger autocomplete/suggestions
- **Ctrl+F**: Search in current view
- **Ctrl+Shift+F**: Search across project

## Workspace Customization

- Resizable panels with drag handles
- Snap-to guides for common layouts
- Layout presets for different workflows
- Theme customization options
- Custom keyboard shortcut mapping
