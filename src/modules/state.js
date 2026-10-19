console.log("[01] state.js loaded!");


export const state = {
  // Meta
  tpsVersion: "1.0",
  profileCreatedAt: "",     // ISO string populated at export time
  createdBy: "",            // User input or system field

  // Camera Metadata [from EXIF]
  cameraMake: "", 
  cameraModel: "",
  sensorWidthMM: "",

  // Lens Metadata [from EXIF]
  lensModel: "",
  isZoom: false,            // true/false
  focalLength: "",          // for primes, or zoom starting point

  // Image Metadata [from EXIF]
  imageWidthPixels: "",
  imageHeightPixels: "",
  exifTags: {},             // full raw EXIF dump

  // Measurement
  baselineDistanceMM: "",    // real-world baseline distance entered manually
  baselinePixelDistance: "", // baseline distance in pixels entered via pointPicker
  pixelPerMM: "", // calcHandler
  mmPerPixel: "", // calcHandler
  entrancePupilOffsetMM: "", // manually entered [default is zero (0)].

  // Calibration Results
  effectiveFocalLength: "", // calcHandler
  magnification: "", // calcHandler
  calibrationTarget: {      // optional 
    name: "",
    type: "",               // "flat", "volumetric", etc.
    id: "",
    notes: ""
  },

  // Core Canvas State (runtime only, not exported)
  img: null,                // HTML Image object
  point1: null,             // { x, y }
  point2: null,             // { x, y }
  pickingPoint: null,       // 1 or 2
  currentPoint: null,       // animated verify point
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  point1Picked: false,
  point2Picked: false,
  verificationConfirmed: false,

  // Extensions Block (reserved for Phase 2)
  extensions: {}
};