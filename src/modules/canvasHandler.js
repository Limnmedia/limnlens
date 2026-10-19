// canvasHandler.js — Image loading, canvas setup, dragging, picking
console.log("[07] canvasHandler.js loaded!");

import { state } from './state.js';
import { parseExifTags } from './exifLoader.js';
import {
  updateStatus,
  updatePickedPointUI,
  updateDistanceUI,
  drawCanvas
} from '../ui/uiHelpers.js';
import { calculatePixelDistance } from './distanceHandler.js';

// --------------------------------------------------------------- initCanvas

export function initCanvas() {
  const canvas = document.getElementById("canvasPicker");
  if (!canvas) {
    console.error("❌ canvasPicker element not found!");
    return;
  }

  state.pickerCanvas = canvas;
  state.pickerCtx = canvas.getContext('2d');
  initializeCanvasEvents(canvas);
  console.log("✅ Picker canvas initialized and events ready.");
}

// --------------------------------------------------------------- handleImageInput

export function handleImageInput(inputId) {
  const fileInput = document.getElementById(inputId);
  if (!fileInput) {
    console.error("❌ File input element not found:", inputId);
    return;
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loadImage(file);
  });
}

// --------------------------------------------------------------- loadImage

export function loadImage(file) {
  const reader = new FileReader();
  reader.onload = function (evt) {
    const dataUrl = evt.target.result;
    parseExifTags(dataUrl);

    const img = new Image();
    img.onload = function () {
      onImageLoad(img);
    };
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// --------------------------------------------------------------- onImageLoad

export function onImageLoad(img) {
  const canvas = state.pickerCanvas;
  const ctx = state.pickerCtx;

  if (!canvas || !ctx) {
    console.error("❌ Picker canvas or context not initialized!");
    return;
  }

  state.image = img;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  state.offsetX = 0;
  state.offsetY = 0;

  canvas.style.display = "block";
  drawCanvas(ctx, img);
  updateStatus("✅ Image loaded and canvas activated.");
}

// --------------------------------------------------------------- initializeCanvasEvents

export function initializeCanvasEvents(canvas) {
  if (!canvas) {
    console.error("❌ Canvas not passed into initializeCanvasEvents!");
    return;
  }

  function getEventPosition(e) {
    return e.touches?.[0] || e;
  }

  function startDrag(e) {
    e.preventDefault();
    const pos = getEventPosition(e);
    state.isDragging = true;
    state.dragStartX = pos.clientX;
    state.dragStartY = pos.clientY;
    canvas.style.cursor = 'grabbing';
  }

  function dragMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    const pos = getEventPosition(e);
    const dx = pos.clientX - state.dragStartX;
    const dy = pos.clientY - state.dragStartY;
    state.offsetX += dx;
    state.offsetY += dy;
    state.dragStartX = pos.clientX;
    state.dragStartY = pos.clientY;
    drawCanvas(state.pickerCtx, state.image);
  }

  function endDrag() {
    state.isDragging = false;
    canvas.style.cursor = 'grab';
  }

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', dragMove);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', endDrag);

  canvas.addEventListener('touchstart', startDrag);
  canvas.addEventListener('touchmove', dragMove);
  canvas.addEventListener('touchend', endDrag);
  canvas.addEventListener('touchcancel', endDrag);

  // --------------------------------------------------------------- Point Picking (Click)

  canvas.addEventListener('click', (e) => {
    if (state.pickIndex === null || state.pickIndex === undefined) {
      updateStatus("ℹ️ Please select a point to pick first.");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const x = canvasX - state.offsetX;
    const y = canvasY - state.offsetY;

    if (!state.image || x < 0 || y < 0 || x > state.image.naturalWidth || y > state.image.naturalHeight) {
      updateStatus("⚠️ Click inside the image to pick a point.");
      return;
    }

    state.points[state.pickIndex] = { x, y };
    state.pickIndex = null;
    canvas.style.cursor = 'grab';

    drawCanvas(state.pickerCtx, state.image);

    if (state.points[0] && state.points[1]) {
      const distance = calculatePixelDistance();
      updateDistanceUI(distance);
    } else {
      updateStatus('✅ Point set. Pick the second point.');
    }
  });

  console.log("✅ Canvas event listeners initialized.");
}