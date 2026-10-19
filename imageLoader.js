import { state } from "./state.js";

console.log("[02] imageLoader.js loaded");

/**
 * Renders the thumbnail and filename in the UI
 */
export function renderThumbnail(filename, imageURL) {
  const labelEl = document.getElementById("thumbnailLabel");
  const thumbEl = document.getElementById("imageThumbnail");

  if (labelEl && thumbEl) {
    labelEl.textContent = filename;
    thumbEl.src = imageURL;
    console.log(`[🖼️] Thumbnail updated: ${filename}`);
  } else {
    console.warn("[❌] Thumbnail elements not found.");
  }
}

/**
 * Loads an image from a file input event
 * @param {Event} e
 */
export function loadImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = () => {
      state.img = img;
      state.imageWidthPixels = img.naturalWidth;
      state.imageHeightPixels = img.naturalHeight;
      state.sourceImageFilename = file.name;
      state.imageMimeType = file.type;
      state.imageFileSizeBytes = file.size;
      state.imageLastModified = new Date(file.lastModified).toISOString();

      renderThumbnail(file.name, URL.createObjectURL(file));
      console.log(`[loadImage] ✅ Image loaded: ${img.naturalWidth}×${img.naturalHeight}`);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

/**
 * Clears image-related state
 */
export function resetImageState() {
  state.img = null;
  state.imageWidthPixels = null;
  state.imageHeightPixels = null;
  state.sourceImageFilename = null;
  state.imageMimeType = null;
  state.imageFileSizeBytes = null;
  state.imageLastModified = null;

  console.log("[🔁] Image state reset.");
}