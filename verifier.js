// ----------------------------- startVerifier

import { state } from './state.js';

import { centerImage, centerOnPoint, drawCanvas, animateVerify, setupDragging } from './canvas.js';

console.log("[06] verifier.js loaded");



export function startVerifier(which) {
  state.pickingPoint = which;
  verifyOverlay.style.display = 'flex';
  verifyCanvas.width = window.innerWidth;
  verifyCanvas.height = window.innerHeight;
  if (which === 1) centerOnPoint(state.point1);
  if (which === 2) centerOnPoint(state.point2);
    state.isVerifying = true;
    console.warn("[🛑] Verification animation stopped due to drag.");

  animateVerify();
    console.warn("verifier started...");
}

// ----------------------------- selectNewPoint


export function selectNewPoint(
  canvas,
  label1,
  label2,
  pixelDistanceLabel,
  updateDistance,
  animate
) {
  console.log("[🧪] selectNewPoint() called");
  console.log("🧾 Args:", {
    canvas,
    label1,
    label2,
    pixelDistanceLabel,
    pickingPoint: state.pickingPoint
  });

  const centerX = (canvas.width / 2) - state.offsetX;
  const centerY = (canvas.height / 2) - state.offsetY;

  console.log(`🎯 New point coords: (${centerX}, ${centerY})`);

  if (state.pickingPoint === 1) {
    state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
    if (label1) {
      label1.textContent = `${state.point1.x}, ${state.point1.y}`;
      console.log("✅ Updated Picked Point 1 label:", label1.textContent);
    } else {
      console.warn("⚠️ label1 is undefined");
    }
  } else {
    state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
    if (label2) {
      label2.textContent = `${state.point2.x}, ${state.point2.y}`;
      console.log("✅ Updated Picked Point 2 label:", label2.textContent);
    } else {
      console.warn("⚠️ label2 is undefined");
    }
  }

  if (typeof updateDistanceFn === "function") {
    updateDistance(pixelDistanceLabel);
    console.log("📏 updateDistance() called");
  } else {
    console.warn("⚠️ updateDistanceFn is not a function");
  }

  state.verifierAnimating = true;
  animate();
  console.log("🎞️ animateVerify() restarted");
}