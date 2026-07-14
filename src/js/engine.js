/**
 * FIRE Calculator — Simulation Engine v2
 *
 * Pure function: no DOM access, no side effects.
 * All monetary values are in the user's chosen currency unit.
 * Rates are decimals (e.g. 0.07 for 7%).
 *
 * @see docs/spec-v2.md
 * @see docs/adr/0001-annual-simulation-step.md
 * @see docs/adr/0002-dynamic-simulation-not-swr.md
 */

const SIMULATION_END_AGE = 100;

/**
 * Run the full FIRE simulation from currentAge to age 100.
 *
 * @param {Object} inputs
 * @param {number} inputs.currentAge
 * @param {number} inputs.currentPortfolioValue
 * @param {number} inputs.monthlySavings           - monthly contribution in today's money
 * @param {number} [inputs.savingsGrowthRate=0]    - annual rate by which monthlySavings compounds
 * @param {number} inputs.roi                      - annual return on portfolio (both phases)
 * @param {number} [inputs.inflationRate=0.02]     - annual inflation rate
 * @param {number} inputs.targetNetMonthlyIncome   - desired monthly income in today's money, net of deductions
 * @param {number} [inputs.deductionRate=0]        - fraction deducted from gross portfolio withdrawal
 * @param {number} [inputs.additionalRetirementIncome=0] - net monthly income from external sources after drawout
 * @param {number} inputs.drawoutAge               - age at which the Drawout Phase begins
 * @param {number} [inputs.currentYear]            - current calendar year (defaults to real-time)
 *
 * @returns {{
 *   yearByYear: Array<{age, calendarYear, phase, nominalPortfolio, realPortfolio,
 *                      nominalMonthlyWithdrawal, realMonthlyWithdrawal}>,
 *   fireNumber: number,
 *   projectedFireAge: number|null,
 *   portfolioAtRetirement: number,
 *   runway: number|null,
 * }}
 */
export function simulate(inputs) {
  const {
    currentAge,
    currentPortfolioValue,
    monthlySavings,
    savingsGrowthRate = 0,
    roi,
    inflationRate = 0.02,
    targetNetMonthlyIncome,
    deductionRate = 0,
    additionalRetirementIncome = 0,
    drawoutAge,
    currentYear = new Date().getFullYear(),
  } = inputs;

  // 1. Derive the FIRE Number by back-solving the Drawout Phase simulation.
  //    (See ADR-0002 — no static Safe Withdrawal Rate formula.)
  const fireNumber = computeFireNumber({
    currentAge,
    drawoutAge,
    roi,
    inflationRate,
    targetNetMonthlyIncome,
    deductionRate,
    additionalRetirementIncome,
  });

  // 2. Year-by-year simulation from currentAge → SIMULATION_END_AGE (inclusive).
  const yearByYear = [];
  let portfolio = currentPortfolioValue;
  let currentMonthlySavings = monthlySavings;

  let projectedFireAge = null;
  let portfolioAtRetirement = null;
  let depletionAge = null;

  for (let age = currentAge; age <= SIMULATION_END_AGE; age++) {
    const yearIndex = age - currentAge;
    const inflationFactor = Math.pow(1 + inflationRate, yearIndex);
    const calendarYear = currentYear + yearIndex;
    const phase = age < drawoutAge ? 'accumulation' : 'drawout';

    let nominalMonthlyWithdrawal = 0;

    if (phase === 'accumulation') {
      // Detect the first year the portfolio crosses the FIRE Number.
      if (projectedFireAge === null && portfolio >= fireNumber) {
        projectedFireAge = age;
      }

      const annualSavings = currentMonthlySavings * 12;
      portfolio = portfolio * (1 + roi) + annualSavings;

      // Savings Growth Rate compounds at the end of each Accumulation year,
      // ready for the next year's contribution.
      currentMonthlySavings = currentMonthlySavings * (1 + savingsGrowthRate);
    } else {
      // Capture the portfolio value entering the Drawout Phase (before any withdrawal).
      if (portfolioAtRetirement === null) {
        portfolioAtRetirement = portfolio;
      }

      const yearsSinceStart = age - currentAge;
      const inflationFactor = Math.pow(1 + inflationRate, yearsSinceStart);

      // Inflation-adjust the nominal target to preserve today's purchasing power.
      const nominalTargetNet = targetNetMonthlyIncome * 12 * inflationFactor;

      // Offset by net additional retirement income (pension, part-time work, etc.).
      const netNeededFromPortfolio = Math.max(
        0,
        nominalTargetNet - additionalRetirementIncome * 12,
      );

      // Gross up through the Deduction Rate so the user receives the net target.
      const effectiveDeductionRate = Math.min(deductionRate, 0.9999); // guard against ÷0
      const grossAnnualWithdrawal = netNeededFromPortfolio / (1 - effectiveDeductionRate);

      nominalMonthlyWithdrawal = grossAnnualWithdrawal / 12;

      portfolio = Math.max(0, portfolio * (1 + roi) - grossAnnualWithdrawal);

      if (portfolio === 0 && depletionAge === null) {
        depletionAge = age;
      }
    }

    yearByYear.push({
      age,
      calendarYear,
      phase,
      nominalPortfolio: portfolio,
      realPortfolio: portfolio / inflationFactor,
      nominalMonthlyWithdrawal,
      realMonthlyWithdrawal: nominalMonthlyWithdrawal / inflationFactor,
    });
  }

  // If drawoutAge is beyond the simulation end (edge case), capture the final value.
  if (portfolioAtRetirement === null) {
    portfolioAtRetirement = portfolio;
  }

  // Runway: how many years into the Drawout Phase before depletion.
  const runway = depletionAge !== null ? depletionAge - drawoutAge : null;

  return {
    yearByYear,
    fireNumber,
    projectedFireAge,
    portfolioAtRetirement,
    runway,
  };
}

// ─── private helpers ────────────────────────────────────────────────────────

/**
 * Simulate only the Drawout Phase from a given starting portfolio.
 * Returns true if the portfolio survives to age 100 without going negative.
 * Does NOT apply the Math.max(0, …) floor so the binary search can find the exact threshold.
 */
function isDrawoutSustainable(startingPortfolio, {
  currentAge,
  drawoutAge,
  roi,
  inflationRate,
  targetNetMonthlyIncome,
  deductionRate,
  additionalRetirementIncome,
}) {
  if (drawoutAge > SIMULATION_END_AGE) return true;

  const effectiveDeductionRate = Math.min(deductionRate, 0.9999);
  let portfolio = startingPortfolio;

  for (let yearsSinceDrawout = 0; yearsSinceDrawout <= SIMULATION_END_AGE - drawoutAge; yearsSinceDrawout++) {
    const age = drawoutAge + yearsSinceDrawout;
    const yearsSinceStart = age - currentAge;
    const inflationFactor = Math.pow(1 + inflationRate, yearsSinceStart);
    const nominalTargetNet = targetNetMonthlyIncome * 12 * inflationFactor;
    const netNeededFromPortfolio = Math.max(0, nominalTargetNet - additionalRetirementIncome * 12);
    const grossAnnualWithdrawal = netNeededFromPortfolio / (1 - effectiveDeductionRate);

    portfolio = portfolio * (1 + roi) - grossAnnualWithdrawal;

    if (portfolio < 0) return false;
  }

  return true;
}

/**
 * Binary-search for the minimum portfolio at drawoutAge that sustains
 * withdrawals all the way to age 100 (the FIRE Number).
 *
 * See ADR-0002 for why we use a simulation rather than a static SWR formula.
 */
function computeFireNumber(params) {
  // If even a zero starting portfolio is sustainable, FIRE Number = 0.
  if (isDrawoutSustainable(0, params)) return 0;

  const UPPER_BOUND = 1e10; // €10 billion ceiling
  // If even the ceiling fails, return it (an astronomically large FIRE Number).
  if (!isDrawoutSustainable(UPPER_BOUND, params)) return UPPER_BOUND;

  let lo = 0;
  let hi = UPPER_BOUND;

  // 60 iterations → precision ≈ 10B / 2^60 ≈ 0.000000009 — sub-cent accuracy.
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (isDrawoutSustainable(mid, params)) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return hi;
}
