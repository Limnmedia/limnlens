// exifLoader
console.log("[05] exifLoader.js loaded!");

import { state } from './state.js';
import { populateExifFields } from '../ui/exifUI.js';
import { updateStatus } from '../ui/uiHelpers.js';




function decodeExposureProgram(code) {
  const map = {
    0: "Not Defined", 1: "Manual", 2: "Program AE", 3: "Aperture Priority",
    4: "Shutter Priority", 5: "Creative", 6: "Action", 7: "Portrait", 8: "Landscape"
  };
  return map[code] || `Unknown (${code})`;
}

function decodeMeteringMode(code) {
  const map = {
    0: "Unknown", 1: "Average", 2: "Center-weighted", 3: "Spot",
    4: "Multi-spot", 5: "Pattern", 6: "Partial", 255: "Other"
  };
  return map[code] || `Unknown (${code})`;
}

function decodeWhiteBalance(code) {
  return code === 1 ? "Manual" : "Auto";
}

function decodeSceneType(code) {
  if (typeof code === "string" && code.charCodeAt(0) === 1) return "Directly Photographed";
  return `Unknown (${code})`;
}

export function decodeExifTags(ifd, tagSet) {
  const decoded = {};
  for (const tagId in ifd) {
    const num = parseInt(tagId, 10);
    const tagInfo = tagSet[num];
    const name = tagInfo ? tagInfo.name : `Tag${num}`;
    decoded[name] = ifd[tagId];
  }
  return decoded;
}

// ✅ Load and parse EXIF from image using piexif
export function extractExifTags(image) {
  console.log("[4] 📦 imageHandler.js extractExifTags() fired!");

  if (!image.src) {
    updateStatus("❌ Image source is missing.");
    return;
  }

  try {
   const piexifData = piexif.load(image.src);

const ifd0Decoded = decodeExifTags(piexifData['0th'], piexif.TAGS['0th']);
const exifDecoded = decodeExifTags(piexifData.Exif, piexif.TAGS.Exif);
const gpsDecoded = decodeExifTags(piexifData.GPS, piexif.TAGS.GPS);

const tags = {
  ...ifd0Decoded,
  ...exifDecoded,
  ...gpsDecoded,
};

    console.log("[6] 📋 Decoded tags:", tags);
    state.exifTags = tags;
    populateExifFields(tags);
    updateStatus("✅ EXIF metadata loaded and rendered");
  } catch (err) {
    console.error("❌ Error reading EXIF:", err);
    updateStatus("❌ Failed to load EXIF data");
  }
}

// ✅ Parse EXIF from a dataURL directly
export function parseExifTags(dataUrl) {
  console.log("6 - 🔍 parseExifTags done.");
  try {
    const piexifData = piexif.load(dataUrl);

    const ifd0Decoded = decodeExifTags(piexifData['0th'], piexif.TAGS['0th']);
    const exifDecoded = decodeExifTags(piexifData.Exif, piexif.TAGS.Exif);
    const gpsDecoded = decodeExifTags(piexifData.GPS, piexif.TAGS.GPS);

    const tags = {
      ...ifd0Decoded,
      ...exifDecoded,
      ...gpsDecoded,
    };

    console.log("[6] 📋 Decoded tags (parseExifTags):", tags);

    state.exifTags = tags;
    populateExifFields(tags);
    updateStatus("✅ piexif EXIF parsed from dataURL");
  } catch (err) {
    console.error("❌ Failed to parse EXIF from data URL:", err);
    updateStatus("❌ Failed to parse EXIF from image");
  }
}