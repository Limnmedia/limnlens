import { state } from "./state.js";

console.log("[09] exportProfile.js loaded");

function cleanFilenamePart(value) {
  return String(value || "calculation")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "calculation";
}

function roundNumber(value, digits = 6) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

export function buildCalculationProfile() {
  if (!state.lastTPSResult) return null;

  const result = state.lastTPSResult;
  const createdAt = new Date().toISOString();

  return {
    app: {
      name: "LIMNLENS",
      version: state.tpsVersion || "1.0",
      profileVersion: "1.0",
      license: "AGPL-3.0-or-later",
      createdAt
    },
    image: {
      filename: state.sourceImageFilename || "",
      widthPixels: state.imageWidthPixels,
      heightPixels: state.imageHeightPixels,
      mimeType: state.imageMimeType || "",
      fileSizeBytes: state.imageFileSizeBytes,
      lastModified: state.imageLastModified
    },
    points: {
      pointA: state.point1 ? { x: state.point1.x, y: state.point1.y } : null,
      pointB: state.point2 ? { x: state.point2.x, y: state.point2.y } : null,
      pixelDistance: state.baselinePixelDistance
    },
    measurements: {
      realDistanceBetweenPointsMM: state.baselineDistanceMM,
      sensorWidthMM: state.sensorWidthMM,
      sensorHeightMM: state.sensorHeightMM || null,
      focusDistanceMM: state.focusDistanceMM,
      entrancePupilOffsetMM: state.entrancePupilOffsetMM || 0
    },
    results: {
      effectiveFocalLengthMM: roundNumber(result.EFL),
      equivalentFocalLength35MM: roundNumber(result.EqFL_35mm),
      horizontalAngleOfViewDeg: roundNumber(result.AOV_deg),
      verticalAngleOfViewDeg: roundNumber(result.verticalAOV_deg),
      cropFactor: roundNumber(result.CropFactor),
      realFieldOfViewMM: roundNumber(result.FOV),
      pixelDensityPxPerMM: roundNumber(result.pxmm),
      opticalDistanceMM: roundNumber(result.d_optical),
      mmPerPixel: roundNumber(state.mmPerPixel)
    },
    confidence: state.lastConfidenceReport || null
  };
}

export function downloadCalculationProfile(profile) {
  if (!profile) return null;

  const imagePart = cleanFilenamePart(profile.image.filename);
  const datePart = profile.app.createdAt.slice(0, 10);
  const filename = `limnlens-${imagePart}-${datePart}.json`;
  const blob = new Blob([JSON.stringify(profile, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return filename;
}
