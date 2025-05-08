// state.js

console.log("[01] state.js loaded");


export const state = {
    name: null,
    type: null,
    size: null,
    width: null,      // naturalWidth
    height: null,     // natural height
    img: null,        // loaded image
    point1: null,
    point2: null,
    currentPoint: null,
    pickingPoint: 1, // 1 or 2
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    verifierAnimating: false,
    isVerifying: false,
    // Verification status flags
    point1Status: "idle", // options: "idle", "picked", "verifying", "confirmed"
    point2Status: "idle",
    

/**
 * Master application state object — persistent in memory, partially exported
 * Divided into logical sections: export data, runtime UI, extensions, calibration maps
 */

  
  // Overlay
  zoomMode: '100%', // options: '100%', '50%', 'fit'

  // UI state control
    inputStatus: {
    inputSensorWidth: false,
    inputsensorHeight: false,
    inputFocusDistance: false,
    inputBaselineDistance: false,
    },  

  // 
  // 📦 Export Metadata
  tpsVersion: "1.0",
  profileCreatedAt: "",       // ISO string populated at export time
  createdBy: "",              // User input or system-detected

  // 📷 Camera Metadata (from EXIF or manual entry)
  cameraMake: "",
  cameraModel: "",
  sensorWidthMM: null,        // Must be provided/verified (mm)
  sensorHeightMM: null,       // Optional (mm)

  // 📸 Lens Metadata (from EXIF or manual entry)
  lensModel: "",
  lensMake: "",               // Optional
  isZoom: false,              // true/false
  focalLength: null,          // e.g. 50.0 mm
  focalLength35mm: null,      // Optional

  // 🖼️ Image Metadata
  imageWidthPixels: null,
  imageHeightPixels: null,
  sourceImageFilename: "",    // Optional — useful for batch work or tracing
  exifTags: {},               // Full raw EXIF tag dump
  imageMimeType: "",             // e.g. "image/jpeg"
  imageFileSizeBytes: null,      // e.g. 534221
  imageLastModified: null,       // e.g. "2024-05-01T14:22:00Z"

  // 📏 Measurement Inputs
  baselineDistanceMM: null,         // Real-world physical measurement (mm)
  baselinePixelDistance: null,      // From canvas picks
    focusDistanceMM: null,
  entrancePupilOffsetMM: 0,         // Default 0 (in mm)

  // 📐 Derived Results (from TPS calculation)
  pixelPerMM: null,
  mmPerPixel: null,
  effectiveFocalLength: null,
  magnification: null,

  // 🎯 Calibration Target Metadata
  calibrationTarget: {
    name: "",
    type: "",                       // "flat", "volumetric", "natural"
    id: "",
    notes: ""
  },

  // 🔭 LENSMap Profile (10-stop sparse map of EFL vs. Focus Distance)
  lensMap: {
    stops: [
      // {
      //   focusDistanceMM: 500,
      //   effectiveFocalLength: 52.3,
      //   pixelPerMM: 25.4,
      //   magnification: 0.11,
      //   userProvided: true,
      //   timestamp: "..."
      // }
    ],
    interpolationMethod: "polynomial", // or "spline", "linear"
    source: "manual",                  // or "imported", "fitted"
    version: "1.0"
  },

  // ⛔ Runtime Only (not included in export)

  point1Picked: false,
  point2Picked: false,
  verificationConfirmed: false,
  activeCanvasId: "",               // Tracks picker/verify canvas at runtime

  // 🔁 Extensions & Distortion Models (not exported unless user confirms)
  extensions: {
    distortion: {
      k1: null,
      k2: null,
      k3: null,
      p1: null,
      p2: null,
      model: "brown-conrady",      // or "opencv", "none"
      source: "manual"             // or "fit", "imported"
    },
    notes: ""
  }
};
    
    
    

