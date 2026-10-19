# LIMN-LENS Specification Document (Draft v0.1)

## 🧠 Project Overview

**LIMN-LENS** is a cross-platform open-source application for solving real focal length, distortion, and breathing characteristics of physical camera lenses using a photographic measurement process. It is built for the unique needs of stop-motion and multi-pass cinematography workflows.

At its core, LIMN-LENS contains a structured, extensible **Camera and Lens Library**, which maps:

- Sensor sizes per camera model
- Lens breathing data (focal length shifts at different focus distances)
- Distortion characteristics (optional)

The **LIMN-LENS application** is both:

- A measurement tool (image in → real focal/distortion out)
- A library editor (update, review, and export calibration data)

---

## ✅ Core Functions

### 1. Calculate Focal Length
From a user-supplied image of printed markers and known distances:
- Detect markers
- Measure pixel scale
- Apply projection math
- Output effective focal length

### 2. Calculate Distortion (future phase)
- Use grid or multi-point chart
- Track deviation from true circle/grid
- Fit polynomial coefficients

### 3. Map Lens Breathing
- Across multiple focus distances
- Store entries like: `Focus_mm → EffectiveFocal_mm`
- Plot, compare, and export curves

---

## 📚 Core Components

### 📁 Camera & Lens Library (under `/data`)
- `sensor_db.csv` — camera model → sensor width, height, resolution
- `lens_db.csv` — lens make/model → mount, T-stop, focal range
- `breathing/` — CSVs containing breathing maps for individual lenses
- `distortion/` — (future) polynomial lens distortion profiles

---

## 🧰 Tooling Interface

### LIMN-LENS App (Python CLI, Swift GUI optional)
- Run focal length or breathing analysis
- Export camera report
- Update or add entries to the database
- Show debugging overlays on image data

---

## 🧩 Dependencies (Initial)
- Python 3.11+
- OpenCV
- NumPy
- Pillow
- Rich (CLI UX)

Optional (future):
- Matplotlib (graphing)
- Pandas (table interpolation)
- SciKit-Image (polar transformations)

---

## 🔁 Workflow Concept

1. User prints coded marker chart
2. Photographs with camera/lens at known focus distance
3. LIMN-LENS detects markers
4. Calculates true focal length and pixel scale
5. Updates breathing map for that lens

---

## 🔄 User Responsibility

- Supply physical measurements (baseline, focus distance)
- Provide sensor model if not in DB
- Approve or correct computed values
- Optionally export results to JSON or CSV

---

## 🔓 License Recommendation
- **Code**: Apache 2.0 (permissive, patent-friendly)
- **Data**: CC-BY 4.0 (for sensor and lens tables)

---

## 📌 Next Steps
- Finalize folder layout and data schema
- Complete MVP CLI tool for focal length from image
- Begin populating initial `sensor_db.csv` and `lens_db.csv`