// distanceHandler.js — calculates and updates pixel distance
console.log("[06] distanceHandler.js loaded!");

import { state } from './state.js';
import { updateDistanceUI } from '../ui/uiHelpers.js';

export function calculatePixelDistance() {
  if (state.point1 && state.point2) {
    const dx = state.point2.x - state.point1.x;
    const dy = state.point2.y - state.point1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const rounded = parseFloat(dist.toFixed(2));
    updateDistanceUI(rounded);
    return rounded;
  }

  console.warn("⚠️ Pixel distance not calculated — missing point(s).");
  return null;
}