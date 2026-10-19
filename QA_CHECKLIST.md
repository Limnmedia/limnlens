# QA Checklist

## Local run

- Start local server with `python -m http.server 8000`.
- Open `http://127.0.0.1:8000/`.
- Confirm the app loads without console errors.

## Core workflow

- Load the test image.
- Pick Point A.
- Pick Point B.
- Confirm the pixel distance updates.
- Enter required measurements.
- Run TPS calculation.
- Confirm results populate.
- Save JSON profile.
- Confirm exported JSON includes app metadata, image metadata, points, measurements, results, and confidence information.

## Validation

- Confirm calculation is blocked or warnings appear for missing required fields.
- Confirm invalid/zero/negative baseline values are handled safely.
- Confirm impossible optical distance values are handled safely.

## Layout checks

- Desktop: confirm image/points, measurements, results, and actions are aligned and usable.
- Desktop wide screen: confirm right-side control sections remain visually aligned.
- iOS Safari: confirm layout is usable.
- Android Chrome: confirm no horizontal overflow at approximately 360px, 390px, 412px, and 430px widths.
- Confirm directions/help sections do not block access to the main tool.

## Regression

- Run `npm test`.
- Confirm all tests pass.
