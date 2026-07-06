# LIMNLENS

**Measure two points. Match the camera. Keep animating.**

LIMNLENS is a camera-matching helper for stop-motion, miniature photography, and VFX work.

It helps answer a simple question:

**How big is the real world inside this image?**

You choose two points in a photo, measure how far apart those points are in real life, and LIMNLENS uses that to calculate useful camera-scale information.

This can help when you need to:

- match a real camera to a CG camera
- line up a miniature set with digital elements
- compare different passes of the same shot
- rebuild a camera view after something changes
- understand field of view, scale, and effective focal length

Think of it like a translator:

**Your image speaks in pixels.  
Your set speaks in millimeters.  
LIMNLENS helps translate between them.**

## Overview

LIMNLENS is a browser-based tool for calculating effective focal length (EFL) and related camera-matching metrics from real-world reference points. It is designed for stop-motion artists, cinematographers, and VFX technicians who need camera scale, nodal offset, and field-of-view alignment across multi-pass workflows, miniature shoots, and live-action/CG crossovers.

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

## Quick Start

1. Open LIMNLENS in your browser.
2. Load a photo from your shot.
3. Pick two clear points in the image.
4. Measure the real distance between those two points.
5. Enter the real-world distance in millimeters.
6. Enter your sensor size and focus distance if you know them.
7. Run the calculation.
8. Save the JSON profile for later use.

Tip: A ruler, printed chart, measured set piece, or known model-making part will usually work better than a random object.

## Three Point System, In Simple Words

The Three Point System is a way to make camera matching easier by starting with clear reference points.

LIMNLENS begins with the first important step:

**Measure a known distance in the image.**

You do this by picking two points:

**Point A** and **Point B**

Then you enter the real distance between those points.

LIMNLENS compares:

**the distance in pixels**

to

**the distance in millimeters**

From that comparison, it calculates camera scale, field of view, angle of view, and effective focal length.

## Good Objects To Measure

For the best results, pick two points that are easy to see in the image and easy to measure in real life.

Good choices include:

- marks on a ruler
- corners of a printed calibration chart
- corners of a square or rectangle
- dots on a measuring card
- known parts of a miniature set
- common model-making pieces with known dimensions

The farther apart the two points are, the better the measurement usually is. Tiny measurements can work, but small clicking errors matter more.

## Quick Reference: Common LEGO Dimensions

LEGO pieces can be useful as quick measuring objects when nothing else is available.

Common LEGO system dimensions:

| Part / Feature | Dimension |
|---|---:|
| 1 stud spacing / pitch | 8.0 mm |
| 1 brick height | 9.6 mm |
| 1 plate height | 3.2 mm |
| 3 plates stacked | 9.6 mm |
| Stud diameter | about 4.8 mm |
| Stud height | about 1.8 mm |
| 1 x 1 brick footprint | 8.0 x 8.0 mm |
| 1 x 2 brick footprint | 8.0 x 16.0 mm |
| 2 x 2 brick footprint | 16.0 x 16.0 mm |
| 2 x 4 brick footprint | 16.0 x 32.0 mm |

Example:

If you click the left and right outside edges of a 2 x 4 brick, the real-world baseline is about **32 mm**.

If you click across four studs from center to center, the baseline is usually:

**3 spaces x 8 mm = 24 mm**

because the distance between centers counts the spaces between studs, not the number of studs.

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
