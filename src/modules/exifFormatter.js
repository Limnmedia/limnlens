// exifFormatter.js — clean educational EXIF formatter module
console.log("[02]  exifFormatter.js loaded");

/* -----------------------------------------------------------
   FORMATTERS
----------------------------------------------------------- */

// ✨ Exposure Time formatter
export function formatExposureTime(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatExposureTime");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid ExposureTime input:", r);
    console.groupEnd();
    return "—";
  }

  const result = `1/${Math.round(r[1] / r[0])} sec`;
  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ Rational formatter (e.g., XResolution, YResolution)
export function formatRational(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatRational");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid Rational input:", r);
    console.groupEnd();
    return "—";
  }

  const result = (r[0] / r[1]).toFixed(2);
  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ F-Number (Aperture) formatter
export function formatFNumber(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatFNumber");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid FNumber input:", r);
    console.groupEnd();
    return "—";
  }

  const result = `f/${(r[0] / r[1]).toFixed(1)}`;
  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ Shutter Speed formatter (based on EV)
export function formatShutterSpeed(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatShutterSpeed");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid ShutterSpeed input:", r);
    console.groupEnd();
    return "—";
  }

  const ev = r[0] / r[1];
  const time = Math.pow(2, -ev);
  const result = time < 1 ? `1/${Math.round(1 / time)} sec` : `${time.toFixed(2)} sec`;

  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ Focal Length formatter
export function formatFocalLength(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatFocalLength");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid FocalLength input:", r);
    console.groupEnd();
    return "—";
  }

  const result = `${(r[0] / r[1]).toFixed(1)} mm`;
  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ Aperture Value formatter
export function formatApertureValue(r) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatApertureValue");
  console.log("Input:", r);

  if (!r || !Array.isArray(r) || r[1] === 0) {
    console.warn("⚠️ Invalid ApertureValue input:", r);
    console.groupEnd();
    return "—";
  }

  const av = r[0] / r[1];
  const fnum = Math.pow(2, av / 2);
  const result = `f/${fnum.toFixed(1)}`;

  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

// ✨ GPS Coordinates formatter
export function formatGPS(coord) {
  console.groupCollapsed("🔧 [EXIF Formatter] formatGPS");
  console.log("Input:", coord);

  if (!Array.isArray(coord) || coord.length < 3) {
    console.warn("⚠️ Invalid GPS input:", coord);
    console.groupEnd();
    return "—";
  }

  const [deg, min, sec] = coord.map(c => c[0] / c[1]);
  const result = `${deg.toFixed(0)}° ${min.toFixed(0)}' ${sec.toFixed(2)}"`;

  console.log("Formatted:", result);
  console.groupEnd();
  return result;
}

/* -----------------------------------------------------------
   DECODERS
----------------------------------------------------------- */

// ✨ Exposure Program decoder
export function decodeExposureProgram(code) {
  console.groupCollapsed("🔧 [EXIF Formatter] decodeExposureProgram");
  console.log("Input:", code);

  const map = {
    0: "Not Defined",
    1: "Manual",
    2: "Program AE",
    3: "Aperture Priority",
    4: "Shutter Priority",
    5: "Creative",
    6: "Action",
    7: "Portrait",
    8: "Landscape"
  };

  const result = map[code] || `Unknown (${code})`;
  console.log("Decoded:", result);
  console.groupEnd();
  return result;
}

// ✨ Metering Mode decoder
export function decodeMeteringMode(code) {
  console.groupCollapsed("🔧 [EXIF Formatter] decodeMeteringMode");
  console.log("Input:", code);

  const map = {
    0: "Unknown",
    1: "Average",
    2: "Center-weighted",
    3: "Spot",
    4: "Multi-spot",
    5: "Pattern",
    6: "Partial",
    255: "Other"
  };

  const result = map[code] || `Unknown (${code})`;
  console.log("Decoded:", result);
  console.groupEnd();
  return result;
}

// ✨ White Balance decoder
export function decodeWhiteBalance(code) {
  console.groupCollapsed("🔧 [EXIF Formatter] decodeWhiteBalance");
  console.log("Input:", code);

  let result;
  if (code === 1) {
    result = "Manual";
  } else if (code === 0) {
    result = "Auto";
  } else {
    result = `Unknown (${code})`;
  }

  console.log("Decoded:", result);
  console.groupEnd();
  return result;
}

// ✨ Scene Type decoder
export function decodeSceneType(code) {
  console.groupCollapsed("🔧 [EXIF Formatter] decodeSceneType");
  console.log("Input:", code);

  let result;
  if (typeof code === "string" && code.charCodeAt(0) === 1) {
    result = "Directly Photographed";
  } else {
    result = `Unknown (${code})`;
  }

  console.log("Decoded:", result);
  console.groupEnd();
  return result;
}