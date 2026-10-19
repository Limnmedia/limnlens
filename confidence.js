console.log("[10] confidence.js loaded");

function roundNumber(value, digits = 3) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function pointDistance(pointA, pointB) {
  if (!pointA || !pointB) return null;
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function distanceFromCenter(point, imageWidthPixels, imageHeightPixels) {
  if (!point || !(imageWidthPixels > 0) || !(imageHeightPixels > 0)) return null;

  const centerX = imageWidthPixels / 2;
  const centerY = imageHeightPixels / 2;
  const distancePixels = Math.hypot(point.x - centerX, point.y - centerY);
  const halfDiagonal = Math.hypot(centerX, centerY);

  return {
    pixels: roundNumber(distancePixels, 2),
    percentOfHalfDiagonal: roundNumber(distancePixels / halfDiagonal * 100, 2)
  };
}

function edgeMarginPercent(point, imageWidthPixels, imageHeightPixels) {
  if (!point || !(imageWidthPixels > 0) || !(imageHeightPixels > 0)) return null;

  const nearestEdgePixels = Math.min(
    point.x,
    imageWidthPixels - point.x,
    point.y,
    imageHeightPixels - point.y
  );

  return nearestEdgePixels / Math.min(imageWidthPixels, imageHeightPixels) * 100;
}

function addWarning(warnings, level, message) {
  warnings.push({ level, message });
}

export function buildConfidenceReport({
  result,
  imageWidthPixels,
  imageHeightPixels,
  point1,
  point2,
  baselineDistanceMM,
  focusDistanceMM,
  entrancePupilOffsetMM = 0,
  sensorWidthMM
}) {
  if (!result || !(imageWidthPixels > 0) || !(imageHeightPixels > 0) || !point1 || !point2) {
    return null;
  }

  const baselinePixels = Number.isFinite(result.P) && result.P > 0
    ? result.P
    : pointDistance(point1, point2);
  if (!(baselinePixels > 0)) return null;

  const pointAFromCenter = distanceFromCenter(point1, imageWidthPixels, imageHeightPixels);
  const pointBFromCenter = distanceFromCenter(point2, imageWidthPixels, imageHeightPixels);
  const pointAEdgeMargin = edgeMarginPercent(point1, imageWidthPixels, imageHeightPixels);
  const pointBEdgeMargin = edgeMarginPercent(point2, imageWidthPixels, imageHeightPixels);
  const closestEdgeMarginPercent = Math.min(pointAEdgeMargin, pointBEdgeMargin);
  const pointSeparationPercentOfImageWidth = baselinePixels / imageWidthPixels * 100;
  const warnings = [];

  if (pointSeparationPercentOfImageWidth < 8) {
    addWarning(warnings, "warning", "Point A and Point B are very close in the image. A one-pixel picking error can move the focal length noticeably.");
  } else if (pointSeparationPercentOfImageWidth < 15) {
    addWarning(warnings, "caution", "The point baseline is usable, but a wider measured distance would be more stable.");
  }

  if (closestEdgeMarginPercent < 5) {
    addWarning(warnings, "warning", "One measured point is close to an image edge, where distortion and cropping errors are more likely.");
  } else if (closestEdgeMarginPercent < 10) {
    addWarning(warnings, "caution", "One measured point is near an image edge. Centered targets are usually easier to trust.");
  }

  if (baselineDistanceMM < 5) {
    addWarning(warnings, "caution", "The real-world baseline is very small. Small ruler or object measurement errors will matter more.");
  }

  if (sensorWidthMM < 4 || sensorWidthMM > 70) {
    addWarning(warnings, "caution", "The sensor width is outside common camera ranges. Confirm that this is the active imaging width.");
  }

  if (focusDistanceMM < 50) {
    addWarning(warnings, "caution", "The focus distance is short. Macro or miniature setups may need extra care with entrance pupil offset.");
  }

  if (entrancePupilOffsetMM > 0 && focusDistanceMM > 0) {
    const opticalRatio = (focusDistanceMM - entrancePupilOffsetMM) / focusDistanceMM;
    if (opticalRatio < 0.2) {
      addWarning(warnings, "warning", "Entrance pupil offset is very close to focus distance. Confirm both measurements.");
    } else if (opticalRatio < 0.5) {
      addWarning(warnings, "caution", "Entrance pupil offset is a large share of the focus distance. Confirm the offset direction and units.");
    }
  }

  const level = warnings.some((warning) => warning.level === "warning")
    ? "Needs review"
    : warnings.length > 0
      ? "Usable with cautions"
      : "Strong";

  return {
    level,
    summary: warnings.length > 0
      ? "Calculation completed, but review the measurement notes before using this as a final camera match."
      : "Baseline spacing and inputs look stable for this two-point calculation.",
    metrics: {
      baselinePixels: roundNumber(baselinePixels, 3),
      baselineDistanceMM: roundNumber(baselineDistanceMM, 3),
      pixelDensityPxPerMM: roundNumber(result.pxmm, 6),
      pointSeparationPercentOfImageWidth: roundNumber(pointSeparationPercentOfImageWidth, 2),
      pointAFromCenter,
      pointBFromCenter,
      closestEdgeMarginPercent: roundNumber(closestEdgeMarginPercent, 2),
      eflShiftPerPixelErrorMM: roundNumber(result.EFL / baselinePixels, 4),
      eflShiftPerBaselineMMErrorMM: roundNumber(result.EFL / baselineDistanceMM, 4)
    },
    warnings
  };
}
