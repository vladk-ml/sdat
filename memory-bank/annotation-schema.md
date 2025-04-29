# SeekerAug Annotation & Metadata File Schema

This document defines the per-image annotation/metadata file schema for the Refined and Augmented datasets in SeekerAug. The schema is designed for YAML or JSON, with a focus on extensibility, lineage, and robustness.

---

## Refined Dataset Annotation File (`image1.yaml` or `image1.json`)

```yaml
image_id: 550e8400-e29b-41d4-a716-446655440000
filename: image1.jpg
dimensions: [1024, 768]
geotags:
  lat: 37.7749
  lon: -122.4194
ingested_at: 2025-04-28T20:00:00Z
parent_raw_id: 550e8400-e29b-41d4-a716-446655440000
parent_raw_filename: image1.tif
annotations:
  - id: ann-001
    type: bbox
    class: "car"
    coordinates: [100, 200, 300, 400]
    created_by: "user"
    created_at: 2025-04-28T20:10:00Z
    properties:
      confidence: 0.98
history:
  - action: "created"
    by: "user"
    at: 2025-04-28T20:10:00Z
  - action: "edited"
    by: "user"
    at: 2025-04-28T20:12:00Z
    changes: {coordinates: [110, 210, 310, 410]}
```

**Fields:**
- `image_id`: UUID, matches filename.
- `filename`: Image filename.
- `dimensions`: [width, height].
- `geotags`: Optional, for geospatial images.
- `ingested_at`: ISO timestamp.
- `parent_raw_id`: UUID of the raw image.
- `parent_raw_filename`: Filename of the raw image.
- `annotations`: List of annotation objects (bbox, polygon, class, etc.).
- `history`: List of actions for audit/versioning.

---

## Augmented Dataset Annotation File (`slice1.yaml` or `slice1.json`)

```yaml
slice_id: 123e4567-e89b-12d3-a456-426614174000
filename: slice1.jpg
parent_refined_id: 550e8400-e29b-41d4-a716-446655440000
parent_refined_filename: image1.jpg
parent_raw_id: 550e8400-e29b-41d4-a716-446655440000
parent_raw_filename: image1.tif
crop: [x: 100, y: 200, width: 512, height: 512]
augmentation_pipeline:
  - type: "flip"
    axis: "horizontal"
  - type: "rotate"
    angle: 15
annotations:
  - id: ann-001
    type: bbox
    class: "car"
    coordinates: [10, 20, 110, 120]  # Transformed to slice coordinates
    properties:
      confidence: 0.95
history:
  - action: "created"
    by: "augmentation"
    at: 2025-04-28T21:00:00Z
    details: "Cropped and flipped"
```

**Fields:**
- `slice_id`: UUID.
- `filename`: Slice image filename.
- `parent_refined_id`: UUID of the parent refined image.
- `parent_refined_filename`: Filename of the parent refined image.
- `parent_raw_id`: UUID of the parent raw image.
- `parent_raw_filename`: Filename of the parent raw image.
- `crop`: Crop coordinates.
- `augmentation_pipeline`: List of augmentations applied.
- `annotations`: List of transformed annotation objects.
- `history`: Audit/versioning.

---

## Annotation Object Structure

- `id`: Unique annotation ID (UUID or increment).
- `type`: "bbox", "polygon", "point", etc.
- `class`: Class label.
- `coordinates`: Format depends on type.
- `created_by`, `created_at`: For audit.
- `properties`: Optional, for extra info (confidence, etc.).

---

## Notes

- All IDs are UUIDs for global uniqueness.
- All timestamps are ISO 8601.
- All annotation files are stored alongside their corresponding images.
- History is append-only for auditability.
- The schema is extensible for future fields (review status, comments, etc.).

---

This schema is the reference for all ingestion, annotation, augmentation, and export/import logic in SeekerAug.
