import assert from 'node:assert/strict';
import { calculateTPSFromInputs } from '../maths.js';

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
      d_sensor: 1000,
      delta: 0
    },
    expected: {
      pxmm: 1,
      FOV: 5000,
      d_optical: 1000,
      AOV_deg: 136.39718102729637,
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
      d_sensor: 1200,
      delta: 50
    },
    expected: {
      pxmm: 5,
      FOV: 800,
      d_optical: 1150,
      AOV_deg: 38.35801605162145,
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
      d_sensor: 2000,
      delta: 100
    },
    expected: {
      pxmm: 8,
      FOV: 750,
      d_optical: 1900,
      AOV_deg: 22.329760355097182,
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

console.log(`math-tests: ${cases.length + invalidCases.length} cases passed`);
