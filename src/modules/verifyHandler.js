// verifyHandler.js — handles fullscreen verifying
console.log("[10] verifyHandler.js loaded!");

import { showOverlay, hideOverlay } from './overlayManager.js';
import { state } from './state.js';
import { drawCanvas } from '../ui/uiHelpers.js';

export function openVerifier(pointNumber) {
  state.pickingPoint = pointNumber;
  state.offsetX = 0;
  state.offsetY = 0;
  state.currentPoint = null;
  state.isDragging = false;

  const verifyOverlay = document.getElementById('verifyOverlay');
  const verifyCanvas = document.getElementById('verifyCanvas');

  if (!verifyOverlay || !verifyCanvas) {
    console.warn("⚠️ Verifier overlay or canvas not found!");
    return;
  }

  verifyOverlay.style.display = 'flex';
  verifyCanvas.width = window.innerWidth;
  verifyCanvas.height = window.innerHeight;

  centerOnPickedPoint(verifyCanvas, pointNumber);
  animateVerification(verifyCanvas);
}

export function closeVerifier() {
  const verifyOverlay = document.getElementById('verifyOverlay');
  if (verifyOverlay) {
    verifyOverlay.style.display = 'none';
  }
}

function centerOnPickedPoint(canvas, pointNumber) {
  const point = pointNumber === 1 ? state.point1 : state.point2;
  if (!point) return;
  state.offsetX = (canvas.width / 2) - point.x;
  state.offsetY = (canvas.height / 2) - point.y;
}

function animateVerification(canvas) {
  function step() {
    const pt = state.pickingPoint === 1 ? state.point1 : state.point2;
    if (!pt) return;

    if (!state.currentPoint) {
      state.currentPoint = { x: pt.x, y: pt.y };
    }

    state.currentPoint.x += (pt.x - state.currentPoint.x) * 0.2;
    state.currentPoint.y += (pt.y - state.currentPoint.y) * 0.2;

    drawCanvas(canvas.getContext('2d'), state.currentPoint); // Pass context + point
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}