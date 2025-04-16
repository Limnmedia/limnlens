# LimnLens

**Stop-Motion Lens Breathing Mapping & Effective Focal Length Tracking**

---

## Overview

**LimnLens** is an open-source calibration tool for tracking lens characteristics used in stop-motion and visual effects production, with a focus on:

- 📏 **Effective Focal Length (EFL)** calculation across varying focus distances
- 🎞️ **Lens breathing mapping**, useful for animation continuity and multipass compositing
- 🔧 A practical method for estimating focal length from pixel density (pixels per mm)

This tool is designed to support motion control workflows, accurate camera matching, and lens profiling pipelines in stop-motion cinematography and miniature VFX setups.

---

## Why This Matters

In professional stop-motion production, camera moves are often repeated across passes, and even subtle changes in focal length due to **focus breathing** can break compositing accuracy.

LimnLens helps:
- Standardize **EFL tables** for each lens at known focus distances
- Calibrate **focus motors** in motion control rigs
- Provide **animators and VFX artists** with trusted lens data for CG–practical integration

---

## Data Format

This repo begins with CSV-based data collection, including:

- `camera`
- `lens`
- `nominal_focal_length_mm`
- `focus_distance_mm`
- `effective_focal_length_mm`
- `notes`

Example:

```csv
camera,lens,nominal_focal_length_mm,focus_distance_mm,effective_focal_length_mm,notes
Canon 5D Mk III,Canon 50mm,50.0,300,50.52,Measured with Siemens chart
Pixel 7 Pro,Main Cam,4.6,150,4.66,Estimated from image metadata
