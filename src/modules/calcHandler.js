// calcHandler.js — Handles TPS calculations and updating result fields
console.log("[08]  calcHandler.js loaded");

export function calculateTPS() {
  const get = id => parseFloat(document.getElementById(id)?.value || 0);
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val.toFixed(3);
  };

  const P = get("P_image");           // pixel distance between reference points
  const D = get("D_real");            // real-world measured distance (mm)
  const Wimg = get("W_image");        // image width in pixels
  const d_sensor = get("d_sensor");   // measured camera-to-subject distance (mm)
  const delta = get("Delta");         // entrance pupil offset (mm)
  const Wsensor = get("W_sensor");    // sensor width (mm)

  if (!(P && D && Wimg && d_sensor && Wsensor)) {
    console.warn("⚠️ Missing inputs for calculation");
    updateStatus("⚠️ Please fill in all required fields");
    return;
  }

  // Step-by-step calculations
  const pxmm = P / D;
  const FOV = Wimg / pxmm;
  const d_opt = d_sensor - delta;
  const AOV = 2 * Math.atan(FOV / (2 * d_opt));
  const EFL = Wsensor / (2 * Math.tan(AOV / 2));
  const Crop = 36 / Wsensor;
  const EqFL = EFL * Crop;

  // Output to UI
  set("pxmm_scene", pxmm);
  set("FOV_real", FOV);
  set("d_optical", d_opt);
  set("AOV", AOV * 180 / Math.PI);
  set("EFL", EFL);
  set("Crop", Crop);
  set("EqFL", EqFL);

  updateStatus("✅ Calculation complete");
  console.log("📐 TPS Calculated:", { pxmm, FOV, d_opt, AOV, EFL, Crop, EqFL });
}