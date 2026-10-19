// pickerHandler.js — handles fullscreen picking
console.log("[09] pickerHandler.js loaded!");

import { showOverlay, hideOverlay } from './overlayManager.js';
import { state } from './state.js';
import { drawCanvas } from '../ui/uiHelpers.js';

export function openPicker(pointNumber) {
  const pickerOverlay = document.getElementById('pickerOverlay');
  if (!pickerOverlay) {
    console.warn("⚠️ Picker overlay not found!");
    return;
  }

  state.pickingPoint = pointNumber;
  showOverlay('pickerOverlay'); // ✨ Use centralized show
}

export function closePicker() {
  hideOverlay('pickerOverlay'); // ✨ Use centralized hide
}

function centerImageOnCanvas(canvas) {
  if (!state.image) return;
  state.offsetX = (canvas.width - state.image.naturalWidth) / 2;
  state.offsetY = (canvas.height - state.image.naturalHeight) / 2;
}