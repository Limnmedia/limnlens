// ----------------------------- updateDistance

import { state } from './state.js';
import { renderManualDisplay } from './main.js';  // Make sure it's exported from main.js

console.log("[03] maths.js loaded");

export function updateDistance(pixelDistanceLabel) {
  if (state.point1 && state.point2) {
    const dx = state.point2.x - state.point1.x;
    const dy = state.point2.y - state.point1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 1. Update the label UI
    pixelDistanceLabel.textContent = dist.toFixed(4) + " px";

    // 2. Save to state
    state.baselinePixelDistance = parseFloat(dist.toFixed(4));

    // 3. Update the overview section (Data Overview)
    renderManualDisplay();

    console.warn(`[📏] Pixel distance updated: ${dist.toFixed(4)} px`);
  } else {
    console.warn("⚠️ updateDistance: Point 1 or 2 is missing.");
  }
}

export function calculateTPS() {
  console.log("[🧠] TPS Calculation started...");

  // --- Required values pulled from app state
  const P = state.baselinePixelDistance;        // Pixel distance between points
  const D = state.baselineDistanceMM;           // Real-world baseline in mm
  const Wimg = state.imageWidthPixels;          // Image width in px
  const d_sensor = state.focusDistanceMM;       // Focus distance
  const delta = state.entrancePupilOffsetMM || 0; // Entrance pupil offset
  const Wsensor = state.sensorWidthMM;          // Sensor width in mm

  // --- Guard: check for required values
  if (!(P && D && Wimg && d_sensor && Wsensor)) {
    console.warn("⚠️ TPS calculation aborted — missing required values");
    return null;
  }

  // --- TPS Core Calculations
  const pxmm = P / D;
  const FOV = Wimg / pxmm;
  const d_opt = d_sensor - delta;
  const AOV = 2 * Math.atan(FOV / (2 * d_opt));
  const EFL = Wsensor / (2 * Math.tan(AOV / 2));
  const Crop = 36 / Wsensor;
  const EqFL = EFL * Crop;

  // --- Save results to state
  state.pixelPerMM = pxmm;
  state.mmPerPixel = 1 / pxmm;
  state.effectiveFocalLength = EFL;
  state.magnification = D / d_sensor;

  // --- Update UI
  document.getElementById("displayPImage").textContent = P.toFixed(2);
  document.getElementById("displayDReal").textContent = D.toFixed(2);
  document.getElementById("displayWImage").textContent = Wimg;
  document.getElementById("displayWSensor").textContent = Wsensor;
  document.getElementById("displayDSensor").textContent = d_sensor;
  document.getElementById("displayDelta").textContent = delta;

  document.getElementById("displayPxPerMM").textContent = pxmm.toFixed(3);
  document.getElementById("displayFOVReal").textContent = FOV.toFixed(2);
  document.getElementById("displayDOptical").textContent = d_opt.toFixed(2);
  document.getElementById("displayAOV").textContent = (AOV * 180 / Math.PI).toFixed(2);
  document.getElementById("displayEFL").textContent = EFL.toFixed(2);
  document.getElementById("displayCropFactor").textContent = Crop.toFixed(2);
  document.getElementById("displayEqFL35").textContent = EqFL.toFixed(2);
  document.getElementById("statusMessage").textContent = "✅ Focal length calculated";

  // --- Done
  console.log("📐 TPS Calculated:");
  console.table({
    P,
    D,
    pxmm,
    FOV,
    d_opt,
    AOV_deg: AOV * 180 / Math.PI,
    EFL,
    CropFactor: Crop,
    EqFL_35mm: EqFL
  });

  return {
    pxmm,
    FOV,
    d_optical: d_opt,
    AOV_deg: AOV * 180 / Math.PI,
    EFL,
    CropFactor: Crop,
    EqFL_35mm: EqFL
  };
}