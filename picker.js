// picker.js

import { state } from './state.js';
import { centerImage, drawCanvas } from './canvas.js';

console.log("[05] picker.js loaded");

export function startPicker(which, pickCanvasEl, pickerOverlay) {
  if (!pickCanvasEl || !pickerOverlay) {
    console.warn("startPicker: canvas or overlay is missing.");
    return;
  }

  state.pickingPoint = which;
  pickerOverlay.style.display = 'flex';
  pickCanvasEl.width = window.innerWidth;
  pickCanvasEl.height = window.innerHeight;
  centerImage(pickCanvasEl);
  drawCanvas(pickCanvasEl);
  console.warn("start picker loaded...");
}

export function selectPickedPoint(
  pickCanvasEl,
  pickerOverlay,
  label1,
  label2,
  verifyBtn1,
  verifyBtn2,
  updateDistance,
  onStatusChange
) {
  if (!pickCanvasEl || !pickerOverlay) {
    console.warn("selectPickedPoint: canvas or overlay is missing.");
    return;
  }

  const centerX = (pickCanvasEl.width / 2) - state.offsetX;
  const centerY = (pickCanvasEl.height / 2) - state.offsetY;

  if (state.pickingPoint === 1) {
    state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
    label1.textContent = `${state.point1.x}, ${state.point1.y}`;
    verifyBtn1.disabled = false;
    state.point1Status = "point picked and ready to verify";
  } else {
    state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
    label2.textContent = `${state.point2.x}, ${state.point2.y}`;
    verifyBtn2.disabled = false;
    state.point2Status = "point picked and ready to verify";
  }

  if (typeof onStatusChange === "function") {
    onStatusChange();
  }

  if (typeof updateDistance === "function") {
    updateDistance();
  }

  pickerOverlay.style.display = 'none';
  console.warn("select picked point");
}
