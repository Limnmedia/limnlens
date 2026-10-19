// exifUI.js
console.log("[04] exifUI.js loaded!");

import { 
  formatRational, 
  formatExposureTime,
  formatFNumber,
  formatShutterSpeed,
  formatFocalLength,
    formatApertureValue,
  formatGPS,
  decodeExposureProgram,
  decodeMeteringMode,
  decodeWhiteBalance,
  decodeSceneType
} from '../modules/exifFormatter.js';

import { updateStatus } from './uiHelpers.js';


export function populateExifFields(tags) {
  console.log("🔍 [START] Populating EXIF fields...");
  console.log("[DEBUG] Tags received:", tags);

  if (!tags || Object.keys(tags).length === 0) {
    console.warn("⚠️ No EXIF tags found, skipping field population.");
    updateStatus("⚠️ No EXIF tags found in image.");
    return;
  }

  const mapGroups = {
    "📷 Camera Metadata": [
      ["exif_make", tags.Make],
      ["exif_model", tags.Model],
      ["exif_software", tags.Software],
      ["exif_exposuretime", formatExposureTime(tags.ExposureTime)],
      ["exif_fnumber", tags.FNumber ? `f/${formatRational(tags.FNumber)}` : "—"],
      ["exif_shutterspeed", formatShutterSpeed(tags.ShutterSpeedValue)],
      ["exif_iso", tags.ISOSpeedRatings],
      ["exif_exposure_program", decodeExposureProgram(tags.ExposureProgram)],
      ["exif_metermode", decodeMeteringMode(tags.MeteringMode)],
      ["exif_flash", tags.Flash],
      ["exif_whitebalance", decodeWhiteBalance(tags.WhiteBalance)],
      ["exif_date", tags.DateTimeOriginal || tags.DateTime || "—"],
      ["exif_orientation", tags.Orientation],
    ],
    "📸 Lens Metadata": [
      ["exif_focal", formatFocalLength(tags.FocalLength)],
      ["exif_focal35", tags.FocalLengthIn35mmFilm ? `${tags.FocalLengthIn35mmFilm} mm` : "—"],
      ["exif_lens_model", tags.LensModel],
      ["exif_lens_make", tags.LensMake],
      ["exif_lens_info", tags.LensInfo],
      ["exif_lens_spec", Array.isArray(tags.LensSpecification) ? tags.LensSpecification.join(", ") : "—"],
      ["exif_max_aperture", tags.MaxApertureValue ? formatFNumber(tags.MaxApertureValue) : "—"],
      ["exif_aperture_value", tags.ApertureValue ? formatApertureValue(tags.ApertureValue) : "—"],
      ["exif_subject_distance", tags.SubjectDistance],
      ["exif_subject_range", tags.SubjectDistanceRange],
      ["exif_digital_zoom", tags.DigitalZoomRatio],
      ["exif_lens_serial", tags.LensSerialNumber],
    ],
    "🖼️ Image Metadata": [
      ["exif_width", tags.PixelXDimension],
      ["exif_height", tags.PixelYDimension],
      ["exif_xres", tags.XResolution ? formatRational(tags.XResolution) : "—"],
      ["exif_yres", tags.YResolution ? formatRational(tags.YResolution) : "—"],
      ["exif_colorspace", tags.ColorSpace],
      ["exif_icc_profile", tags.InterColorProfile],
      ["exif_bits", tags.BitsPerSample],
      ["exif_compression", tags.Compression],
      ["exif_components", tags.ComponentsConfiguration],
      ["exif_rendering_intent", tags.RenderingIntent],
      ["exif_transfer_function", tags.TransferFunction],
    ],
    "🧭 GPS Metadata": [
      ["exif_gps_lat", tags.GPSLatitude ? formatGPS(tags.GPSLatitude) : "—"],
      ["exif_gps_lng", tags.GPSLongitude ? formatGPS(tags.GPSLongitude) : "—"],
      ["exif_gps_alt", tags.GPSAltitude ? `${tags.GPSAltitude[0] / tags.GPSAltitude[1]} m` : "—"],
    ],
    "🧪 Other Metadata": [
      ["exif_custom_rendered", tags.CustomRendered],
      ["exif_scene_type", decodeSceneType(tags.SceneType)],
      ["exif_light_source", tags.LightSource],
      ["exif_gain_control", tags.GainControl],
      ["exif_contrast", tags.Contrast],
      ["exif_saturation", tags.Saturation],
      ["exif_sharpness", tags.Sharpness],
    ],
  };
const wImgField = document.getElementById("W_image");
  if (wImgField && tags.PixelXDimension) {
    wImgField.value = tags.PixelXDimension;
    console.log("🖼️ W_image populated from EXIF:", tags.PixelXDimension);
  }
  // Loop through each group and write fields
  for (const [groupName, fields] of Object.entries(mapGroups)) {
    console.log(`🔹 [Group] ${groupName}`);

    for (const [id, value] of fields) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = (value !== undefined && value !== "") ? value : "—";
      } else {
        console.warn(`⚠️ [Missing Element] No element found with ID: ${id}`);
      }
    }
  }

  // Also update raw JSON block
  const raw = document.getElementById("exifRaw");
  if (raw) raw.textContent = JSON.stringify(tags, null, 2);

  console.log("✅ [END] Finished populating EXIF fields.");
}