// main.js — Entry point for initializing the TPS Calibration Tool
console.log("[11]  main.js loaded!");

// Imports
import { initCanvas } from './modules/canvasHandler.js';
import { handleImageInput } from './modules/canvasHandler.js';
import { updateStatus, updatePickedPointUI, updateDistanceUI } from './ui/uiHelpers.js';
import { calculateTPS } from './modules/calcHandler.js';
import { openPicker, closePicker } from './modules/pickerHandler.js';
import { openVerifier, closeVerifier } from './modules/verifyHandler.js';
import { calculatePixelDistance } from './modules/distanceHandler.js';
import { state } from './modules/state.js';
import { generateExportProfile, downloadJSON, downloadYAML } from './modules/exportHandler.js';
import { showOverlay, hideOverlay } from './modules/overlayManager.js';


// Expose export functions
window.exportProfileJSON = function() {
  const profile = generateExportProfile();
  downloadJSON(profile);
};

window.exportProfileYAML = function() {
  const profile = generateExportProfile();
  downloadYAML(profile);
};

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  console.groupCollapsed("🚀 TPS Calibration Tool Boot Sequence");
  console.log("✅ DOMContentLoaded");

  // --- Hide all overlays at startup ---
  hideOverlay('pickerOverlay');
  hideOverlay('verifyOverlay');
  //hideOverlay('someOtherOverlay'); // (optional future overlays)

  console.log("✅ Overlays hidden on startup");
  
  // 1. Initialize canvas and interactivity
  initCanvas();
  console.log("🖼️ Canvas ready.");

  // 2. Setup image loader + EXIF extraction
  handleImageInput("imgLoader");
  console.log("📷 Image loader initialized.");

  // 3. Attach TPS calculation to Calculate button
  const calcButton = document.getElementById("calcButton");
  if (calcButton) {
    calcButton.addEventListener("click", () => {
      calculateTPS();
    });
    console.log("📐 TPS Calculate Button attached!");
  }

  // 4. Attach point picking and verifying
  setupPickingWorkflow();
  console.log("📍 Point picking & verifying ready.");

  updateStatus("Ready to load an image and pick points.");
  console.groupEnd();
});

// Setup Picking and Verifying Workflow
function setupPickingWorkflow() {
  // --- Point 1
  const pickPoint1Btn = document.getElementById("pickPoint1Btn");
  const verifyPoint1Btn = document.getElementById("verifyPoint1Btn");

  if (pickPoint1Btn) {
    pickPoint1Btn.addEventListener("click", () => {
      openPicker(1);
    });
  }

  if (verifyPoint1Btn) {
    verifyPoint1Btn.addEventListener("click", () => {
      openVerifier(1);
    });
  }

  // --- Point 2
  const pickPoint2Btn = document.getElementById("pickPoint2Btn");
  const verifyPoint2Btn = document.getElementById("verifyPoint2Btn");

  if (pickPoint2Btn) {
    pickPoint2Btn.addEventListener("click", () => {
      openPicker(2);
    });
  }

  if (verifyPoint2Btn) {
    verifyPoint2Btn.addEventListener("click", () => {
      openVerifier(2);
    });
  }

  // --- Select & Confirm Buttons inside Picker and Verifier Overlays
  const selectBtn = document.getElementById("selectBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const selectNewBtn = document.getElementById("selectNewBtn");

  if (selectBtn) {
    selectBtn.addEventListener("click", () => {
      const centerX = (window.innerWidth / 2) - state.offsetX;
      const centerY = (window.innerHeight / 2) - state.offsetY;
      if (state.pickingPoint === 1) {
        state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
        updatePickedPointUI(1, state.point1.x, state.point1.y);
      } else if (state.pickingPoint === 2) {
        state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
        updatePickedPointUI(2, state.point2.x, state.point2.y);
      }
      closePicker();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      closeVerifier();
      if (state.point1 && state.point2) {
        calculatePixelDistance();
      }
    });
  }

  if (selectNewBtn) {
    selectNewBtn.addEventListener("click", () => {
      const centerX = (window.innerWidth / 2) - state.offsetX;
      const centerY = (window.innerHeight / 2) - state.offsetY;
      if (state.pickingPoint === 1) {
        state.point1 = { x: Math.round(centerX), y: Math.round(centerY) };
        updatePickedPointUI(1, state.point1.x, state.point1.y);
      } else if (state.pickingPoint === 2) {
        state.point2 = { x: Math.round(centerX), y: Math.round(centerY) };
        updatePickedPointUI(2, state.point2.x, state.point2.y);
      }
      closeVerifier();
      if (state.point1 && state.point2) {
        calculatePixelDistance();
      }
    });
  }
}