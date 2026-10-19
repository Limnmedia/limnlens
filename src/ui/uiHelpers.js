// uiHelpers.js — Handles UI updates for EXIF and canvas status
console.log("[03] uiHelpers.js loaded");

import { state } from '../modules/state.js';

// ----------------------------------------------------------- update UI values

export function updatePickedPointUI(pointNumber, x, y) {
  const label = document.getElementById(pointNumber === 1 ? 'pickedPoint1' : 'pickedPoint2');
  if (label) label.textContent = `${x}, ${y}`;
}

export function updateDistanceUI(distance) {
  const label = document.getElementById('pixelDistance');
  if (label) label.textContent = distance ? `${distance.toFixed(2)} px` : '--';
}

export function updateStatus(msg) {
  const status = document.getElementById("status");
  if (status) status.textContent = "Status: " + msg;
}

export function updateDistance(px) {
  const label = document.getElementById("distance");
  if (label) label.textContent = px.toFixed(4);
}

export function updateDistanceField(px) {
  const field = document.getElementById("baselinePixels");
  if (field) {
    field.value = px.toFixed(4);
    const event = new Event('input', { bubbles: true });
    field.dispatchEvent(event);
  }
}

export function renderExifDump(tags) {
  const output = document.getElementById("exifRaw");
  if (output) output.textContent = JSON.stringify(tags, null, 2);
}

// ----------------------------------------------------------- set point picking mode

export function setPickingPoint(index) {
  if (!state.image) {
    updateStatus("⚠️ No image loaded. Please upload an image first.");
    return;
  }

  state.pickMode = index;

  const canvas = document.getElementById('canvasPicker');
  if (canvas) {
    canvas.style.cursor = 'crosshair';
  } else {
    console.warn("⚠️ canvasPicker not found in setPickingPoint()");
  }

  updateStatus(`📍 Pick point ${index + 1}: Click on the canvas`);
}

// ----------------------------------------------------------- drawPoints()

export function drawPoints(ctx) {
  if (!state.points) return;

  ctx.lineWidth = 1.5;
  const colors = ["#ff00aa", "#00CC00"];
  const crosshairLength = 10;
  const circleRadius = 6;

  for (let i = 0; i < 2; i++) {
    const pt = state.points[i];
    if (!pt) continue;

    const drawX = pt.x + state.offsetX;
    const drawY = pt.y + state.offsetY;

    ctx.strokeStyle = colors[i];
    ctx.fillStyle = colors[i];

    // Center dot
    ctx.beginPath();
    ctx.arc(drawX, drawY, 1, 0, Math.PI * 2);
    ctx.fill();

    // Hollow circle
    ctx.beginPath();
    ctx.arc(drawX, drawY, circleRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(drawX - (circleRadius + crosshairLength), drawY);
    ctx.lineTo(drawX - circleRadius, drawY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(drawX + circleRadius, drawY);
    ctx.lineTo(drawX + (circleRadius + crosshairLength), drawY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(drawX, drawY - (circleRadius + crosshairLength));
    ctx.lineTo(drawX, drawY - circleRadius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(drawX, drawY + circleRadius);
    ctx.lineTo(drawX, drawY + (circleRadius + crosshairLength));
    ctx.stroke();

    // Number label
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${i + 1}`, drawX, drawY + circleRadius + 10);
    ctx.fillStyle = "#000000";
    ctx.fillText(`${i + 1}`, drawX, drawY + circleRadius + 10);
  }
}

// ----------------------------------------------------------- drawCanvas()

export function drawCanvas(canvas, highlightPoint = null) {
  if (!canvas) {
    console.error("❌ drawCanvas: canvas not provided!");
    return;
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(state.offsetX, state.offsetY);

  if (state.image) {
    ctx.drawImage(state.image, 0, 0);
  }

  if (highlightPoint) {
    ctx.fillStyle = 'lime';
    ctx.beginPath();
    ctx.arc(highlightPoint.x, highlightPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.pickingPoint, highlightPoint.x, highlightPoint.y - 12);
  }

  drawPoints(ctx);

  ctx.restore();
}

// ----------------------------------------------------------- clampImagePosition()

export function clampImagePosition() {
  const canvas = state.pickerCanvas;
  if (!canvas || !state.image) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imageWidth = state.image.naturalWidth;
  const imageHeight = state.image.naturalHeight;

  // Clamp X axis
  if (imageWidth > canvasWidth) {
    const minX = canvasWidth - imageWidth;
    state.offsetX = Math.min(0, Math.max(minX, state.offsetX));
  } else {
    const centerX = (canvasWidth - imageWidth) / 2;
    const maxOffset = 100;
    state.offsetX = Math.min(centerX + maxOffset, Math.max(centerX - maxOffset, state.offsetX));
  }

  // Clamp Y axis
  if (imageHeight > canvasHeight) {
    const minY = canvasHeight - imageHeight;
    state.offsetY = Math.min(0, Math.max(minY, state.offsetY));
  } else {
    const centerY = (canvasHeight - imageHeight) / 2;
    const maxOffset = 100;
    state.offsetY = Math.min(centerY + maxOffset, Math.max(centerY - maxOffset, state.offsetY));
  }
}