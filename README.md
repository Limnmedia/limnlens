# TPS LENSMap

**Three Point System: LIMN Effective Normalized Scale Map**
*A stop-motion-friendly calibration tool for lens and camera scale, precision-focused for VFX integration, miniature photography, and CG compositing.*

---

## 🔍 Overview

TPS LENSMap is a lightweight but technically rigorous tool for calculating **effective focal length (EFL)** and related metrics using real-world reference points. It is designed for stop-motion artists, cinematographers, and VFX technicians who require accurate **camera scale, nodal offset**, and **field-of-view alignment** across multi-pass workflows, miniature shoots, and live-action/CG crossovers.

LENSMap works entirely in-browser with no dependencies. Built by LIMNMEDIA, it combines technical depth with accessibility.

---

## 🎯 Key Features

* 🔢 **Effective Focal Length Calculator** based on pixel distance, real-world measurements, and optical geometry
* 🎯 **Interactive two-point picker and verifier** for sub-pixel baseline precision
* 📏 **Manual data entry for real-world measurements** (sensor size, baseline, focus distance)
* 📐 **Calculation of FOV, AOV, EFL, and crop factor**
* 🧠 **Educational content** including step-by-step calibration instructions, geometry breakdown, and LaTeX-rendered equations
* 📸 **Nodal calibration guidance** with support for custom sliding plate rigs

---

## 🛠️ How to Use

### 1. Load Your Image

Use the "Load Image" button to select a calibration photo from your device. Or click "Try Test Image" to use a sample.

### 2. Pick Points

Click "Pick Point 1" and "Pick Point 2" to place markers on two high-contrast features in your image. Use the verify tool to fine-tune each point.

### 3. Enter Real-World Measurements

Fill in sensor width, sensor height (optional), real baseline distance (mm), and focus distance (mm).

### 4. Run the Calculator

Click "Run TPS Calculation" to generate a full report:

* Pixel density (px/mm)
* Field of View (mm)
* Angle of View (degrees)
* Effective Focal Length (mm)
* Crop Factor and 35mm equivalent

### 5. Export (Coming Soon)

Planned support for YAML/JSON export of your calibration profile.

---

## 📐 Underlying Math

LENSMap implements the following equation for EFL:

```
  f = W_sensor / (2 * tan(atan((W_image * D_real) / (2 * P_image * (d_sensor - Delta))))
```

* `P_image` — Baseline distance in pixels
* `D_real` — Baseline distance in millimeters
* `W_image` — Width of the image in pixels
* `W_sensor` — Width of the sensor in millimeters
* `d_sensor` — Focus distance (sensor to subject)
* `Delta` — Nodal offset (optional)

LaTeX-rendered breakdown is included directly in the interface.


---

## 🔐 License & Usage

This project is intended for educational, creative, and research use.

> Modifications, forks, or redistributions **must be approved** by LIMNMEDIA prior to public release. See LICENSE.md for details.

---

## 🙋 Contribution

Contributions are welcome with approval. To suggest improvements:

* Open a GitHub Issue with your proposal
* Or fork privately and email LIMNMEDIA for review

---

## 🔗 Links

* [LIMNMEDIA Website](https://limn.media) (coming soon)
* [Visual Effects Society](https://www.visualeffectssociety.com)
* [Camera Sensor Sizes – Wikipedia](https://en.wikipedia.org/wiki/Image_sensor_format)
* [Laser Rangefinder – Wikipedia](https://en.wikipedia.org/wiki/Laser_rangefinder)

---

## 🧪 Coming Soon

* YAML + JSON calibration exports
* Multiple-point TPS sequences for lens breathing mapping
* Community-submitted calibration charts
* Integration with Blender camera rig and USD camera spec

---

## 🏁 Tagline

**Lock down the lens. Unlock the shot.**

## License
MIT License 