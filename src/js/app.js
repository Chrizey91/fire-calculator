/**
 * app.js — UI wiring layer (v2)
 *
 * Reads the v2 input form, calls the pure simulate() engine, and
 * renders the four live-updating summary stats. No debounce — the
 * annual simulation completes well within a frame.
 *
 * Default Drawout Age = min(currentAge + 30, 99), clamped so it
 * is always > currentAge. Replaced by a slider in ticket 04.
 */

import { simulate } from './engine.js';

// ─── formatting ─────────────────────────────────────────────────────────────

/**
 * Format a monetary amount with the active currency symbol.
 * European symbols (€ ₣) go after the number; prefix otherwise.
 */
function formatCurrency(amount, symbol) {
  const formatted = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return symbol === '€' || symbol === '₣'
    ? `${formatted} ${symbol}`
    : `${symbol}${formatted}`;
}

// ─── input reading ───────────────────────────────────────────────────────────

/**
 * Read a numeric input by id, returning fallback if missing/NaN.
 */
function getNum(id, fallback = 0) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Compute the default Drawout Age placeholder used until ticket 04's slider.
 * Returns null when no valid drawout age exists (edge case: currentAge ≥ 99).
 */
function defaultDrawoutAge(currentAge) {
  const age = Math.min(currentAge + 30, 99);
  return age > currentAge ? age : null;
}

/**
 * Read all v2 inputs from the DOM and return the engine input object
 * plus the active currency symbol.
 */
function readInputs() {
  const currentAge = getNum('currentAge', 30);
  const drawoutAge = defaultDrawoutAge(currentAge);

  return {
    drawoutAge,
    currency: document.getElementById('currency-selector')?.value ?? '€',
    engineInputs: {
      currentAge,
      currentPortfolioValue:      getNum('currentPortfolioValue', 0),
      monthlySavings:             getNum('monthlySavings', 0),
      savingsGrowthRate:          getNum('savingsGrowthRate', 0) / 100,
      roi:                        getNum('roi', 0) / 100,
      inflationRate:              getNum('inflationRate', 2) / 100,
      targetNetMonthlyIncome:     getNum('targetNetMonthlyIncome', 0),
      deductionRate:              getNum('deductionRate', 0) / 100,
      additionalRetirementIncome: getNum('additionalRetirementIncome', 0),
      drawoutAge: drawoutAge ?? currentAge + 1, // fallback keeps engine valid
    },
  };
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ─── stat rendering ──────────────────────────────────────────────────────────

/**
 * Push the four stats from a simulate() result into the DOM.
 */
function renderStats(result, currency) {
  const fmt = (n) => formatCurrency(n, currency);

  // 🎯 FIRE Number
  setText('stat-fire-number', fmt(result.fireNumber));

  // 📅 Projected FIRE Age
  setText(
    'stat-projected-fire-age',
    result.projectedFireAge !== null ? String(result.projectedFireAge) : 'Not reached',
  );

  // 💰 Portfolio at Retirement
  setText('stat-portfolio-at-retirement', fmt(result.portfolioAtRetirement));

  // ⚠️ Runway
  const runwayBox = document.getElementById('stat-runway-box');
  if (result.runway === null) {
    setText('stat-runway', 'Sustainable to 100');
    runwayBox?.classList.remove('runway-danger');
  } else {
    const yrs = result.runway;
    setText('stat-runway', `${yrs} yr${yrs !== 1 ? 's' : ''}`);
    runwayBox?.classList.add('runway-danger');
  }
}

// ─── main recalculate ────────────────────────────────────────────────────────

function recalculate() {
  const { engineInputs, currency, drawoutAge } = readInputs();

  // Skip if no valid drawout window exists (age ≥ 99 edge case).
  if (drawoutAge === null) return;

  const result = simulate(engineInputs);
  renderStats(result, currency);
}

// ─── event wiring ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.scenario-form');

  // Wire input + change on the form so both typing and select-changes trigger.
  // No debounce — annual simulation is fast enough for immediate feedback.
  if (form) {
    form.addEventListener('input', recalculate);
    form.addEventListener('change', recalculate);
  }

  // Initial render on page load.
  recalculate();
});
