import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulate } from '../src/js/engine.js';

// Shared base inputs — override per test as needed.
// roi=0 and inflationRate=0 by default for predictable arithmetic.
const BASE = {
  currentAge: 30,
  currentPortfolioValue: 0,
  monthlySavings: 1000,
  savingsGrowthRate: 0,
  roi: 0,
  inflationRate: 0,
  targetNetMonthlyIncome: 1000,
  deductionRate: 0,
  additionalRetirementIncome: 0,
  drawoutAge: 80,
  currentYear: 2025, // fixed so tests are deterministic
};

// ─── shape ──────────────────────────────────────────────────────────────────

test('returns yearByYear, fireNumber, projectedFireAge, portfolioAtRetirement, runway', () => {
  const r = simulate(BASE);
  assert.ok(Array.isArray(r.yearByYear));
  assert.strictEqual(typeof r.fireNumber, 'number');
  // projectedFireAge may be null or a number
  assert.ok(r.projectedFireAge === null || typeof r.projectedFireAge === 'number');
  assert.strictEqual(typeof r.portfolioAtRetirement, 'number');
  assert.ok(r.runway === null || typeof r.runway === 'number');
});

test('each yearByYear entry has required fields', () => {
  const r = simulate(BASE);
  for (const entry of r.yearByYear) {
    assert.ok('age' in entry);
    assert.ok('calendarYear' in entry);
    assert.ok('phase' in entry);
    assert.ok('nominalPortfolio' in entry);
    assert.ok('realPortfolio' in entry);
    assert.ok('nominalMonthlyWithdrawal' in entry);
    assert.ok('realMonthlyWithdrawal' in entry);
  }
});

// ─── 1. age-100 boundary ───────────────────────────────────────────────────

test('simulation runs exactly from currentAge to age 100 inclusive', () => {
  const r = simulate({ ...BASE, currentAge: 30 });
  assert.strictEqual(r.yearByYear.length, 71); // ages 30..100 inclusive
  assert.strictEqual(r.yearByYear.at(0).age, 30);
  assert.strictEqual(r.yearByYear.at(-1).age, 100);
});

test('calendarYear is derived from currentYear and age', () => {
  const r = simulate({ ...BASE, currentAge: 30, currentYear: 2025 });
  assert.strictEqual(r.yearByYear.at(0).calendarYear, 2025);
  assert.strictEqual(r.yearByYear.at(-1).calendarYear, 2095); // 2025 + 70
});

// ─── 2. zero-floor ─────────────────────────────────────────────────────────

test('portfolio never goes below zero', () => {
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 1,
    monthlySavings: 0,
    targetNetMonthlyIncome: 100_000, // enormous withdrawal
    drawoutAge: 80,
  });
  for (const y of r.yearByYear) {
    assert.ok(y.nominalPortfolio >= 0, `nominalPortfolio negative at age ${y.age}`);
    assert.ok(y.realPortfolio >= 0, `realPortfolio negative at age ${y.age}`);
  }
});

// ─── 3. accumulation only — never reaches FIRE Number ─────────────────────

test('projectedFireAge is null when portfolio never reaches FIRE Number', () => {
  const r = simulate({
    ...BASE,
    // With roi=0, saves 1000/mo → 12000/yr for 50 yrs → 600,000 at age 80
    // Target 100,000/mo → FIRE Number ≈ 100,000×12×21 = 25,200,000
    targetNetMonthlyIncome: 100_000,
    monthlySavings: 1000,
    drawoutAge: 80,
  });
  assert.strictEqual(r.projectedFireAge, null);
});

// ─── 4. clean FIRE reach — projectedFireAge correct ────────────────────────

test('projectedFireAge = currentAge when portfolio already exceeds FIRE Number', () => {
  // drawoutAge=90: 11 drawout years (90..100), withdrawal=12000/yr
  // FIRE Number = 12000 × 11 = 132,000
  // currentPortfolioValue=200,000 > 132,000 → FIRE reached immediately
  const r = simulate({
    ...BASE,
    currentPortfolioValue: 200_000,
    monthlySavings: 0,
    targetNetMonthlyIncome: 1000,
    drawoutAge: 90,
  });
  assert.strictEqual(r.projectedFireAge, 30);
  // FIRE Number should be 132,000 (within €1 due to binary search)
  assert.ok(Math.abs(r.fireNumber - 132_000) < 1);
});

// ─── 5. sustainable drawout — runway is null ──────────────────────────────

test('runway is null when portfolio survives to age 100', () => {
  // drawoutAge=80, 21 drawout years, 12000/yr gross → FIRE Number = 252,000
  // 1,000,000 >> 252,000 → portfolio should survive easily
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 1_000_000,
    monthlySavings: 0,
    targetNetMonthlyIncome: 1000,
    drawoutAge: 80,
  });
  assert.strictEqual(r.runway, null);
  assert.ok(r.yearByYear.at(-1).nominalPortfolio > 0);
});

// ─── 6. depletion — flatline and runway ────────────────────────────────────

test('portfolio flatlines at 0 and runway is correct', () => {
  // drawoutAge=80, roi=0, inflation=0, withdrawal=12000/yr
  // Starting portfolio: 25,000
  //   Age 80: 25000 − 12000 = 13000
  //   Age 81: 13000 − 12000 =  1000
  //   Age 82:  1000 − 12000 →    0  (depletionAge = 82)
  //   Ages 83-100: 0 (flatline)
  // runway = 82 − 80 = 2
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 25_000,
    monthlySavings: 0,
    drawoutAge: 80,
  });
  assert.strictEqual(r.runway, 2);
  // All entries from depletion onward must be 0
  const depleted = r.yearByYear.filter(y => y.age >= 82);
  assert.ok(depleted.length > 0);
  for (const y of depleted) {
    assert.strictEqual(y.nominalPortfolio, 0);
    assert.strictEqual(y.realPortfolio, 0);
  }
});

// ─── 7. savings growth rate compounding ────────────────────────────────────

test('savings growth rate compounds annually until drawoutAge', () => {
  // monthlySavings=1000, savingsGrowthRate=10%, roi=0, currentPortfolioValue=0
  // Age 30: annualSavings = 1000×12 = 12000 → portfolio = 12000
  // Age 31: annualSavings = 1100×12 = 13200 → portfolio = 25200
  // Age 32: annualSavings = 1210×12 = 14520 → portfolio = 39720
  // Age 33+ (drawout, no target income): portfolio stays at 39720
  const r = simulate({
    ...BASE,
    currentAge: 30,
    currentPortfolioValue: 0,
    monthlySavings: 1000,
    savingsGrowthRate: 0.1,
    drawoutAge: 33,
    targetNetMonthlyIncome: 0, // no withdrawal
  });

  const at = (age) => r.yearByYear.find(y => y.age === age);

  assert.ok(Math.abs(at(30).nominalPortfolio - 12_000) < 0.01);
  assert.ok(Math.abs(at(31).nominalPortfolio - 25_200) < 0.01);
  assert.ok(Math.abs(at(32).nominalPortfolio - 39_720) < 0.01);
  // Drawout phase with 0 withdrawal — portfolio should not change
  assert.ok(Math.abs(at(33).nominalPortfolio - 39_720) < 0.01);
  assert.ok(Math.abs(at(50).nominalPortfolio - 39_720) < 0.01);
});

// ─── 8. inflation grossing-up of withdrawal ───────────────────────────────

test('real monthly withdrawal stays constant across all drawout years', () => {
  // inflationRate=10%, targetNetMonthlyIncome=1000, no deduction
  // Year N of drawout: nominalMonthlyWithdrawal = 1000 × 1.1^N
  // inflationFactor at age (currentAge + N) = 1.1^N
  // realMonthlyWithdrawal = 1000 × 1.1^N / 1.1^N = 1000 (constant)
  const r = simulate({
    ...BASE,
    currentAge: 60,
    currentPortfolioValue: 1e9, // huge — no depletion
    monthlySavings: 0,
    inflationRate: 0.1,
    roi: 0,
    targetNetMonthlyIncome: 1000,
    drawoutAge: 60,
  });

  const drawout = r.yearByYear.filter(y => y.phase === 'drawout');
  assert.ok(drawout.length > 0);
  for (const y of drawout) {
    assert.ok(
      Math.abs(y.realMonthlyWithdrawal - 1000) < 0.01,
      `realMonthlyWithdrawal at age ${y.age} expected ~1000 got ${y.realMonthlyWithdrawal}`,
    );
  }
});

// ─── 9. deduction rate grossing-up ────────────────────────────────────────

test('deduction rate grosses up gross withdrawal correctly', () => {
  // targetNetMonthlyIncome=1000, deductionRate=0.25
  // Net annual need = 12000, gross = 12000 / 0.75 = 16000
  // nominalMonthlyWithdrawal = 16000 / 12 ≈ 1333.33
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 1e8,
    monthlySavings: 0,
    inflationRate: 0,
    roi: 0,
    targetNetMonthlyIncome: 1000,
    deductionRate: 0.25,
    drawoutAge: 80,
  });

  const first = r.yearByYear.find(y => y.age === 80);
  assert.ok(Math.abs(first.nominalMonthlyWithdrawal - 16_000 / 12) < 0.01);
});

// ─── 10. additional retirement income offset ──────────────────────────────

test('additional retirement income reduces portfolio withdrawal', () => {
  // targetNetMonthlyIncome=2000, additionalRetirementIncome=1500
  // netNeeded from portfolio = (2000 − 1500) × 12 = 6000/yr
  // nominalMonthlyWithdrawal = 6000 / 12 = 500
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 1e8,
    monthlySavings: 0,
    inflationRate: 0,
    roi: 0,
    targetNetMonthlyIncome: 2000,
    additionalRetirementIncome: 1500,
    drawoutAge: 80,
  });

  const first = r.yearByYear.find(y => y.age === 80);
  assert.ok(Math.abs(first.nominalMonthlyWithdrawal - 500) < 0.01);
});

test('additional retirement income >= target nets zero portfolio withdrawal', () => {
  // No withdrawal needed from portfolio
  const r = simulate({
    ...BASE,
    currentAge: 80,
    currentPortfolioValue: 50_000,
    monthlySavings: 0,
    inflationRate: 0,
    roi: 0,
    targetNetMonthlyIncome: 1000,
    additionalRetirementIncome: 2000, // covers target
    drawoutAge: 80,
  });

  // Portfolio should never decrease (roi=0, gross withdrawal=0)
  for (const y of r.yearByYear.filter(y => y.phase === 'drawout')) {
    assert.strictEqual(y.nominalMonthlyWithdrawal, 0);
    assert.ok(Math.abs(y.nominalPortfolio - 50_000) < 0.01);
  }
  assert.strictEqual(r.runway, null);
});

// ─── 11. real vs nominal values ───────────────────────────────────────────

test('realPortfolio = nominalPortfolio / (1+inflationRate)^yearsSinceCurrentAge', () => {
  const inflationRate = 0.05;
  const r = simulate({
    ...BASE,
    currentAge: 30,
    currentPortfolioValue: 1e9, // large, no depletion
    monthlySavings: 0,
    inflationRate,
    roi: 0,
    drawoutAge: 50,
  });

  for (const y of r.yearByYear) {
    const expectedFactor = Math.pow(1 + inflationRate, y.age - 30);
    const expectedReal = y.nominalPortfolio / expectedFactor;
    assert.ok(
      Math.abs(y.realPortfolio - expectedReal) < 0.01,
      `realPortfolio incorrect at age ${y.age}`,
    );
  }
});

// ─── 12. portfolioAtRetirement ────────────────────────────────────────────

test('portfolioAtRetirement is the portfolio value entering the drawout phase', () => {
  // After accumulation, portfolio = 0 + (1000×12×50) = 600,000 (with roi=0)
  // Capture: portfolioAtRetirement should be 600,000
  const r = simulate({
    ...BASE,
    currentAge: 30,
    currentPortfolioValue: 0,
    monthlySavings: 1000,
    savingsGrowthRate: 0,
    roi: 0,
    drawoutAge: 80,
  });
  // 50 accumulation years × 12000/yr = 600,000
  assert.ok(Math.abs(r.portfolioAtRetirement - 600_000) < 0.01);
});

test('inflation adjusts target monthly income starting from currentAge, not drawoutAge', () => {
  // currentAge = 30, drawoutAge = 40 (10 years of accumulation inflation)
  // targetNetMonthlyIncome = 1000 (12000/yr)
  // inflationRate = 5%
  // At age 40 (first year of retirement):
  // Nominal target monthly withdrawal should be 1000 * (1.05)^10 = 1628.89
  const r = simulate({
    ...BASE,
    currentAge: 30,
    drawoutAge: 40,
    targetNetMonthlyIncome: 1000,
    inflationRate: 0.05,
    currentPortfolioValue: 1e9, // huge portfolio
    monthlySavings: 0,
    roi: 0,
  });

  const age40 = r.yearByYear.find(y => y.age === 40);
  const expectedNominalWithdrawal = 1000 * Math.pow(1.05, 10);
  assert.ok(
    Math.abs(age40.nominalMonthlyWithdrawal - expectedNominalWithdrawal) < 0.01,
    `expected nominal withdrawal at age 40 to be around ${expectedNominalWithdrawal}, got ${age40.nominalMonthlyWithdrawal}`
  );
});

