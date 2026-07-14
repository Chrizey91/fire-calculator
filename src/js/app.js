/**
 * app.js — UI wiring layer (v2)
 *
 * Reads the v2 input form, calls the pure simulate() engine, and
 * renders the four live-updating summary stats and the interactive Chart.js graph.
 *
 * Slider logic:
 * - Spans currentAge + 1 to 99.
 * - Dynamic constraints adjustment when currentAge input changes.
 */

import { simulate } from './engine.js';

let chartInstance = null;

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
 * Read all v2 inputs from the DOM, using the retirement slider's value
 * for the drawoutAge.
 */
function readInputs() {
  const currentAge = getNum('currentAge', 30);
  const slider = document.getElementById('drawoutAge-slider');
  const drawoutAge = slider ? parseInt(slider.value, 10) : Math.min(currentAge + 30, 99);

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
      drawoutAge: drawoutAge,
    },
  };
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ─── slider constraints ───────────────────────────────────────────────────────

/**
 * Synchronize slider ranges with the current age input.
 */
function updateSliderConstraints() {
  const currentAge = getNum('currentAge', 30);
  const slider = document.getElementById('drawoutAge-slider');
  const display = document.getElementById('drawout-age-display');
  if (!slider) return;

  const newMin = currentAge + 1;
  slider.min = newMin;

  // Clamp slider value to the new range
  if (parseInt(slider.value, 10) < newMin) {
    slider.value = Math.min(Math.max(newMin, 60), 99);
  }

  if (display) {
    display.textContent = slider.value;
  }
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

// ─── chart rendering ─────────────────────────────────────────────────────────

/**
 * Render or update the Chart.js visualizer.
 */
function updateChart(yearByYear, fireNumber, currency) {
  const ctx = document.getElementById('portfolio-chart')?.getContext('2d');
  if (!ctx) return;

  // Check if a Nominal/Real toggle exists or default to Real (inflation-deflated) terms.
  // Real view is preferred to ground the user in today's purchasing power.
  const activeToggleBtn = document.querySelector('#nominal-real-toggle-container .btn-toggle.active');
  const isReal = activeToggleBtn ? activeToggleBtn.getAttribute('data-value') === 'real' : true;

  // Multi-line labels to show age and calendar year under each tick.
  const labels = yearByYear.map(y => [y.age.toString(), y.calendarYear.toString()]);

  const portfolioData = yearByYear.map(y => ({
    x: y.age,
    y: isReal ? y.realPortfolio : y.nominalPortfolio,
    phase: y.phase
  }));

  const withdrawalData = yearByYear.map(y => ({
    x: y.age,
    y: y.phase === 'drawout' ? (isReal ? y.realMonthlyWithdrawal : y.nominalMonthlyWithdrawal) : 0
  }));

  // FIRE target is scaled to Real or Nominal based on the toggle.
  // The engine's fireNumber is a nominal amount required at drawoutAge.
  // Real FIRE Number = Nominal FIRE Number / (1 + inflationRate)^yearsSinceCurrentAge.
  // For a horizontal line across all ages, we plot the value at the drawoutAge in active terms.
  const activeFireNumber = isReal 
    ? (yearByYear.find(y => y.phase === 'drawout')?.realPortfolio ?? fireNumber)
    : fireNumber;

  const fireLineData = yearByYear.map(y => ({
    x: y.age,
    y: activeFireNumber
  }));

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = portfolioData;
    chartInstance.data.datasets[1].data = withdrawalData;
    chartInstance.data.datasets[2].data = fireLineData;

    const viewStr = isReal ? 'Real' : 'Nominal';
    chartInstance.options.scales.y.title.text = `Portfolio Value (${viewStr}, ${currency})`;
    chartInstance.options.scales.y1.title.text = `Monthly Withdrawal (${viewStr}, ${currency})`;

    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data: portfolioData,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            yAxisID: 'y',
            // Distinguish accumulation phase (solid blue) from drawout phase (dashed green)
            segment: {
              borderColor: (ctx) => {
                const idx = ctx.p0.index;
                const pt = ctx.chart.data.datasets[ctx.datasetIndex].data[idx];
                return pt && pt.phase === 'accumulation' ? '#3b82f6' : '#10b981';
              },
              borderDash: (ctx) => {
                const idx = ctx.p0.index;
                const pt = ctx.chart.data.datasets[ctx.datasetIndex].data[idx];
                return pt && pt.phase === 'accumulation' ? [] : [6, 6];
              }
            },
            tension: 0.1
          },
          {
            label: 'Monthly Withdrawal (Secondary Axis)',
            data: withdrawalData,
            fill: 'origin',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y1',
            tension: 0.1
          },
          {
            label: 'FIRE Target',
            data: fireLineData,
            borderColor: 'rgba(245, 158, 11, 0.6)',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            yAxisID: 'y',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                weight: '500'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || '';
                const value = context.parsed.y;
                return `${datasetLabel}: ${formatCurrency(value, currency)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 10
              },
              maxRotation: 0
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          y: {
            position: 'left',
            min: 0,
            title: {
              display: true,
              text: `Portfolio Value (${isReal ? 'Real' : 'Nominal'}, ${currency})`,
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans'
              }
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans'
              },
              callback: (value) => formatCurrency(value, currency)
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          y1: {
            position: 'right',
            min: 0,
            title: {
              display: true,
              text: `Monthly Withdrawal (${isReal ? 'Real' : 'Nominal'}, ${currency})`,
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans'
              }
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans'
              },
              callback: (value) => formatCurrency(value, currency)
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
}

// ─── localStorage persistence ────────────────────────────────────────────────

function saveToLocalStorage() {
  const inputs = {
    currentAge: document.getElementById('currentAge')?.value,
    currentPortfolioValue: document.getElementById('currentPortfolioValue')?.value,
    monthlySavings: document.getElementById('monthlySavings')?.value,
    savingsGrowthRate: document.getElementById('savingsGrowthRate')?.value,
    roi: document.getElementById('roi')?.value,
    inflationRate: document.getElementById('inflationRate')?.value,
    targetNetMonthlyIncome: document.getElementById('targetNetMonthlyIncome')?.value,
    deductionRate: document.getElementById('deductionRate')?.value,
    additionalRetirementIncome: document.getElementById('additionalRetirementIncome')?.value,
    currency: document.getElementById('currency-selector')?.value,
    drawoutAge: document.getElementById('drawoutAge-slider')?.value,
    isReal: document.querySelector('#nominal-real-toggle-container .btn-toggle.active')?.getAttribute('data-value') === 'real'
  };

  try {
    localStorage.setItem('fire-calculator-v2', JSON.stringify(inputs));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('fire-calculator-v2');
    if (!raw) return;
    const inputs = JSON.parse(raw);
    if (!inputs || typeof inputs !== 'object') return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) {
        el.value = val;
      }
    };

    setVal('currentAge', inputs.currentAge);
    setVal('currentPortfolioValue', inputs.currentPortfolioValue);
    setVal('monthlySavings', inputs.monthlySavings);
    setVal('savingsGrowthRate', inputs.savingsGrowthRate);
    setVal('roi', inputs.roi);
    setVal('inflationRate', inputs.inflationRate);
    setVal('targetNetMonthlyIncome', inputs.targetNetMonthlyIncome);
    setVal('deductionRate', inputs.deductionRate);
    setVal('additionalRetirementIncome', inputs.additionalRetirementIncome);
    setVal('currency-selector', inputs.currency);

    if (inputs.isReal !== undefined) {
      const toggleContainer = document.getElementById('nominal-real-toggle-container');
      if (toggleContainer) {
        const buttons = toggleContainer.querySelectorAll('.btn-toggle');
        buttons.forEach(btn => {
          const val = btn.getAttribute('data-value');
          if ((val === 'real' && inputs.isReal) || (val === 'nominal' && !inputs.isReal)) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    }

    const slider = document.getElementById('drawoutAge-slider');
    if (slider && inputs.drawoutAge !== undefined && inputs.drawoutAge !== null) {
      slider.value = inputs.drawoutAge;
    }
  } catch (e) {
    console.error('Failed to load from localStorage', e);
  }
}

// ─── main recalculate ────────────────────────────────────────────────────────

function recalculate() {
  const { engineInputs, currency } = readInputs();

  const result = simulate(engineInputs);
  renderStats(result, currency);
  updateChart(result.yearByYear, result.fireNumber, currency);
  saveToLocalStorage();
}

// ─── event wiring ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.scenario-form');
  const slider = document.getElementById('drawoutAge-slider');
  const display = document.getElementById('drawout-age-display');
  const toggleContainer = document.getElementById('nominal-real-toggle-container');

  // Load persisted scenario from localStorage first
  loadFromLocalStorage();

  // Initialize constraints
  updateSliderConstraints();

  // Recalculate on any input change
  if (form) {
    form.addEventListener('input', () => {
      updateSliderConstraints();
      recalculate();
    });
    form.addEventListener('change', () => {
      updateSliderConstraints();
      recalculate();
    });
  }

  // Recalculate on slider drag
  if (slider) {
    slider.addEventListener('input', () => {
      if (display) {
        display.textContent = slider.value;
      }
      recalculate();
    });
  }

  // Recalculate on toggle click
  if (toggleContainer) {
    const buttons = toggleContainer.querySelectorAll('.btn-toggle');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        recalculate();
      });
    });
  }

  // Initial calculation
  recalculate();
});
