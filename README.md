# 🔥 FIRE Calculator (v2)

An elegant, interactive, and responsive calculator designed to help you plan and visualize your path to **Financial Independence, Retire Early (FIRE)**.

Version 2 is a complete rewrite focusing on interactive retirement timeline exploration, dynamic simulation of the drawdown phase (rather than a static Safe Withdrawal Rate formula), and client-side scenario sharing.

---

## Features

- **Interactive Retirement Slider**: Drag the slider under the chart to set your Drawout Age. Watch the summary stats and curves update in real time.
- **Dynamic Simulation Engine**: Simulates your net portfolio behavior annually from your current age to age 100. It computes the minimum portfolio size needed on your retirement date (FIRE Number) by back-solving the drawdown simulation.
- **Rich Chart.js Visualization**:
  - **Portfolio Value Curve**: Shows your assets over time, rendered in solid blue during the Accumulation Phase and dashed green during the Drawout Phase.
  - **Monthly Withdrawal Shading**: A shaded red region showing gross portfolio withdrawals over time.
  - **FIRE Target Reference Line**: A horizontal guide indicating your required FIRE target.
- **Nominal vs. Real Toggle**: Toggle the chart series between nominal values and real inflation-adjusted terms (purchasing power in today's currency).
- **Cosmetic Currency selector**: Choose your symbol (€, $, £, CHF, A$, C$) to format all stats and graph tooltips dynamically.
- **collapsible Advanced Settings**: Keep the primary form clean with advanced inputs (Inflation Rate, Additional Retirement Income, Currency) hidden behind a details section.
- **Double Persistence**:
  - **localStorage**: Automatically saves your inputs on every change so your work is retained.
  - **URL Hash Sharing**: Copy a shareable link encoding your exact inputs in base64. Sharing URL overrides localStorage for immediate replication of scenarios.

---

## Local Development & Setup

Since the application uses standard JavaScript ES Modules (`import`/`export`), opening the `src/index.html` file directly in the browser via the `file://` protocol will cause CORS (Cross-Origin Resource Sharing) block errors.

To run the application locally, you must serve the files using a simple web server.

### Option 1: Using Node.js (Recommended)
If you have Node.js installed, run:

```bash
# Starts a local web server (defaults to serving the root at http://localhost:8080)
npm start
```
Then open your browser and navigate to:
**[http://localhost:8080/src/](http://localhost:8080/src/)**

### Option 2: Using Python
If you have Python installed, run this command from the repository root:

```bash
# For Python 3.x
python -m http.server 8000
```
Then navigate to **[http://localhost:8000/src/](http://localhost:8000/src/)** in your browser.

---

## Running Unit Tests

This project uses the native Node.js test runner, meaning there are **zero external dependencies** required to run the tests.

To run the unit tests:

```bash
npm test
```

This will run all tests defined in the `test/` directory, validating the mathematical core of the simulation engine (`src/js/engine.js`).