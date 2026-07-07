# LIMNLENS

**Measure two points. Match the camera. Keep animating.**

LIMNLENS is a focal length calculator and camera-matching helper for stop-motion, miniature photography, and VFX work.

Current status: `v0.1.0-alpha` preview.

## Use It Online

The easiest way to try LIMNLENS is to open the hosted webpage:

https://limnmedia.github.io/limnlens/

You do not need to install Git, Node, npm, or any developer tools to use the web version.

Just open the page, load an image, pick two points, enter the real-world distance, and calculate the camera-matching results.

## What LIMNLENS Does

LIMNLENS helps answer a simple question:

**What focal length does this camera view imply?**

You choose two points in a photo, measure how far apart those points are in real life, and LIMNLENS uses that known distance to calculate effective focal length and related camera-matching information.

This can help when you need to:

- match a real camera to a CG camera
- line up a miniature set with digital elements
- compare different passes of the same shot
- rebuild a camera view after something changes
- understand effective focal length, field of view, scale, and angle of view

LIMNLENS is a browser-based focal length calculator that uses real-world reference points to estimate effective focal length (EFL), field of view, angle of view, and related camera-matching metrics. It is designed for stop-motion artists, cinematographers, students, and VFX technicians who need focal length and field-of-view alignment across miniature shoots, multi-pass workflows, and live-action/CG crossovers.

## Beginner-Friendly Explanation

LIMNLENS calculates focal length by comparing a real-world measurement with the same distance in a photo.

Your photo measures distance in pixels.
Your set, model, ruler, or calibration card measures distance in millimeters.

LIMNLENS uses that comparison to estimate the camera view.

A simple way to start:

1. Find two clear points in your image.
2. Measure the real distance between those same two points.
3. Enter that distance into LIMNLENS.
4. Run the calculation to estimate focal length and field of view.

Good measuring objects include rulers, printed charts, square corners, marked cards, model-making parts, or any object with a known size.

## How to Use LIMNLENS

### Option 1: Use the hosted webpage

Open:

https://limnmedia.github.io/limnlens/

Then:

1. Load an image.
2. Pick Point A and Point B.
3. Enter the real-world baseline distance in millimeters.
4. Enter sensor width and focus distance if known.
5. Run the TPS focal length calculation.
6. Save the JSON profile if you want a record of the calculation.

### Option 2: Run locally for development

Only use this option if you want to work with the project files directly.

Because the app uses ES modules, serve it over HTTP instead of opening `index.html` directly:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

No `npm install` or build command is required.

## Good Objects to Measure

For the best results, pick two points that are easy to see in the image and easy to measure in real life.

Good choices include:

- marks on a ruler
- corners of a printed calibration chart
- corners of a square or rectangle
- dots on a measuring card
- known parts of a miniature set
- common model-making pieces with known dimensions

The farther apart the two points are, the better the measurement usually is. Tiny measurements can work, but small clicking errors matter more.

## Optional Quick Reference: Common LEGO Dimensions

LEGO pieces can be useful as quick measuring objects when nothing else is available, but they are only one example. A ruler or printed calibration chart is usually better.

Common LEGO system dimensions:

| Part / Feature | Dimension |
| --- | ---: |
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
- `confidence`: point-placement checks, stability notes, and approximate sensitivity values

Import, multi-sample lens maps, and production-specific exports are planned future additions.

## Underlying Math

LIMNLENS estimates focal length by first deriving image scale from a known real-world distance and its measured pixel distance:

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

- This is an alpha/preview release.
- Picker zoom/view modes are still basic.
- Distortion modeling is represented in state but not yet fitted or applied.
- JSON calculation profile export is available; import and multi-sample profile editing are planned.
- YAML calibration profile export is planned but not implemented.
- KaTeX is loaded from a CDN.
- Browser-free math tests cover the TPS calculation fixtures; broader UI automation is not yet present.

## Possible Future Improvements

These are planned or possible directions, not promises for the current alpha release:

- JSON profile import and validation
- Improved picker view controls, such as fit-to-view and fixed zoom levels
- Multiple measurement samples for stronger lens-scale estimates
- Basic lens breathing map workflows
- Dependency-free formula rendering
- Additional printable calibration targets
- Better production export formats after real workflow testing
- Blender or USD camera metadata experiments

## Local Development

This section is only for people who want to run or edit the project files locally.

If you just want to use LIMNLENS, use the hosted webpage above.

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
npm test
```

You can also run the test file directly:

```powershell
node tests/math-tests.mjs
```

If PowerShell blocks `npm.ps1`, run `npm.cmd test` or use the direct Node command above.

Manual browser checks are listed in [QA_CHECKLIST.md](QA_CHECKLIST.md).

## License

This project is licensed under the GNU Affero General Public License v3.0 or later (`AGPL-3.0-or-later`). See [LICENSE](LICENSE) for details.

## Contributing

Please open an issue before submitting changes. Project changes should be reviewed and approved by Cade before merge.

## Links

- [LIMNMEDIA Website](https://limnmedia.com)
- [Visual Effects Society](https://www.visualeffectssociety.com)
- [Camera Sensor Sizes - Wikipedia](https://en.wikipedia.org/wiki/Image_sensor_format)
- [Laser Rangefinder - Wikipedia](https://en.wikipedia.org/wiki/Laser_rangefinder)

## Tagline

**Lock down the lens. Unlock the shot.**
