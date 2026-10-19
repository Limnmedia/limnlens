# LIMNLENS Stability And Growth Roadmap

This roadmap starts from the published LIMNLENS calculator and keeps stable function as the first priority. New features should improve measurement confidence, repeatability, or downstream production usefulness without making the static GitHub Pages app fragile.

## Operating Principles

- Keep the app static, dependency-light, and GitHub Pages friendly.
- Prefer clear user feedback over hidden console-only behavior.
- Preserve the core calculation path before adding advanced optics features.
- Treat saved profiles as production records: predictable schema, explicit units, and no runtime-only state.
- Use web-rendered teaching graphics and controls where possible instead of opaque static images.

## Phase 1: Documentation Sync And Release Hygiene

Goal: keep public docs aligned with the live published app.

- Update README limitations whenever a planned feature ships.
- Document the current JSON calculation profile fields.
- Keep the QA checklist aligned with current button labels and workflow.
- Add a short "accuracy assumptions" section:
  - single-frame calculation
  - no distortion correction yet
  - point depth/plane assumptions
  - effect of point-picking error
- Keep published version/cache notes visible for embed debugging.

Acceptance checks:

- README does not list shipped features as "planned."
- QA checklist matches the live UI.
- Docs explain what the app can and cannot guarantee.

## Phase 2: Measurement Confidence Panel

Goal: help users judge whether a calculation is trustworthy.

- Add a confidence panel after calculation.
- Show:
  - baseline pixel distance
  - real baseline distance
  - pixel density
  - point separation as a percentage of image width
  - point distance from image center
- Add warnings when:
  - points are too close together
  - points are near image edges where unknown distortion may matter more
  - focus distance is too close to entrance pupil offset
  - sensor width, baseline distance, or focus distance looks unusual
- Estimate sensitivity:
  - approximate EFL change if point picking is off by 1 px
  - approximate EFL change if real baseline measurement is off by 1 mm

Acceptance checks:

- A valid calculation produces both results and confidence feedback.
- Warnings never block export unless the calculation itself is invalid.
- Confidence values are included in exported JSON once stable.

## Phase 3: Picker Precision And Mobile Refinement

Goal: make point placement repeatable on desktop and mobile.

- Add zoom controls:
  - Fit
  - 100%
  - 200%
  - 400%
- Add verifier nudging:
  - arrow keys for 1 px
  - shift + arrow for larger steps
  - visible mobile nudge buttons
- Add point tools:
  - reset Point A
  - reset Point B
  - reset both points
  - swap points
- Show live verifier coordinates.
- Preserve the existing crosshair behavior and make the active point state obvious.

Acceptance checks:

- Desktop users can refine exact pixels with keyboard nudging.
- Mobile users can refine without pinch/drag frustration.
- Reset actions clear stale pixel distance and saved-result state.

## Phase 4: Ideal Point Placement Graphic

Goal: teach better calibration setup before users make bad measurements.

- Add a web-rendered point placement guide using inline SVG or HTML/CSS.
- Show:
  - poor placement: points too close together
  - better placement: wide separation across a flat measurable target
  - avoid extreme corners when distortion is unknown
  - keep points on the same depth plane
  - prefer sharp, high-contrast, physically measurable features
- Use it in the teaching guide and optionally near the point picker.
- Consider a small interactive version later:
  - drag example points
  - show "too close", "edge caution", and "better" labels live

Recommended implementation:

- Start with dependency-free inline SVG.
- Keep labels short and readable on mobile.
- Use the same restrained LIMNLENS visual language as the calculator.

Acceptance checks:

- Graphic renders without external assets.
- It stays legible on mobile.
- It does not distract from the calculator workflow.

## Phase 5: Distortion Awareness Before Distortion Correction

Goal: make distortion limitations visible before attempting full correction.

- Show each picked point's distance from image center.
- Warn when either point is near the outer image region.
- Explain that single-frame EFL does not correct lens distortion.
- Add optional user-provided distortion metadata later:
  - model name
  - k1/k2/k3
  - source note
- Defer automatic distortion fitting until there is a chart-based workflow.

Acceptance checks:

- Users understand when edge placement may reduce reliability.
- The app does not imply distortion has been corrected unless coefficients are actually applied.

## Phase 6: Offline And Embed Hardening

Goal: make LIMNLENS reliable on set and inside the LIMNMEDIA tools page.

- Add `?embed=1` mode:
  - hide header/footer
  - reduce outer margins
  - preserve calculator-first layout
- Add a visible app version in advanced details.
- Remove runtime dependence on CDN math rendering.
- Improve cache busting for CSS/JS/favicon when publishing.
- Consider a service worker only after the static asset list is stable.

### KaTeX Alternatives

Preferred path:

- Replace runtime KaTeX with dependency-free formula blocks.
- Use styled plain text / semantic HTML for the current formulas.
- Keep formulas readable in source, offline, and embedded contexts.

Other options:

- Vendor KaTeX locally if polished equation rendering is worth the extra files.
- Pre-render equations during authoring and commit the HTML.
- Use MathJax only if future math becomes too complex for simple HTML; it is heavier than this app currently needs.

Acceptance checks:

- The calculator remains readable with no network access.
- Embedded mode has no duplicate LIMNMEDIA framing.
- Formula rendering cannot break the calculator.

## Phase 7: Multi-Sample Lens Mapping

Goal: turn one-off calculations into a usable lens breathing map.

- Add "Add sample" after calculation.
- Store multiple focus-distance/EFL samples.
- Show a sample table:
  - focus distance
  - EFL
  - point separation
  - confidence status
  - timestamp
- Plot focus distance vs. EFL using dependency-free SVG.
- Export samples under `lensMap.stops` in the LIMNLENS profile.

Acceptance checks:

- Users can build a multi-focus lens profile in one session.
- Exported profiles preserve all samples.
- Single-calculation export remains simple.

## Phase 8: Production Pipeline Outputs

Goal: make LIMNLENS data useful immediately in production tools.

- Add "Copy result summary" for shot notes.
- Add "Copy Blender Camera Settings":
  - focal length
  - sensor width
  - horizontal/vertical AOV
- Add CSV export for sample tables.
- Add calibration receipt:
  - printable summary
  - image metadata
  - points
  - measurements
  - results
  - confidence warnings
- Add later pipeline stubs:
  - USD camera metadata
  - Nuke note format
  - After Effects note format

Acceptance checks:

- A user can move results into another tool without retyping.
- Outputs include units and enough context to audit later.

## Suggested Next Tickets

1. Sync README limitations and profile-format docs with the live JSON export.
2. Add the measurement confidence panel.
3. Add the web-rendered ideal point placement graphic.
4. Replace KaTeX runtime rendering with dependency-free formula blocks.
5. Add zoom and nudge controls for verifier precision.
