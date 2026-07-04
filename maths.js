// maths.js

import { state } from './state.js';

console.log("[03] maths.js loaded");

export function updateDistance() {
  if (state.point1 && state.point2) {
    const dx = state.point2.x - state.point1.x;
    const dy = state.point2.y - state.point1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    state.baselinePixelDistance = parseFloat(dist.toFixed(4));

    console.warn(`[distance] Pixel distance updated: ${dist.toFixed(4)} px`);
    return state.baselinePixelDistance;
  }

  console.warn("updateDistance: Point 1 or 2 is missing.");
  return null;
}

export function calculateTPSFromInputs({ P, D, Wimg, Wsensor, d_sensor, delta = 0 }) {
  if (!(P > 0 && D > 0 && Wimg > 0 && Wsensor > 0 && d_sensor > 0)) {
    return null;
  }

  if (!Number.isFinite(delta) || delta < 0) {
    return null;
  }

  const pxmm = P / D;
  const FOV = Wimg / pxmm;
  const d_opt = d_sensor - delta;
  if (d_opt <= 0) {
    return null;
  }

  const AOV = 2 * Math.atan(FOV / (2 * d_opt));
  const EFL = Wsensor / (2 * Math.tan(AOV / 2));
  const Crop = 36 / Wsensor;
  const EqFL = EFL * Crop;

  return {
    P,
    D,
    Wimg,
    Wsensor,
    d_sensor,
    delta,
    pxmm,
    FOV,
    d_optical: d_opt,
    AOV_deg: AOV * 180 / Math.PI,
    EFL,
    CropFactor: Crop,
    EqFL_35mm: EqFL
  };
}

export function calculateTPS() {
  console.log("[TPS] Calculation started...");

  const result = calculateTPSFromInputs({
    P: state.baselinePixelDistance,
    D: state.baselineDistanceMM,
    Wimg: state.imageWidthPixels,
    Wsensor: state.sensorWidthMM,
    d_sensor: state.focusDistanceMM,
    delta: state.entrancePupilOffsetMM || 0
  });

  if (!result) {
    console.warn("TPS calculation aborted: missing required values");
    return null;
  }

  state.pixelPerMM = result.pxmm;
  state.mmPerPixel = 1 / result.pxmm;
  state.effectiveFocalLength = result.EFL;
  state.magnification = result.D / result.d_sensor;

  console.log("TPS Calculated:");
  console.table(result);

  return result;
}
