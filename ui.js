// ui.js

import { state } from './state.js';

console.log("[08] ui.js loaded");

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[UI] Missing DOM element: #${id}`);
    return;
  }

  el.textContent = value;
}

export function renderPixelDistance(pixelDistanceLabel) {
  if (!pixelDistanceLabel) return;

  pixelDistanceLabel.textContent =
    state.baselinePixelDistance !== null && state.baselinePixelDistance !== undefined
      ? `${state.baselinePixelDistance.toFixed(4)} px`
      : "--";
}

export function renderStatus(message, isError = false) {
  const el = document.getElementById("statusMessage");
  if (!el) return;

  el.textContent = message;
  el.classList.remove("missing", "valid");
  el.classList.add(isError ? "missing" : "valid");
}

export function updateStatusUI() {
  const point1El = document.getElementById("point1Verified");
  const point2El = document.getElementById("point2Verified");

  if (point1El) {
    point1El.textContent = state.point1Status;
    point1El.className = "status-indicator " + state.point1Status;
  }

  if (point2El) {
    point2El.textContent = state.point2Status;
    point2El.className = "status-indicator " + state.point2Status;
  }
}

export function renderManualDisplay() {
  console.log("[UI] Rendering manual data display...");

  const fields = [
    { id: 'displaySensorWidth', value: state.sensorWidthMM, required: true },
    { id: 'displaySensorHeight', value: state.sensorHeightMM, required: false },
    { id: 'displayImageWidth', value: state.imageWidthPixels, required: false },
    { id: 'displayImageHeight', value: state.imageHeightPixels, required: false },
    { id: 'displayBaselineDistancePX', value: state.baselinePixelDistance, required: false },
    { id: 'displayBaselineDistance', value: state.baselineDistanceMM, required: true },
    { id: 'displayFocusDistance', value: state.focusDistanceMM, required: true },
    { id: 'displayDelta', value: state.entrancePupilOffsetMM, required: false }
  ];

  fields.forEach(({ id, value, required }) => {
    const el = document.getElementById(id);
    const displayValue = value !== null && value !== undefined ? value : '--';

    if (!el) {
      console.warn(`[UI] Missing DOM element: #${id}`);
      return;
    }

    el.textContent = displayValue;
    el.classList.remove('missing', 'valid');

    if ((value === null || value === '' || isNaN(value)) && required) {
      el.classList.add('missing');
    } else {
      el.classList.add('valid');
    }
  });
}

export function renderTPSResult(result) {
  if (!result) return;

  setText("displayPImage", result.P.toFixed(2));
  setText("displayDReal", result.D.toFixed(2));
  setText("displayWImage", result.Wimg);
  setText("displayWSensor", result.Wsensor);
  setText("displayDSensor", result.d_sensor);
  setText("displayDelta", result.delta);

  setText("displayPxPerMM", result.pxmm.toFixed(3));
  setText("displayFOVReal", result.FOV.toFixed(2));
  setText("displayDOptical", result.d_optical.toFixed(2));
  setText("displayAOV", result.AOV_deg.toFixed(2));
  setText("displayEFL", result.EFL.toFixed(2));
  setText("displayCropFactor", result.CropFactor.toFixed(2));
  setText("displayEqFL35", result.EqFL_35mm.toFixed(2));
  renderStatus("Focal length calculated");
}
