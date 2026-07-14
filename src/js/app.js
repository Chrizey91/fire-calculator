import { simulate } from './engine.js';

// Debounce helper
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Format currency helper
function formatCurrency(amount, symbol) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    maximumFractionDigits: 0
  });
  
  // Custom alignment for symbols
  if (symbol === '€' || symbol === '₣') {
    return `${formatter.format(amount)} ${symbol}`;
  }
  return `${symbol}${formatter.format(amount)}`;
}

// Read inputs from a specific scenario container
function readScenarioInputs(scenarioId) {
  const container = document.querySelector(`.scenario-card[data-id="${scenarioId}"]`);
  if (!container) return null;

  const getValue = (name) => {
    const el = container.querySelector(`[name="${name}"]`);
    return el ? parseFloat(el.value) : 0;
  };

  return {
    currentAge: getValue('currentAge'),
    expectedLifespan: getValue('expectedLifespan'),
    currentPortfolio: getValue('currentPortfolio'),
    annualSavings: getValue('annualSavings'),
    savingsGrowthRate: getValue('savingsGrowthRate') / 100,
    annualExpenses: getValue('annualExpenses'),
    inflationRate: getValue('inflationRate') / 100,
    investmentReturn: getValue('investmentReturn') / 100,
    withdrawalRate: getValue('withdrawalRate') / 100,
    capitalGainsTax: getValue('capitalGainsTax') / 100,
    withdrawalTax: getValue('withdrawalTax') / 100
  };
}

// Update UI results for a scenario
function updateScenarioResults(scenarioId, results, currencySymbol) {
  const card = document.getElementById(`result-card-${scenarioId}`);
  if (!card) return;

  const num = scenarioId.split('-')[1] || '1';

  // Select target elements
  const fireNumberVal = document.getElementById(`fire-number-val-${num}`);
  const yearsToFireVal = document.getElementById(`years-to-fire-val-${num}`);
  const ageAtFireVal = document.getElementById(`age-at-fire-val-${num}`);
  const contributionsVal = document.getElementById(`contributions-val-${num}`);
  const growthVal = document.getElementById(`growth-val-${num}`);
  const contributionsFill = document.getElementById(`contributions-fill-${num}`);
  const growthFill = document.getElementById(`growth-fill-${num}`);
  const statusBadge = card.querySelector('.status-badge');

  // Format and update text values
  fireNumberVal.textContent = formatCurrency(results.fireNumber, currencySymbol);
  
  if (results.yearsToFire === null) {
    yearsToFireVal.textContent = 'Never';
    ageAtFireVal.textContent = 'N/A';
  } else if (results.yearsToFire === 0) {
    yearsToFireVal.textContent = 'Immediate';
    ageAtFireVal.textContent = results.ageAtFire.toString();
  } else {
    yearsToFireVal.textContent = `${results.yearsToFire} ${results.yearsToFire === 1 ? 'year' : 'years'}`;
    ageAtFireVal.textContent = results.ageAtFire.toString();
  }

  contributionsVal.textContent = formatCurrency(results.totalContributions, currencySymbol);
  growthVal.textContent = formatCurrency(results.totalGrowth, currencySymbol);

  // Update progress bar
  const total = results.totalContributions + results.totalGrowth;
  if (total > 0) {
    const contribPct = (results.totalContributions / total) * 100;
    const growthPct = (results.totalGrowth / total) * 100;
    contributionsFill.style.width = `${contribPct}%`;
    growthFill.style.width = `${growthPct}%`;
  } else {
    contributionsFill.style.width = '0%';
    growthFill.style.width = '0%';
  }

  // Update sustainability badge
  if (results.isSustainable) {
    statusBadge.textContent = 'Sustainable';
    statusBadge.className = 'status-badge status-sustainable';
  } else {
    statusBadge.textContent = results.depletionAge 
      ? `Runs out at age ${results.depletionAge}` 
      : 'Unsustainable';
    statusBadge.className = 'status-badge status-unsustainable';
  }
}

// Main calculation handler
function calculate() {
  const currencySelector = document.getElementById('currency-selector');
  const currencySymbol = currencySelector ? currencySelector.value : '€';

  const inputs = readScenarioInputs('scenario-1');
  if (!inputs) return;

  const results = simulate(inputs);
  updateScenarioResults('scenario-1', results, currencySymbol);
}

// Wire up events
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.scenario-form');
  const currencySelector = document.getElementById('currency-selector');

  const debouncedCalculate = debounce(calculate, 300);

  // Recalculate on any input change
  if (form) {
    form.addEventListener('input', debouncedCalculate);
  }

  if (currencySelector) {
    currencySelector.addEventListener('change', calculate);
  }

  // Initial calculation
  calculate();
});
