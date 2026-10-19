// canvasUtils.js









export function prepareCanvas(id, width = window.innerWidth, height = window.innerHeight) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  canvas.style.display = 'block';
  canvas.width = width;
  canvas.height = height;
  canvas.style.cursor = 'crosshair';
  return canvas;
}