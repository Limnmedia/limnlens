// verifier.js

import { state } from './state.js';
import { centerOnPoint, animateVerify } from './canvas.js';

console.log("[06] verifier.js loaded");

export function startVerifier(which, verifyCanvasEl, verifyOverlay) {
  if (!verifyCanvasEl || !verifyOverlay) {
    console.warn("startVerifier: canvas or overlay is missing.");
    return;
  }

  state.pickingPoint = which;
  verifyOverlay.style.display = 'flex';
  verifyCanvasEl.width = window.innerWidth;
  verifyCanvasEl.height = window.innerHeight;

  if (which === 1) centerOnPoint(verifyCanvasEl, state.point1);
  if (which === 2) centerOnPoint(verifyCanvasEl, state.point2);

  state.currentPoint = null;
  state.isVerifying = true;

  animateVerify(verifyCanvasEl);
  console.warn("verifier started...");
}

export function selectNewPoint(
  canvas,
  label1,
  label2,
  pixelDistanceLabel,
  updateDistance,
  animate
) {
  if (!canvas) {
    console.warn("selectNewPoint: canvas is missing.");
    return;
  }

  const centerX = (canvas.width / 2) - state.offsetX;
  const centerY = (canvas.height / 2) - state.offsetY;

  if (state.pickingPoint === 1) {
    state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
    if (label1) label1.textContent = `${state.point1.x}, ${state.point1.y}`;
  } else {
    state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
    if (label2) label2.textContent = `${state.point2.x}, ${state.point2.y}`;
  }

  if (typeof updateDistance === "function") {
    updateDistance(pixelDistanceLabel);
    console.log("updateDistance() called");
  } else {
    console.warn("updateDistance is not a function");
  }

  state.verifierAnimating = true;

  if (typeof animate === "function") {
    animate(canvas);
  }

  console.log("animateVerify() restarted");
}
