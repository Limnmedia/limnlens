# LIMNLENS

**Three Point System: LIMN Effective Normalized Scale Map**

A stop-motion-friendly calibration tool for lens and camera scale, precision-focused for VFX integration, miniature photography, and CG compositing.

## Overview

LIMNLENS is a browser-based tool for calculating effective focal length (EFL) and related camera-matching metrics from real-world reference points. It is designed for stop-motion artists, cinematographers, and VFX technicians who need accurate camera scale, nodal offset, and field-of-view alignment across multi-pass workflows, miniature shoots, and live-action/CG crossovers.

The app has no build step and no package-managed runtime dependencies. It does currently load KaTeX from a CDN for equation rendering, so a network connection is needed for the formatted math display unless KaTeX is vendored locally.

## Key Features

- Effective focal length calculation from pixel distance, real-world measurements, and optical geometry
- Interactive two-point picker and verifier for baseline precision
- Manual entry for sensor size, physical baseline distance, focus distance, and entrance pupil offset
- Calculation of pixel density, field of view, angle of view, EFL, crop factor, and 35mm equivalent focal length
- JSON export for saving a completed calculation profile
- Educational geometry notes and equation rendering
- Calibration target assets for chart-based workflows

## Local Development

Because the app uses ES modules, serve it over HTTP instead of opening `index.html` directly from the filesystem.

From the repository root:

```powershell
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

No `npm install` or build command is required.

## Testing

The math regression tests are plain Node.js ES modules with no dependency install step:

```powershell
node tests/math-tests.mjs
```

You can also run:

```powershell
npm test
```

Manual browser checks are listed in [QA_CHECKLIST.md](QA_CHECKLIST.md).

## How to Use

1. Load an image with the "Load Image" button, or reveal and load the test image.
2. Pick point 1 and point 2 on two high-contrast features in the image.
3. Use the verifier to refine each picked point if needed.
4. Enter real-world measurements:
   - sensor width in millimeters
   - optional sensor height in millimeters
   - physical baseline distance in millimeters
   - focus distance in millimeters
   - optional entrance pupil offset in millimeters
5. Run the TPS calculation and review the derived camera metrics.
6. Use "Save calculation file" to download a JSON profile for the completed calculation.

## Saved Calculation Profile

The saved `.json` file is a calculation record, not a full editable project file yet. It includes:

- `app`: LIMNLENS name, version, profile version, license, and creation timestamp
- `image`: source filename, pixel dimensions, MIME type, size, and last-modified metadata when available
- `points`: Point A, Point B, and measured pixel distance
- `measurements`: real baseline distance, sensor size, focus distance, and entrance pupil offset
- `results`: effective focal length, 35mm equivalent focal length, angle of view, crop factor, real field of view, pixel density, optical distance, and millimeters per pixel

Import, multi-sample lens maps, and production-specific exports are planned future additions.

## Underlying Math

LIMNLENS derives image scale from a known real-world distance and its measured pixel distance:

```text
px_per_mm = P_image / D_real
FOV_real = W_image / px_per_mm
AOV = 2 * atan(FOV_real / (2 * (d_sensor - Delta)))
EFL = W_sensor / (2 * tan(AOV / 2))
```

Where:

- `P_image`: baseline distance in pixels
- `D_real`: baseline distance in millimeters
- `W_image`: image width in pixels
- `W_sensor`: sensor width in millimeters
- `d_sensor`: focus distance from sensor to subject
- `Delta`: entrance pupil / nodal offset in millimeters

## Known Limitations

- Distortion modeling is represented in state but not yet fitted or applied.
- JSON calculation profile export is available; import and multi-sample profile editing are planned.
- YAML calibration profile export is planned but not implemented.
- KaTeX is loaded from a CDN.
- Browser-free math tests cover the TPS calculation fixtures; broader UI automation is not yet present.

## License and Usage

This project is licensed under the GNU Affero General Public License v3.0 or later (`AGPL-3.0-or-later`). See [LICENSE.md](LICENSE.md) for details.

## Contributing

Please open an issue before submitting changes. Project changes should be reviewed and approved by Cade before merge.

## Links

- [LIMNMEDIA Website](https://limn.media)
- [Visual Effects Society](https://www.visualeffectssociety.com)
- [Camera Sensor Sizes - Wikipedia](https://en.wikipedia.org/wiki/Image_sensor_format)
- [Laser Rangefinder - Wikipedia](https://en.wikipedia.org/wiki/Laser_rangefinder)

## Coming Soon

- YAML calibration profile export
- JSON profile import and validation
- Multiple-point TPS sequences for lens breathing mapping
- Web-rendered ideal point placement guide
- Dependency-free formula rendering
- Community-submitted calibration charts
- Blender camera rig and USD camera metadata integration

## Tagline

**Lock down the lens. Unlock the shot.**
