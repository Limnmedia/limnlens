# LimnLens Code Fix Roadmap

This roadmap focuses first on making the current static app reliable, then on improving maintainability and adding planned product features without changing the app's lightweight, dependency-free character.

## Phase 1: Stabilize Current Runtime

Goal: remove the bugs that can break normal image picking, verification, and calculation flows.

- Fix `verifier.js` so `selectNewPoint()` checks the passed `updateDistance` callback instead of the undefined `updateDistanceFn`.
- Stop registering duplicate drag handlers by removing the module-level `setupDragging(pickCanvas, ...)` calls from `canvas.js`; keep setup centralized in `main.js`.
- Remove accidental global DOM dependencies from `canvas.js`, `picker.js`, and `verifier.js`.
  - Pass `pickCanvas` and `verifyCanvas` explicitly into functions that need them.
  - Avoid relying on browser-created globals from element IDs.
- Guard canvas drawing functions against missing images, missing canvases, and unloaded state.
- Fix point status strings in `picker.js`, especially `picked picked and ready to verify`.
- Ensure `updateDistance()` is only called with a valid label element, or make the label parameter optional.

Acceptance checks:

- Load the test image.
- Pick point 1 and point 2.
- Verify and refine both points.
- Confirm both points.
- Pixel distance updates after every pick/refinement.
- TPS calculation runs after valid manual inputs.
- No uncaught console errors during the full flow.

## Phase 2: Clean Module Boundaries

Goal: make the app easier to reason about without adding a build system.

- Keep DOM lookups in `main.js` or a small `dom.js` helper.
- Keep canvas drawing and drag logic in `canvas.js`, with all required canvas elements passed as arguments.
- Keep picker/verifier modules focused on state transitions and coordinate selection.
- Move UI text rendering helpers into a UI module to avoid circular imports between `main.js` and `maths.js`.
- Replace circular imports:
  - `main.js -> maths.js`
  - `maths.js -> main.js`
  - `picker.js -> main.js`
- Add a small event/bootstrap pattern so modules do not import each other just to refresh UI.

Acceptance checks:

- ES module graph has no circular app imports.
- Every module can be read independently with clear inputs and outputs.
- Browser behavior matches Phase 1 after refactor.

## Phase 3: Validation and Error Reporting

Goal: make invalid calibration inputs visible and safe.

- Validate required numeric inputs:
  - sensor width
  - baseline distance
  - focus distance
  - baseline pixel distance
  - image width
- Reject zero or negative values where physically invalid.
- Validate `focusDistanceMM - entrancePupilOffsetMM > 0`.
- Show user-facing calculation errors in `statusMessage`, not only console warnings.
- Disable `calculateTPSBtn` until image, two points, and required manual inputs are present.
- Normalize units in labels and output fields.

Acceptance checks:

- Empty inputs cannot produce a calculation.
- Zero baseline distance cannot produce `Infinity`.
- Invalid optical distance cannot produce misleading output.
- UI clearly says what is missing.

## Phase 4: Encoding, Documentation, and License Hygiene

Goal: make the project publishable and understandable.

- Fix mojibake/encoding artifacts in README, logs, labels, and comments.
- Publish the project under `AGPL-3.0-or-later` and remove approval-only redistribution language.
- Update README to reflect actual dependency behavior.
  - The app has no build dependencies.
  - KaTeX currently loads from a CDN.
- Add a "Local Development" section explaining that ES modules should be served over HTTP.
- Add a "Known Limitations" section for distortion, nodal offset, and export status.

Acceptance checks:

- No broken `LICENSE.md` reference remains.
- README accurately describes how to run the app.
- README renders without corrupted characters.

## Phase 5: Lightweight Test Harness

Goal: protect the math and state transitions without overbuilding.

- Add simple browser-free unit tests for `calculateTPS()` math.
- Separate pure TPS calculation from DOM updates.
- Add fixtures for known calibration inputs and expected outputs.
- Add a minimal local test runner, either:
  - a plain HTML test page, or
  - a tiny Node-based script if the project accepts Node as a dev-only tool.
- Add a manual QA checklist for image loading, point picking, verification, and calculation.

Acceptance checks:

- TPS math can be tested without opening the app.
- At least three known input/output cases are covered.
- Manual QA checklist passes in Chrome/Edge/Firefox.

## Phase 6: Export and Profile Features

Goal: deliver the planned calibration-profile output.

- Define a stable profile schema for JSON export.
- Include:
  - app version
  - image metadata
  - picked points
  - measurement inputs
  - derived TPS results
  - calibration target metadata
  - lens map stops
- Add JSON export.
- Add YAML export only if a dependency-free serializer is acceptable or if a small dependency is approved.
- Add import validation before supporting profile import.

Acceptance checks:

- Exported JSON is valid and round-trips through `JSON.parse`.
- Missing optional fields are represented consistently.
- Runtime-only state is excluded from exported profiles.

## Phase 7: UI and Interaction Polish

Goal: make repeated calibration work faster and less error-prone.

- Improve button states across the workflow.
- Add clear picker/verifier crosshair affordances.
- Add keyboard nudging for verifier point refinement.
- Add zoom controls for 100%, 50%, and fit modes already represented in state.
- Add reset controls for:
  - image
  - points
  - manual inputs
  - full session
- Make test image loading clearer and remove duplicate "try/load" semantics if unnecessary.

Acceptance checks:

- A new user can complete calibration without reading console output.
- Point refinement works with mouse/touch and keyboard.
- Reset actions do not leave stale state.

## Suggested First Pull Request

Scope this narrowly:

- Fix `updateDistanceFn` in `verifier.js`.
- Remove duplicate `setupDragging()` calls from `canvas.js`.
- Pass canvas elements explicitly where practical.
- Add guards for missing image/canvas state.
- Fix the point status typo.

This should make the current app flow noticeably more stable while keeping the diff small enough to review.
