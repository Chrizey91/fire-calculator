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
import { t, setLocale, loadLocale, getLocale } from './i18n.js';

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
  const tr = t();

  // 🎯 FIRE Number
  setText('stat-fire-number', fmt(result.fireNumber));

  // 📅 Projected FIRE Age
  setText(
    'stat-projected-fire-age',
    result.projectedFireAge !== null ? String(result.projectedFireAge) : tr.stats.notReached,
  );

  // 💰 Portfolio at Retirement
  setText('stat-portfolio-at-retirement', fmt(result.portfolioAtRetirement));

  // ⚠️ Runway
  const runwayBox = document.getElementById('stat-runway-box');
  if (result.runway === null) {
    setText('stat-runway', tr.stats.sustainableTo100);
    runwayBox?.classList.remove('runway-danger');
  } else {
    const yrs = result.runway;
    setText('stat-runway', tr.stats.years(yrs));
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

  const colors = getThemeColors();
  const tr = t();

  // Check if a Nominal/Real toggle exists or default to Real (inflation-deflated) terms.
  // Real view is preferred to ground the user in today's purchasing power.
  const activeToggleBtn = document.querySelector('#nominal-real-toggle-container .btn-toggle.active');
  const isReal = activeToggleBtn ? activeToggleBtn.getAttribute('data-value') === 'real' : true;

  const viewStr = isReal ? tr.graph.inflationAdjusted : tr.graph.gross;

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
    chartInstance.data.datasets[0].label = tr.graph.portfolioValue;
    chartInstance.data.datasets[1].data = withdrawalData;
    chartInstance.data.datasets[1].label = tr.graph.monthlyWithdrawal;
    chartInstance.data.datasets[2].data = fireLineData;
    chartInstance.data.datasets[2].label = tr.graph.fireTarget;

    chartInstance.options.scales.y.title.text = tr.graph.yAxisPortfolio(viewStr, currency);
    chartInstance.options.scales.y1.title.text = tr.graph.yAxisWithdrawal(viewStr, currency);

    chartInstance.options.scales.x.ticks.color = colors.text;
    chartInstance.options.scales.x.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.text;
    chartInstance.options.scales.y.grid.color = colors.grid;
    chartInstance.options.scales.y.title.color = colors.text;
    chartInstance.options.scales.y1.ticks.color = colors.text;
    chartInstance.options.scales.y1.title.color = colors.text;
    chartInstance.options.plugins.legend.labels.color = colors.legend;

    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: tr.graph.portfolioValue,
            data: portfolioData,
            borderColor: '#10b981',
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
            label: tr.graph.monthlyWithdrawal,
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
            label: tr.graph.fireTarget,
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
              color: colors.legend,
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
              color: colors.text,
              font: {
                family: 'Plus Jakarta Sans',
                size: 10
              },
              maxRotation: 0
            },
            grid: {
              color: colors.grid
            }
          },
          y: {
            position: 'left',
            min: 0,
            title: {
              display: true,
              text: tr.graph.yAxisPortfolio(viewStr, currency),
              color: colors.text,
              font: {
                family: 'Plus Jakarta Sans'
              }
            },
            ticks: {
              color: colors.text,
              font: {
                family: 'Plus Jakarta Sans'
              },
              callback: (value) => formatCurrency(value, currency)
            },
            grid: {
              color: colors.grid
            }
          },
          y1: {
            position: 'right',
            min: 0,
            title: {
              display: true,
              text: tr.graph.yAxisWithdrawal(viewStr, currency),
              color: colors.text,
              font: {
                family: 'Plus Jakarta Sans'
              }
            },
            ticks: {
              color: colors.text,
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

// ─── URL hash sharing ────────────────────────────────────────────────────────

function copyShareLink() {
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
    isReal: document.querySelector('#nominal-real-toggle-container .btn-toggle.active')?.getAttribute('data-value') === 'real',
    locale: getLocale(),
  };

  try {
    const serialized = JSON.stringify(inputs);
    const encoded = btoa(unescape(encodeURIComponent(serialized)));
    window.location.hash = encoded;

    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl).then(() => {
      const btn = document.getElementById('share-btn');
      if (btn) {
        const originalTitle = btn.getAttribute('title');
        btn.setAttribute('title', t().misc.copied);

        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style="font-size: 0.8rem; font-weight: 600; margin-left: 0.25rem; color: #10b981;">${t().misc.copied}</span>
        `;

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.setAttribute('title', originalTitle);
        }, 2000);
      }
    });
  } catch (e) {
    console.error('Failed to create share link', e);
  }
}

function loadFromHash() {
  try {
    const hash = window.location.hash.substring(1);
    if (!hash) return false;

    const decoded = decodeURIComponent(escape(atob(hash)));
    const inputs = JSON.parse(decoded);
    if (!inputs || typeof inputs !== 'object') return false;

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

    if (inputs.locale) {
      setVal('lang-selector', inputs.locale);
    }

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
    return true;
  } catch (e) {
    console.error('Failed to load from hash', e);
    return false;
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

// ─── Theme Toggle ────────────────────────────────────────────────────────────

const SUN_SVG = `<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const MOON_SVG = `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  let theme = localStorage.getItem('fire-calculator-theme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  setTheme(theme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fire-calculator-theme', theme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const tr = t();
    toggleBtn.innerHTML = theme === 'light' ? MOON_SVG : SUN_SVG;
    toggleBtn.setAttribute(
      'title',
      theme === 'light' ? tr.header.switchToDark : tr.header.switchToLight,
    );
  }

  if (chartInstance) {
    const colors = getThemeColors();
    chartInstance.options.scales.x.ticks.color = colors.text;
    chartInstance.options.scales.x.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.text;
    chartInstance.options.scales.y.grid.color = colors.grid;
    chartInstance.options.scales.y.title.color = colors.text;
    chartInstance.options.scales.y1.ticks.color = colors.text;
    chartInstance.options.scales.y1.title.color = colors.text;
    chartInstance.options.plugins.legend.labels.color = colors.legend;
    chartInstance.update();
  }
}

function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#94a3b8' : '#475569',
    grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    legend: isDark ? '#94a3b8' : '#475569'
  };
}

// ─── i18n — DOM update ───────────────────────────────────────────────────────

/**
 * Apply translations to every element carrying a data-i18n attribute.
 * The attribute value is a dot-notation path into the t() object.
 */
function applyTranslations() {
  const tr = t();

  // Walk all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const parts = key.split('.');
    let val = tr;
    for (const part of parts) {
      val = val?.[part];
    }
    if (typeof val === 'string') {
      el.textContent = val;
    }
  });

  // Update document language attribute
  document.documentElement.lang = getLocale();

  // Update share-btn title
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) shareBtn.setAttribute('title', tr.header.shareTitle);

  // Re-apply theme button label since setTheme won't be called again
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute(
      'title',
      currentTheme === 'light' ? tr.header.switchToDark : tr.header.switchToLight,
    );
  }
}

// ─── tooltip wiring ──────────────────────────────────────────────────────────

let tooltipHideTimer = null;

function initTooltips() {
  const portal = document.getElementById('tooltip-portal');
  if (!portal) return;

  function showTooltip(badge, key) {
    const tr = t();
    const text = tr.tooltips[key];
    if (!text) return;

    clearTimeout(tooltipHideTimer);
    portal.textContent = text;

    // Position the portal above the badge
    const rect = badge.getBoundingClientRect();
    const portalWidth = 280;
    let left = rect.left + rect.width / 2 - portalWidth / 2;
    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - portalWidth - 8));

    const top = rect.top - 8; // a little gap above badge

    portal.style.left = `${left}px`;
    portal.style.top = `${top}px`;
    portal.style.transform = 'translateY(-100%) translateY(-4px)';
    portal.classList.add('tooltip-visible');
  }

  function hideTooltip() {
    tooltipHideTimer = setTimeout(() => {
      portal.classList.remove('tooltip-visible');
    }, 120);
  }

  // Delegate events from all info badges
  document.addEventListener('mouseover', (e) => {
    const badge = e.target.closest('.info-badge[data-tooltip-key]');
    if (badge) showTooltip(badge, badge.dataset.tooltipKey);
  });

  document.addEventListener('mouseout', (e) => {
    const badge = e.target.closest('.info-badge[data-tooltip-key]');
    if (badge) hideTooltip();
  });

  document.addEventListener('focusin', (e) => {
    const badge = e.target.closest('.info-badge[data-tooltip-key]');
    if (badge) showTooltip(badge, badge.dataset.tooltipKey);
  });

  document.addEventListener('focusout', (e) => {
    const badge = e.target.closest('.info-badge[data-tooltip-key]');
    if (badge) hideTooltip();
  });

  // Keyboard: Escape closes tooltip
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });
}

// ─── language selector wiring ────────────────────────────────────────────────

function initLanguageSelector() {
  const sel = document.getElementById('lang-selector');
  if (!sel) return;

  // Set the selector to the persisted/loaded locale
  sel.value = getLocale();

  sel.addEventListener('change', () => {
    setLocale(sel.value);
    applyTranslations();
    // Re-run recalculate so chart labels pick up new locale
    recalculate();
  });
}

// ─── event wiring ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.scenario-form');
  const slider = document.getElementById('drawoutAge-slider');
  const display = document.getElementById('drawout-age-display');

  // Load locale first so all subsequent UI calls use the right language
  loadLocale();

  // Initialize light/dark theme toggle
  initTheme();

  const toggleContainer = document.getElementById('nominal-real-toggle-container');

  // Load scenario: URL hash overrides localStorage
  if (!loadFromHash()) {
    loadFromLocalStorage();
  }

  // Apply locale from lang-selector (set by loadFromHash / persisted value)
  const langSel = document.getElementById('lang-selector');
  if (langSel && langSel.value) {
    setLocale(langSel.value);
  }

  // Apply all translations
  applyTranslations();

  // Initialize language dropdown
  initLanguageSelector();

  // Initialize tooltip hover system
  initTooltips();

  // Wire share button click
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', copyShareLink);
  }

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
