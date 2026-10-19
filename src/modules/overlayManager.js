// overlayManager.js — centralized fullscreen overlay visibility

console.log("[10.5] Overlay Manager loaded");

export function showOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.style.display = 'flex'; // or 'block' depending on layout
    overlay.style.cursor = 'crosshair'; // optional
    overlay.style.zIndex = '999'; // optional
    console.log(`✅ Showing overlay: ${id}`);
  } else {
    console.warn(`⚠️ showOverlay: Overlay with ID '${id}' not found.`);
  }
}

export function hideOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.style.display = 'none';
    console.log(`✅ Hiding overlay: ${id}`);
  } else {
    console.warn(`⚠️ hideOverlay: Overlay with ID '${id}' not found.`);
  }
}

export function toggleOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    if (overlay.style.display === 'none' || overlay.style.display === '') {
      overlay.style.display = 'flex';
      console.log(`✅ Toggled overlay ON: ${id}`);
    } else {
      overlay.style.display = 'none';
      console.log(`✅ Toggled overlay OFF: ${id}`);
    }
  } else {
    console.warn(`⚠️ toggleOverlay: Overlay with ID '${id}' not found.`);
  }
}

export function hideAllOverlays(ids = []) {
  ids.forEach(id => hideOverlay(id));
}
// use : hideAllOverlays(['canvasPicker', 'canvasVerifier']);