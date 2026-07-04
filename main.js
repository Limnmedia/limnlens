// main.js

console.log("[07] main.js loaded");

import { state } from "./state.js";
import { loadImage, resetImageState, renderThumbnail } from "./imageLoader.js";
import { updateDistance, calculateTPS } from "./maths.js";
import { startPicker, selectPickedPoint } from "./picker.js";
import { startVerifier, selectNewPoint } from "./verifier.js";
import { animateVerify, setupDragging } from "./canvas.js";
import { renderManualDisplay, renderPixelDistance, renderStatus, renderTPSResult, updateStatusUI } from "./ui.js";

const dom = {
  fileInput: document.getElementById("fileInput"),
  loadImageBtn: document.getElementById("loadImageBtn"),
  loadTestImageBtn: document.getElementById("loadTestImageBtn"),
  testToggleBtn: document.getElementById("testToggleBtn"),

  pickPoint1Btn: document.getElementById("pickPoint1Btn"),
  pickPoint2Btn: document.getElementById("pickPoint2Btn"),
  verifyPoint1Btn: document.getElementById("verifyPoint1Btn"),
  verifyPoint2Btn: document.getElementById("verifyPoint2Btn"),

  selectBtn: document.getElementById("selectBtn"),
  confirmBtn: document.getElementById("confirmBtn"),
  selectNewBtn: document.getElementById("selectNewBtn"),

  imageCenterLabel: document.getElementById("imageCenter"),
  pickedPoint1Label: document.getElementById("pickedPoint1"),
  pickedPoint2Label: document.getElementById("pickedPoint2"),
  pixelDistanceLabel: document.getElementById("pixelDistance"),

  pickerOverlay: document.getElementById("pickerOverlay"),
  verifyOverlay: document.getElementById("verifyOverlay"),
  pickCanvas: document.getElementById("pickCanvas"),
  verifyCanvas: document.getElementById("verifyCanvas"),

  sensorWidth: document.getElementById("sensorWidth"),
  sensorHeight: document.getElementById("sensorHeight"),
  baselineDistance: document.getElementById("baselineDistance"),
  focusDistance: document.getElementById("focusDistance"),
  entrancePupilOffset: document.getElementById("entrancePupilOffset"),
  saveInputBtn: document.getElementById("saveInputBtn"),
  calculateTPSBtn: document.getElementById("calculateTPSBtn")
};

function setImageLoadedUI() {
  dom.pickPoint1Btn.disabled = false;
  dom.pickPoint2Btn.disabled = false;

  const cx = Math.round(state.imageWidthPixels / 2);
  const cy = Math.round(state.imageHeightPixels / 2);
  dom.imageCenterLabel.textContent = `${cx}, ${cy}`;
}

function validateNumberInput(el, { required, min }) {
  const rawValue = el.value.trim();
  const hasValue = rawValue !== "";
  const value = parseFloat(rawValue);
  const isValid = required
    ? hasValue && Number.isFinite(value) && value >= min
    : !hasValue || (Number.isFinite(value) && value >= min);

  el.classList.remove("valid", "missing");
  el.classList.add(isValid ? "valid" : "missing");

  if (!hasValue && !required) return 0;
  return isValid ? value : null;
}

function getReadinessIssue() {
  if (!state.img || !(state.imageWidthPixels > 0)) return "Load an image before calculating.";
  if (!state.point1 || !state.point2 || !(state.baselinePixelDistance > 0)) {
    return "Pick two image points before calculating.";
  }
  if (!(state.sensorWidthMM > 0)) return "Enter a sensor width greater than 0 mm.";
  if (!(state.baselineDistanceMM > 0)) return "Enter a baseline distance greater than 0 mm.";
  if (!(state.focusDistanceMM > 0)) return "Enter a focus distance greater than 0 mm.";
  if (!Number.isFinite(state.entrancePupilOffsetMM) || state.entrancePupilOffsetMM < 0) {
    return "Enter an entrance pupil offset of 0 mm or greater.";
  }
  if (state.focusDistanceMM - state.entrancePupilOffsetMM <= 0) {
    return "Focus distance must be greater than entrance pupil offset.";
  }

  return "";
}

function updateCalculationReadiness(showMessage = false) {
  const issue = getReadinessIssue();
  dom.calculateTPSBtn.disabled = Boolean(issue);

  if (showMessage || !issue) {
    renderStatus(issue || "Ready to calculate", Boolean(issue));
  }

  return !issue;
}

function initApp() {
  resetImageState();
  console.log("[BOOT] Initializing app...");

  function refreshDistanceDisplay() {
    const distance = updateDistance();
    if (distance !== null) {
      renderPixelDistance(dom.pixelDistanceLabel);
      renderManualDisplay();
      updateCalculationReadiness();
    }
  }

  dom.loadImageBtn.addEventListener("click", () => dom.fileInput.click());

  dom.loadTestImageBtn.addEventListener("click", () => {
    const img = new Image();
    img.onload = () => {
      state.img = img;
      state.imageWidthPixels = img.naturalWidth;
      state.imageHeightPixels = img.naturalHeight;
      state.sourceImageFilename = "test_image.jpg";

      setImageLoadedUI();
      renderThumbnail("test_image.jpg", "./img/test_image.jpg");
      renderManualDisplay();
      updateCalculationReadiness();

      console.log(`[test] Test image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
    };
    img.src = "./img/test_image.jpg";
  });

  dom.fileInput.addEventListener("change", (e) => {
    loadImage(e);

    setTimeout(() => {
      if (state.img) {
        setImageLoadedUI();
        renderManualDisplay();
        updateCalculationReadiness();
        console.log(`[image] Image center: ${dom.imageCenterLabel.textContent}`);
      }
    }, 50);
  });

  dom.pickPoint1Btn.addEventListener("click", () => startPicker(1, dom.pickCanvas, dom.pickerOverlay));
  dom.pickPoint2Btn.addEventListener("click", () => startPicker(2, dom.pickCanvas, dom.pickerOverlay));

  dom.selectBtn.addEventListener("click", () =>
    selectPickedPoint(
      dom.pickCanvas,
      dom.pickerOverlay,
      dom.pickedPoint1Label,
      dom.pickedPoint2Label,
      dom.verifyPoint1Btn,
      dom.verifyPoint2Btn,
      refreshDistanceDisplay,
      updateStatusUI
    )
  );

  dom.confirmBtn.addEventListener("click", () => {
    dom.verifyOverlay.style.display = "none";

    const pt = state.pickingPoint === 1 ? state.point1 : state.point2;
    const label = state.pickingPoint === 1 ? dom.pickedPoint1Label : dom.pickedPoint2Label;

    if (pt && label) {
      label.textContent = `${pt.x}, ${pt.y}`;
      console.log(`[confirm] Point ${state.pickingPoint} confirmed at (${pt.x}, ${pt.y})`);
    } else {
      console.warn("[confirm] Point or label not found");
    }

    if (state.pickingPoint === 1) {
      state.point1Status = "confirmed";
    } else {
      state.point2Status = "confirmed";
    }

    updateStatusUI();

    if (state.point1 && state.point2) {
      refreshDistanceDisplay();
      console.log("[confirm] Pixel distance recalculated.");
    } else {
      updateCalculationReadiness();
      console.warn("[confirm] Waiting for both points to recalculate distance.");
    }
  });

  dom.verifyPoint1Btn.addEventListener("click", () => startVerifier(1, dom.verifyCanvas, dom.verifyOverlay));
  dom.verifyPoint2Btn.addEventListener("click", () => startVerifier(2, dom.verifyCanvas, dom.verifyOverlay));

  dom.selectNewBtn.addEventListener("click", () =>
    selectNewPoint(
      dom.verifyCanvas,
      dom.pickedPoint1Label,
      dom.pickedPoint2Label,
      dom.pixelDistanceLabel,
      refreshDistanceDisplay,
      () => animateVerify(dom.verifyCanvas)
    )
  );

  dom.saveInputBtn.addEventListener("click", () => {
    const width = validateNumberInput(dom.sensorWidth, { required: true, min: 0.000001 });
    const height = validateNumberInput(dom.sensorHeight, { required: false, min: 0.000001 });
    const baseline = validateNumberInput(dom.baselineDistance, { required: true, min: 0.000001 });
    const focus = validateNumberInput(dom.focusDistance, { required: true, min: 0.000001 });
    const entrancePupilOffset = validateNumberInput(dom.entrancePupilOffset, { required: false, min: 0 });

    if (width !== null) state.sensorWidthMM = width;
    if (height !== null) state.sensorHeightMM = height;
    if (baseline !== null) state.baselineDistanceMM = baseline;
    if (focus !== null) state.focusDistanceMM = focus;
    if (entrancePupilOffset !== null) state.entrancePupilOffsetMM = entrancePupilOffset;

    console.log("[manual] Manual data saved to state:", {
      sensorWidthMM: state.sensorWidthMM,
      sensorHeightMM: state.sensorHeightMM,
      baselineDistanceMM: state.baselineDistanceMM,
      focusDistanceMM: state.focusDistanceMM,
      entrancePupilOffsetMM: state.entrancePupilOffsetMM
    });

    renderManualDisplay();
    updateCalculationReadiness(true);
  });

  dom.calculateTPSBtn.addEventListener("click", () => {
    if (!updateCalculationReadiness(true)) return;

    const result = calculateTPS();
    if (result) {
      renderTPSResult(result);
      console.log("[calc] Focal length calculated successfully");
    } else {
      updateCalculationReadiness(true);
    }
  });

  setupDragging(dom.pickCanvas, true);
  setupDragging(dom.verifyCanvas, false);

  dom.testToggleBtn.addEventListener("click", () => {
    const isHidden = dom.loadTestImageBtn.classList.contains("hidden");
    dom.loadTestImageBtn.classList.toggle("hidden");
    dom.testToggleBtn.textContent = isHidden ? "Hide Test Loader" : "Show Test Loader";
  });

  updateCalculationReadiness(true);
  console.log("[boot] App initialized.");
}

initApp();
