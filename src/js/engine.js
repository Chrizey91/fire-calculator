/**
 * Simulates the financial lifecycle from current age to expected lifespan.
 * 
 * @param {Object} inputs
 * @param {number} inputs.currentAge
 * @param {number} inputs.expectedLifespan
 * @param {number} inputs.currentPortfolio
 * @param {number} inputs.annualSavings
 * @param {number} inputs.savingsGrowthRate - e.g., 0.02 for 2%
 * @param {number} inputs.annualExpenses - in today's money
 * @param {number} inputs.inflationRate - e.g., 0.02 for 2%
 * @param {number} inputs.investmentReturn - e.g., 0.07 for 7%
 * @param {number} inputs.withdrawalRate - e.g., 0.04 for 4%
 * @param {number} inputs.capitalGainsTax - e.g., 0.15 for 15%
 * @param {number} inputs.withdrawalTax - e.g., 0.22 for 22%
 * 
 * @returns {Object} Simulation results
 */
export function simulate(inputs) {
  const {
    currentAge,
    expectedLifespan,
    currentPortfolio,
    annualSavings,
    savingsGrowthRate,
    annualExpenses,
    inflationRate,
    investmentReturn,
    withdrawalRate,
    capitalGainsTax,
    withdrawalTax
  } = inputs;

  let portfolio = currentPortfolio;
  let activeSavings = annualSavings;
  let phase = 'accumulation';
  let fireAge = null;
  let fireYear = null;
  let fireNumberAtFire = null;

  const yearByYear = [];
  let totalContributions = 0;
  let totalGrowth = 0;
  let totalTaxes = 0;

  const maxYears = expectedLifespan - currentAge;

  for (let year = 0; year < maxYears; year++) {
    const age = currentAge + year;
    const inflationFactor = Math.pow(1 + inflationRate, year);
    const expensesThisYear = annualExpenses * inflationFactor;
    const fireNumber = expensesThisYear / withdrawalRate;

    // Check if FIRE is reached at the start of this year
    if (phase === 'accumulation' && portfolio >= fireNumber) {
      phase = 'retirement';
      fireAge = age;
      fireYear = year;
      fireNumberAtFire = fireNumber;
    }

    const startBalance = portfolio;
    let savings = 0;
    let withdrawal = 0;
    let gains = 0;
    let taxes = 0;

    if (phase === 'accumulation') {
      savings = activeSavings;
      totalContributions += savings;

      gains = startBalance * investmentReturn;
      if (gains > 0) {
        taxes = gains * capitalGainsTax;
      }
      totalGrowth += gains;
      totalTaxes += taxes;

      portfolio = startBalance + savings + gains - taxes;

      // Grow the savings rate for the next year
      activeSavings = activeSavings * (1 + savingsGrowthRate);
    } else {
      // Retirement (drawdown) phase
      const denominator = 1 - withdrawalTax;
      withdrawal = denominator > 0 ? expensesThisYear / denominator : expensesThisYear;

      gains = startBalance * investmentReturn;
      if (gains > 0) {
        taxes = gains * capitalGainsTax;
      }
      totalGrowth += gains;
      totalTaxes += taxes;

      portfolio = startBalance + gains - taxes - withdrawal;
    }

    yearByYear.push({
      year,
      age,
      phase,
      savings,
      gains,
      taxes,
      withdrawal,
      endBalance: portfolio
    });

    if (portfolio <= 0) {
      portfolio = 0;
      break;
    }
  }

  // If already reached FIRE at the very end of simulation or didn't check
  const reachedFire = fireAge !== null;
  const lastYear = yearByYear[yearByYear.length - 1];
  const finalBalance = lastYear ? lastYear.endBalance : portfolio;
  const isSustainable = reachedFire && finalBalance > 0;

  let depletionAge = null;
  if (finalBalance <= 0 && yearByYear.length > 0) {
    const lastEntry = yearByYear[yearByYear.length - 1];
    depletionAge = lastEntry.age;
  }

  // Calculate default fireNumber if not reached
  const finalInflationFactor = Math.pow(1 + inflationRate, maxYears);
  const finalExpenses = annualExpenses * finalInflationFactor;
  const defaultFireNumber = finalExpenses / withdrawalRate;

  return {
    fireNumber: reachedFire ? fireNumberAtFire : defaultFireNumber,
    yearsToFire: reachedFire ? fireYear : null,
    ageAtFire: fireAge,
    totalContributions,
    totalGrowth,
    totalTaxes,
    isSustainable,
    depletionAge,
    yearByYear
  };
}
