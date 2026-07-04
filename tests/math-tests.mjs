import assert from 'node:assert/strict';
import { calculateTPSFromInputs } from '../maths.js';
import { buildCalculationProfile } from '../exportProfile.js';
import { state } from '../state.js';

function closeTo(actual, expected, tolerance = 0.000001) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`
  );
}

const cases = [
  {
    name: 'full-frame zero-offset calibration',
    input: {
      P: 100,
      D: 100,
      Wimg: 5000,
      Wsensor: 36,
      Hsensor: 24,
      d_sensor: 1000,
      delta: 0
    },
    expected: {
      pxmm: 1,
      FOV: 5000,
      d_optical: 1000,
      AOV_deg: 136.39718102729637,
      verticalAOV_deg: 118.07248693585296,
      EFL: 7.2,
      CropFactor: 1,
      EqFL_35mm: 7.2
    }
  },
  {
    name: 'crop sensor with entrance pupil offset',
    input: {
      P: 250,
      D: 50,
      Wimg: 4000,
      Wsensor: 24,
      Hsensor: 16,
      d_sensor: 1200,
      delta: 50
    },
    expected: {
      pxmm: 5,
      FOV: 800,
      d_optical: 1150,
      AOV_deg: 38.35801605162145,
      verticalAOV_deg: 26.110494447593208,
      EFL: 34.5,
      CropFactor: 1.5,
      EqFL_35mm: 51.75
    }
  },
  {
    name: 'large baseline high pixel density calibration',
    input: {
      P: 1600,
      D: 200,
      Wimg: 6000,
      Wsensor: 32,
      Hsensor: 18,
      d_sensor: 2000,
      delta: 100
    },
    expected: {
      pxmm: 8,
      FOV: 750,
      d_optical: 1900,
      AOV_deg: 22.329760355097182,
      verticalAOV_deg: 12.670040359884178,
      EFL: 81.06666666666666,
      CropFactor: 1.125,
      EqFL_35mm: 91.2
    }
  }
];

for (const testCase of cases) {
  const result = calculateTPSFromInputs(testCase.input);
  assert.ok(result, `${testCase.name} should produce a result`);

  for (const [key, expected] of Object.entries(testCase.expected)) {
    closeTo(result[key], expected);
  }
}

const invalidCases = [
  { name: 'missing baseline pixels', input: { P: 0, D: 100, Wimg: 5000, Wsensor: 36, d_sensor: 1000, delta: 0 } },
  { name: 'negative baseline distance', input: { P: 100, D: -1, Wimg: 5000, Wsensor: 36, d_sensor: 1000, delta: 0 } },
  { name: 'zero optical distance', input: { P: 100, D: 100, Wimg: 5000, Wsensor: 36, d_sensor: 50, delta: 50 } },
  { name: 'negative entrance pupil offset', input: { P: 100, D: 100, Wimg: 5000, Wsensor: 36, d_sensor: 1000, delta: -1 } }
];

for (const testCase of invalidCases) {
  assert.equal(calculateTPSFromInputs(testCase.input), null, `${testCase.name} should be rejected`);
}

const profileResult = calculateTPSFromInputs(cases[0].input);
state.lastTPSResult = profileResult;
state.tpsVersion = '1.0';
state.sourceImageFilename = 'test_image.jpg';
state.imageWidthPixels = 5000;
state.imageHeightPixels = 3570;
state.point1 = { x: 2500, y: 1785 };
state.point2 = { x: 2600, y: 1785 };
state.baselinePixelDistance = 100;
state.baselineDistanceMM = 100;
state.sensorWidthMM = 36;
state.sensorHeightMM = 24;
state.focusDistanceMM = 1000;
state.entrancePupilOffsetMM = 0;
state.mmPerPixel = 1;

const profile = buildCalculationProfile();
assert.equal(profile.app.name, 'LIMNLENS');
assert.equal(profile.app.license, 'AGPL-3.0-or-later');
assert.equal(profile.image.filename, 'test_image.jpg');
assert.equal(profile.points.pixelDistance, 100);
assert.equal(profile.measurements.sensorHeightMM, 24);
assert.equal(profile.results.effectiveFocalLengthMM, 7.2);
assert.equal(profile.results.verticalAngleOfViewDeg, 118.072487);

console.log(`math-tests: ${cases.length + invalidCases.length + 1} cases passed`);
