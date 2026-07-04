// canvas.js

import { state } from './state.js';

console.log("[04] canvas.js loaded");

// ----------------------------- centerImage

export function centerImage(canvas) {
  if (!canvas || !state.img) {
    console.warn("centerImage: canvas or image is missing.");
    return;
  }

  state.offsetX = (canvas.width - state.img.naturalWidth) / 2;
  state.offsetY = (canvas.height - state.img.naturalHeight) / 2;
  console.warn("--> image centered <--");
}

// ----------------------------- centerOnPoint

export function centerOnPoint(canvas, pt) {
  if (!canvas || !pt) return;

  state.offsetX = (canvas.width / 2) - pt.x;
  state.offsetY = (canvas.height / 2) - pt.y;
  console.warn("image centered on point");
}

// ----------------------------- drawCanvas

export function drawCanvas(canvas, highlightPoint = null) {
  if (!canvas || !state.img) {
    console.warn("drawCanvas: canvas or image is missing.");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn("drawCanvas: canvas context is unavailable.");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(state.offsetX, state.offsetY);
  ctx.drawImage(state.img, 0, 0);

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

  ctx.restore();
  console.warn("draw canvas!");
}

// ----------------------------- animateVerify

export function animateVerify(canvas) {
  if (!canvas) {
    console.warn("animateVerify: canvas is missing.");
    return;
  }

  state.verifierAnimating = true;

  function step() {
    const pt = state.pickingPoint === 1 ? state.point1 : state.point2;

    if (!pt || !state.verifierAnimating || state.isDragging) {
      console.warn("[stop] Verifier animation cancelled.");
      return;
    }

    if (!state.currentPoint) {
      state.currentPoint = { x: pt.x, y: pt.y };
    }

    const dx = pt.x - state.currentPoint.x;
    const dy = pt.y - state.currentPoint.y;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      state.currentPoint = { x: pt.x, y: pt.y };
      drawCanvas(canvas, state.currentPoint);
      console.warn("Verifier animation completed.");
      return;
    }

    state.currentPoint.x += dx * 0.2;
    state.currentPoint.y += dy * 0.2;

    drawCanvas(canvas, state.currentPoint);
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ----------------------------- setupDragging

export function setupDragging(canvas, isPicker) {
  if (!canvas) {
    console.warn("setupDragging: canvas is missing.");
    return;
  }

  function getEventPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e) {
    e.preventDefault();
    const pos = getEventPosition(e);
    state.verifierAnimating = false;
    state.isDragging = true;
    state.dragStartX = pos.x;
    state.dragStartY = pos.y;
    canvas.style.cursor = 'grabbing';
  }

  function dragMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();

    const pos = getEventPosition(e);
    const dx = pos.x - state.dragStartX;
    const dy = pos.y - state.dragStartY;
    state.offsetX += dx;
    state.offsetY += dy;
    state.dragStartX = pos.x;
    state.dragStartY = pos.y;

    drawCanvas(canvas, isPicker ? null : state.currentPoint);
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
}
