// picker.js
import { state } from './state.js';
import { centerImage, drawCanvas } from './canvas.js';
import { updateDistance } from './maths.js';
import { updateStatusUI } from './main.js';

console.log("[05] picker.js loaded");


export function startPicker(which, pickCanvasEl, pickerOverlay) {
  state.pickingPoint = which;
  pickerOverlay.style.display = 'flex';
  pickCanvas.width = window.innerWidth;
  pickCanvas.height = window.innerHeight;
  centerImage(pickCanvas);         // ⬅️ pass canvas
  drawCanvas(pickCanvas);          // ⬅️ pass canvas
  console.warn("🎯 start picker loaded...");
}

export function selectPickedPoint(pickCanvas, pickerOverlay, label1, label2, verifyBtn1, verifyBtn2, updateDistance) {
  const centerX = (pickCanvas.width / 2) - state.offsetX;
  const centerY = (pickCanvas.height / 2) - state.offsetY;

  if (state.pickingPoint === 1) {
    state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
    label1.textContent = `${state.point1.x}, ${state.point1.y}`;
    verifyBtn1.disabled = false;
  } else {
    state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
    label2.textContent = `${state.point2.x}, ${state.point2.y}`;
    verifyBtn2.disabled = false;
  }
if (state.pickingPoint === 1) {
  state.point1Status = "point picked and ready to verify";
} else {
  state.point2Status = "picked picked and ready to verify";
}
updateStatusUI();
  updateDistance();
  pickerOverlay.style.display = 'none';
  console.warn("📍 select picked point");
}