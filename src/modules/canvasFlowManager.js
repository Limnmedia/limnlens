// canvasFlowManager.js — Canvas and Overlay Control matching clean app flow

import { showOverlay, hideOverlay } from './overlayManager.js';
import { state } from './state.js';

console.log("[🔄] CanvasFlowManager loaded");

// --------------------------------------------------------------- prepareCanvas

export function prepareCanvas(id = 'canvasPicker') {
  const canvas = document.getElementById(id);
  if (canvas) {
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cursor = 'crosshair';
    console.log(`✅ Canvas '${id}' prepared for picking.`);
  } else {
    console.warn(`⚠️ prepareCanvas: Canvas '${id}' not found.`);
  }
}

// --------------------------------------------------------------- hideCanvas

export function hideCanvas(id = 'canvasPicker') {
  const canvas = document.getElementById(id);
  if (canvas) {
    canvas.style.display = 'none';
    console.log(`✅ Canvas '${id}' hidden.`);
  } else {
    console.warn(`⚠️ hideCanvas: Canvas '${id}' not found.`);
  }
}

// --------------------------------------------------------------- startPickPoint

export function startPickPoint(pointNumber) {
  console.log(`🎯 Starting pick for Point ${pointNumber}`);
  state.pickingPoint = pointNumber;

  showOverlay('pickerOverlay');
  prepareCanvas('canvasPicker');
}

// --------------------------------------------------------------- finishPickPoint

export function finishPickPoint(x, y) {
  if (state.pickingPoint === 1) {
    state.point1 = { x, y };
    state.point1Picked = true;
    console.log(`✅ Point 1 picked at (${x.toFixed(1)}, ${y.toFixed(1)})`);
  } else if (state.pickingPoint === 2) {
    state.point2 = { x, y };
    state.point2Picked = true;
    console.log(`✅ Point 2 picked at (${x.toFixed(1)}, ${y.toFixed(1)})`);
  }

  hideOverlay('pickerOverlay');
  hideCanvas('canvasPicker');
  state.pickingPoint = null;
}

// --------------------------------------------------------------- startVerification

export function startVerification() {
  if (state.point1Picked && state.point2Picked) {
    console.log("🔍 Starting verification view.");
    showOverlay('verifyOverlay');

    // You can swap this with 'canvasVerifier' if you split them
    prepareCanvas('canvasPicker'); // or 'canvasVerifier'
  } else {
    console.warn("⚠️ Cannot verify — both points not picked yet!");
  }
}

// --------------------------------------------------------------- confirmVerification

export function confirmVerification() {
  console.log("✅ Verification confirmed.");
  hideOverlay('verifyOverlay');
  hideCanvas('canvasPicker'); // or 'canvasVerifier'
  state.verificationConfirmed = true;

  // Optional: trigger automatic TPS calculation
  // calculateTPS();
}