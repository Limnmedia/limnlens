// main.js

console.log("[07] main.js loaded");

import { state } from "./state.js";
import { loadImage, resetImageState, renderThumbnail } from "./imageLoader.js";
import { updateDistance, calculateTPS } from "./maths.js";
import { startPicker, selectPickedPoint } from "./picker.js";
import { startVerifier, selectNewPoint } from "./verifier.js";
import { centerImage, centerOnPoint, drawCanvas, animateVerify, setupDragging } from "./canvas.js";


// ===============================
// 🔧 DOM Bindings
// ===============================
const dom = {
    fileInput: document.getElementById("fileInput"),
    loadImageBtn: document.getElementById("loadImageBtn"),
    loadTestImageBtn: document.getElementById("loadTestImageBtn"),

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

    // Manual Input Fields
    sensorWidth: document.getElementById("sensorWidth"),
    sensorHeight: document.getElementById("sensorHeight"),
    baselineDistance: document.getElementById("baselineDistance"),
    focusDistance: document.getElementById("focusDistance"),
    saveInputBtn: document.getElementById("saveInputBtn")
};

// ===============================
// 🧠 Application Bootstrap
// ===============================
function initApp() {
    resetImageState();
    console.log("[BOOT] Initializing app...");

    // Load image via file input
    dom.loadImageBtn.addEventListener("click", () => dom.fileInput.click());

    // Load test image from a predefined path
    dom.loadTestImageBtn.addEventListener("click", () => {
        const img = new Image();
        img.onload = () => {
            state.img = img;
            state.imageWidthPixels = img.naturalWidth;
            state.imageHeightPixels = img.naturalHeight;
            state.sourceImageFilename = "test_image.jpg";

            dom.pickPoint1Btn.disabled = false;
            dom.pickPoint2Btn.disabled = false;

            const cx = Math.round(state.imageWidthPixels / 2);
            const cy = Math.round(state.imageHeightPixels / 2);
            dom.imageCenterLabel.textContent = `${cx}, ${cy}`;

            // ✅ Now update the thumbnail too
            renderThumbnail("test_image.jpg", "./img/test_image.jpg");

            console.log(`[🧪] Test image loaded: ${img.naturalWidth}×${img.naturalHeight}`);
        };
        img.src = "./img/test_image.jpg";
    });

    dom.fileInput.addEventListener("change", (e) => {
        loadImage(e);

        setTimeout(() => {
            if (state.img) {
                dom.pickPoint1Btn.disabled = false;
                dom.pickPoint2Btn.disabled = false;

                const cx = Math.round(state.imageWidthPixels / 2);
                const cy = Math.round(state.imageHeightPixels / 2);
                dom.imageCenterLabel.textContent = `${cx}, ${cy}`;
                console.log(`[📐] Image center: ${cx}, ${cy}`);
            }
        }, 50);
    });

    // Point selection flow
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
            () => updateDistance(dom.pixelDistanceLabel)
        )
    );

    dom.confirmBtn.addEventListener("click", () => {
        dom.verifyOverlay.style.display = "none";

        const pt = state.pickingPoint === 1 ? state.point1 : state.point2;
        const label = state.pickingPoint === 1 ? dom.pickedPoint1Label : dom.pickedPoint2Label;

        if (pt && label) {
            label.textContent = `${pt.x}, ${pt.y}`;
            console.log(`✅ [Confirm] Point ${state.pickingPoint} confirmed at (${pt.x}, ${pt.y})`);
        } else {
            console.warn("⚠️ [Confirm] Point or label not found");
        }
        if (state.pickingPoint === 1) {
            state.point1Status = "confirmed";
        } else {
            state.point2Status = "confirmed";
        }
        updateStatusUI();
        // ⏱ Recalculate pixel distance
        if (state.point1 && state.point2) {
            updateDistance(dom.pixelDistanceLabel);
            console.log("📏 [Confirm] Pixel distance recalculated.");
        } else {
            console.warn("📏 [Confirm] Waiting for both points to recalculate distance.");
        }
    });

    // Verification step
    dom.verifyPoint1Btn.addEventListener("click", () => startVerifier(1));
    dom.verifyPoint2Btn.addEventListener("click", () => startVerifier(2));
    dom.confirmBtn.addEventListener("click", () => (dom.verifyOverlay.style.display = "none"));

    dom.selectNewBtn.addEventListener("click", () =>
        selectNewPoint(
            dom.verifyCanvas,
            dom.pickedPoint1Label,
            dom.pickedPoint2Label,
            dom.pixelDistanceLabel,
            updateDistance,
            animateVerify
        )
    );

    function validateInput(el, required = true) {
        const val = parseFloat(el.value);
        const isValid = !isNaN(val) && (required ? el.value.trim() !== "" : true);

        el.classList.remove("valid", "missing");
        el.classList.add(isValid ? "valid" : "missing");

        return isValid ? val : null;
    }

    // Save Manual Data to State
    dom.saveInputBtn.addEventListener("click", () => {
  const width = validateInput(dom.sensorWidth, true);
  const height = validateInput(dom.sensorHeight, false);
  const baseline = validateInput(dom.baselineDistance, true);
  const focus = validateInput(dom.focusDistance, true);

  if (width !== null) state.sensorWidthMM = width;
  if (height !== null) state.sensorHeightMM = height;
  if (baseline !== null) state.baselineDistanceMM = baseline;
  if (focus !== null) state.focusDistanceMM = focus;

  console.log("📥 Manual data saved to state:", {
    sensorWidthMM: state.sensorWidthMM,
    sensorHeightMM: state.sensorHeightMM,
    baselineDistanceMM: state.baselineDistanceMM,
    focusDistanceMM: state.focusDistanceMM
  });

  renderManualDisplay(); // Keep this if you're showing values elsewhere
});
    // Canvas interactivity
    setupDragging(dom.pickCanvas, true); // Picker canvas: instant redraw
    setupDragging(dom.verifyCanvas, false); // Verifier canvas: animated redraw
    const toggleBtn = document.getElementById("testToggleBtn");
    const testBtn = document.getElementById("loadTestImageBtn");

    toggleBtn.addEventListener("click", () => {
        const isHidden = testBtn.classList.contains("hidden");
        testBtn.classList.toggle("hidden");
        toggleBtn.textContent = isHidden ? "➖ Hide Test Loader" : "➕ Show Test Loader";
    });
    console.log("[✅] App initialized.");
}

initApp();

export function updateStatusUI() {
    const point1El = document.getElementById("point1Verified");
    const point2El = document.getElementById("point2Verified");

    point1El.textContent = state.point1Status;
    point2El.textContent = state.point2Status;

    point1El.className = "status-indicator " + state.point1Status;
    point2El.className = "status-indicator " + state.point2Status;
}


// Inside initApp():
const calcBtn = document.getElementById("calculateTPSBtn");
if (calcBtn) {
  calcBtn.addEventListener("click", () => {
    const result = calculateTPS();
    if (result) {
      console.log("[✅] Focal length calculated successfully");
    }
  });
}

export function renderManualDisplay() {
  console.log("[UI] Rendering manual data display...");

  const fields = [
    { id: 'displaySensorWidth', value: state.sensorWidthMM, required: true },
    { id: 'displaySensorHeight', value: state.sensorHeightMM, required: false },
    { id: 'displayImageWidth', value: state.imageWidthPixels, required: false },
    { id: 'displayImageHeight', value: state.imageHeightPixels, required: false },
    { id: 'displayBaselineDistancePX', value: state.baselinePixelDistance, required: false },
    { id: 'displayBaselineDistance', value: state.baselineDistanceMM, required: true },
    { id: 'displayFocusDistance', value: state.focusDistanceMM, required: true }
  ];

  fields.forEach(({ id, value, required }) => {
    const el = document.getElementById(id);
    const displayValue = (value !== null && value !== undefined) ? value : '--';

    if (!el) {
      console.warn(`[UI] ⚠️ Missing DOM element: #${id}`);
      return;
    }

    el.textContent = displayValue;
    el.classList.remove('missing', 'valid');

    if ((value === null || value === '' || isNaN(value)) && required) {
      el.classList.add('missing');
    } else {
      el.classList.add('valid');
    }
  });
}