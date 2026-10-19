// exportHandler.js — Clean Profile Exporter
import { state } from './state.js';

export function generateExportProfile() {
  const profile = {
    tpsVersion: state.tpsVersion,
    profileCreatedAt: new Date().toISOString(),
    createdBy: state.createdBy || "Unknown",

    camera: {
      make: state.cameraMake,
      model: state.cameraModel,
      sensorWidthMM: state.sensorWidthMM
    },

    lens: {
      model: state.lensModel,
      isZoom: state.isZoom,
      focalLength: state.focalLength
    },

    image: {
      widthPixels: state.imageWidthPixels,
      heightPixels: state.imageHeightPixels,
      exif: state.exifTags
    },

    measurement: {
      baselineDistanceMM: state.baselineDistanceMM,
      baselinePixelDistance: state.baselinePixelDistance,
      pixelPerMM: state.pixelPerMM,
      mmPerPixel: state.mmPerPixel,
      entrancePupilOffsetMM: state.entrancePupilOffsetMM
    },

    calibration: {
      effectiveFocalLength: state.effectiveFocalLength,
      magnification: state.magnification,
      calibrationTarget: {
        name: state.calibrationTarget.name,
        type: state.calibrationTarget.type,
        id: state.calibrationTarget.id,
        notes: state.calibrationTarget.notes
      }
    },

    extensions: state.extensions || {}
  };

  return profile;
}

// Download JSON file
export function downloadJSON(profile, filename = "lensmap-profile.json") {
  const dataStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

// Download YAML file
export function downloadYAML(profile, filename = "lensmap-profile.yaml") {
  // Very simple YAML conversion (not perfect, but works for small flat structures)
  let yamlStr = "";

  function recurse(obj, indent = 0) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        yamlStr += `${' '.repeat(indent)}${key}:\n`;
        recurse(obj[key], indent + 2);
      } else {
        yamlStr += `${' '.repeat(indent)}${key}: ${obj[key]}\n`;
      }
    }
  }

  recurse(profile);

  const blob = new Blob([yamlStr], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}