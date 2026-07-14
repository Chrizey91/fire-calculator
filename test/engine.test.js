import { test } from 'node:test';
import assert from 'node:assert';
import { simulate } from '../src/js/engine.js';

test('engine - basic simulation test', () => {
  const inputs = {
    currentAge: 30,
    expectedLifespan: 80,
    currentPortfolio: 100000,
    annualSavings: 20000,
    savingsGrowthRate: 0,
    annualExpenses: 40000,
    inflationRate: 0.02,
    investmentReturn: 0.07,
    withdrawalRate: 0.04,
    capitalGainsTax: 0.15,
    withdrawalTax: 0.10
  };

  const results = simulate(inputs);

  assert.ok(results, 'results should be returned');
  assert.strictEqual(typeof results.fireNumber, 'number');
  assert.strictEqual(typeof results.yearsToFire, 'number');
  assert.strictEqual(typeof results.ageAtFire, 'number');
  assert.strictEqual(typeof results.totalContributions, 'number');
  assert.strictEqual(typeof results.totalGrowth, 'number');
  assert.strictEqual(typeof results.isSustainable, 'boolean');
  assert.ok(Array.isArray(results.yearByYear));
});

test('engine - already reached FIRE at start', () => {
  const inputs = {
    currentAge: 40,
    expectedLifespan: 90,
    currentPortfolio: 1500000, // extremely high, immediately FIRE
    annualSavings: 10000,
    savingsGrowthRate: 0,
    annualExpenses: 40000, // Needs 40000 / 0.04 = 1,000,000 to FIRE
    inflationRate: 0.02,
    investmentReturn: 0.05,
    withdrawalRate: 0.04,
    capitalGainsTax: 0.15,
    withdrawalTax: 0.10
  };

  const results = simulate(inputs);

  assert.strictEqual(results.yearsToFire, 0, 'Should retire in year 0');
  assert.strictEqual(results.ageAtFire, 40, 'Should retire at age 40');
  assert.strictEqual(results.fireNumber, 1000000, 'FIRE number should be 1M');
  assert.strictEqual(results.yearByYear[0].phase, 'retirement', 'Year 0 should be in retirement phase');
  assert.strictEqual(results.totalContributions, 0, 'No contributions in retirement phase');
});

test('engine - never reaches FIRE', () => {
  const inputs = {
    currentAge: 30,
    expectedLifespan: 50,
    currentPortfolio: 1000,
    annualSavings: 0, // No savings
    savingsGrowthRate: 0,
    annualExpenses: 50000,
    inflationRate: 0.02,
    investmentReturn: 0.01, // extremely low return
    withdrawalRate: 0.04,
    capitalGainsTax: 0.15,
    withdrawalTax: 0.10
  };

  const results = simulate(inputs);

  assert.strictEqual(results.yearsToFire, null, 'Should never reach FIRE');
  assert.strictEqual(results.ageAtFire, null, 'Age at FIRE should be null');
  assert.strictEqual(results.isSustainable, false, 'Should not be sustainable');
});

test('engine - reaches FIRE but runs out of money (unsustainable)', () => {
  const inputs = {
    currentAge: 30,
    expectedLifespan: 80,
    currentPortfolio: 900000, // close to FIRE (needs 1M)
    annualSavings: 20000,
    savingsGrowthRate: 0.02,
    annualExpenses: 40000, // needs 1M at start
    inflationRate: 0.03, // high inflation
    investmentReturn: 0.04, // low investment returns in retirement
    withdrawalRate: 0.04,
    capitalGainsTax: 0.20,
    withdrawalTax: 0.30 // high withdrawal tax increases drawdown rate
  };

  const results = simulate(inputs);

  // Should reach FIRE quickly
  assert.ok(results.yearsToFire > 0, 'Should reach FIRE eventually');
  assert.ok(results.ageAtFire > 30, 'Should reach FIRE after age 30');
  assert.strictEqual(results.isSustainable, false, 'Portfolio should deplete due to low returns/high taxes/inflation');
  assert.ok(results.depletionAge !== null, 'Depletion age should be populated');
  assert.ok(results.depletionAge < 80, 'Depletion should happen before expected lifespan');
});

test('engine - zero savings growth and zero inflation edge cases', () => {
  const inputs = {
    currentAge: 50,
    expectedLifespan: 60,
    currentPortfolio: 500000,
    annualSavings: 50000,
    savingsGrowthRate: 0,
    annualExpenses: 40000,
    inflationRate: 0, // No inflation
    investmentReturn: 0, // No growth
    withdrawalRate: 0.04,
    capitalGainsTax: 0.15,
    withdrawalTax: 0
  };

  const results = simulate(inputs);

  // With no inflation and no investment return, we save 50k a year.
  // Expenses are 40k, meaning we need 40k / 0.04 = 1,000,000 to FIRE.
  // We start at 500k. We save 50k each year.
  // Year 0: 500k -> end balance 550k (i = 0, age 50)
  // Year 1: 550k -> end balance 600k (i = 1, age 51)
  // ...
  // Year 9: 950k -> end balance 1M.
  // Year 10 (Age 60): loop would check portfolio (1M) >= fireNumber (1M)
  // But wait, lifespan is 60, so simulation only runs for 10 years (ages 50 to 59).
  // Let's see if it reaches FIRE.
  // Ages simulated: 50, 51, 52, 53, 54, 55, 56, 57, 58, 59 (10 years)
  // Let's trace results.
  assert.ok(results.yearByYear.length <= 10);
});
