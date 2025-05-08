// canvas.js


import { state } from './state.js';

console.log("[04] canvas.js loaded");


// ----------------------------- centerImage

export function centerImage() {
  state.offsetX = (pickCanvas.width - state.img.naturalWidth) / 2;
  state.offsetY = (pickCanvas.height - state.img.naturalHeight) / 2;
    console.warn("--> image centered <--");
}

// ----------------------------- centerOnPoint

export function centerOnPoint(pt) {
  if (!pt) return;
  state.offsetX = (verifyCanvas.width / 2) - pt.x;
  state.offsetY = (verifyCanvas.height / 2) - pt.y;
    console.warn("image centered on point");
}

// ----------------------------- drawCanvas

export function drawCanvas(canvas, highlightPoint = null) {
  const ctx = canvas.getContext('2d');
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

// ----------------------------- animateVrify
export function animateVerify() {
  state.verifierAnimating = true;

  function step() {
    const pt = (state.pickingPoint === 1) ? state.point1 : state.point2;

    // 🛑 Exit if animation is flagged off or user is dragging
    if (!pt || !state.verifierAnimating || state.isDragging) {
      console.warn("[🛑] Verifier animation cancelled (flag or drag)");
      return;
    }

    // Initialize the animated point if needed
    if (!state.currentPoint) {
      state.currentPoint = { x: pt.x, y: pt.y };
    }

    const dx = pt.x - state.currentPoint.x;
    const dy = pt.y - state.currentPoint.y;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      state.currentPoint = { x: pt.x, y: pt.y };
      drawCanvas(verifyCanvas, state.currentPoint);
      console.warn("✅ Verifier animation completed.");
      return;
    }

    state.currentPoint.x += dx * 0.2;
    state.currentPoint.y += dy * 0.2;

    drawCanvas(verifyCanvas, state.currentPoint);
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ----------------------------- setupDragging

// Setup unified dragging for picker and verifier canvas
export function setupDragging(canvas, isPicker) {
  function getEventPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  }

    // ----------------------------- startDrag
    
   function startDrag(e) {
    e.preventDefault(); // Prevent scrolling on touch
    const pos = getEventPosition(e);
    state.verifierAnimating = false;  // Immediately stop animating
    state.isDragging = true;
    state.dragStartX = pos.x;
    state.dragStartY = pos.y;
    canvas.style.cursor = 'grabbing';
  }

    // ----------------------------- dragMove
    
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

      if (isPicker) {
        drawCanvas(pickCanvas);
      } else {
        drawCanvas(verifyCanvas, state.currentPoint); // ✅ redraw during verifier drag
      }
    }
    
// ----------------------------- endDrag
    
  function endDrag() {
    state.isDragging = false;
    canvas.style.cursor = 'grab';
  }

  // --- Mouse Events
  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', dragMove);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('mouseleave', endDrag);

  // --- Touch Events
  canvas.addEventListener('touchstart', startDrag);
  canvas.addEventListener('touchmove', dragMove);
  canvas.addEventListener('touchend', endDrag);
  canvas.addEventListener('touchcancel', endDrag);
}

setupDragging(pickCanvas, true);    // Picker canvas = immediate redraw
setupDragging(verifyCanvas, false); // Verifier canvas = animation redraw