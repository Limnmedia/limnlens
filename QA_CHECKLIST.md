# QA Checklist

Use this checklist before publishing or after changes to picker, verifier, input validation, or TPS math.

## Local Setup

- From the repository root, run `python -m http.server 8000`.
- Open `http://127.0.0.1:8000/`.
- Open the browser console and keep it visible during testing.

## Happy Path

- Load the test image.
- Pick point 1.
- Pick point 2.
- Confirm the pixel distance updates.
- Verify point 1 or point 2.
- Use Select New in the verifier and confirm the point changes.
- Enter:
  - Sensor width: `36`
  - Sensor height: `24`
  - Baseline distance: `100`
  - Focus distance: `1000`
  - Entrance pupil offset: `0`
- Click Review inputs.
- Confirm Calculate focal length becomes enabled.
- Run the calculation.
- Confirm the status reads `Focal length calculated`.
- Confirm EFL, crop factor, AOV, FOV, and 35mm equivalent fields update.
- Confirm Save calculation file becomes enabled.
- Click Save calculation file.
- Confirm a `limnlens-*.json` file downloads and the status names the saved file.
- Change one measurement input and confirm Save calculation file becomes disabled until recalculating.
- Confirm there are no uncaught console errors.

## Validation Cases

- Leave the image unloaded and confirm calculation stays disabled.
- Load an image but leave one point unpicked and confirm calculation stays disabled.
- Enter `0` for sensor width and confirm calculation stays disabled.
- Enter `0` for baseline distance and confirm calculation stays disabled.
- Enter `0` for focus distance and confirm calculation stays disabled.
- Enter focus distance `10` and entrance pupil offset `10`; confirm the app reports that focus distance must be greater than entrance pupil offset.
- Enter entrance pupil offset `-1`; confirm the offset field is marked invalid and calculation stays disabled.

## Math Regression

- Run `node tests/math-tests.mjs`.
- Confirm all math fixtures pass.
