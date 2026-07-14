# 🔥 FIRE Calculator

An elegant, interactive, and responsive calculator designed to help you plan your path to **Financial Independence, Retire Early (FIRE)**.

Compare multiple financial scenarios side by side, model your accumulation and retirement drawdown phases, and visualize the long-term sustainability of your wealth.

---

## Features

- **Deterministic Simulation**: A year-by-year lifecycle calculation of both the accumulation phase (saving and growth) and drawdown phase (retiring and spending).
- **Interactive Scenarios**: Compare up to 3 named scenarios side by side (e.g., Conservative vs. Aggressive) to see how small tweaks impact your retirement age.
- **Country-based Defaults**: Select your country to pre-populate realistic default values for inflation, capital gains taxes, withdrawal taxes, and local currency formatting.
- **Full Drawdown Modeling**: Simulates your net portfolio behavior during retirement, warning you if your funds are projected to run out before your expected lifespan.
- **LocalStorage Auto-Save**: Your inputs are automatically saved in the browser so you can resume planning on your next visit.
- **Sleek Glassmorphism Design**: High-end modern UI with full dark/light mode toggle matching your system preferences.

---

## Local Development & Setup

Since the application uses standard JavaScript ES Modules (`import`/`export`), opening the `src/index.html` file directly in Chrome or Firefox via the `file://` protocol will cause CORS (Cross-Origin Resource Sharing) block errors.

To run the application locally, you must serve the files using a simple web server.

### Option 1: Using Node.js (Recommended)
If you have Node.js installed, run:

```bash
# Starts a local web server (defaults to http://localhost:8080)
npm start
```

### Option 2: Using Python
If you have Python installed, run this command from the repository root:

```bash
# For Python 3.x
python -m http.server 8000
```
Then navigate to `http://localhost:8000/src/` in your browser.

### Option 3: VS Code "Live Server"
If you use VS Code:
1. Install the **Live Server** extension.
2. Click **Go Live** in the status bar at the bottom right.

---

## Running Unit Tests

This project uses the native Node.js test runner (introduced in Node 18+ / 20+), meaning there are **zero external dependencies** required to run tests.

To run the unit tests:

```bash
npm test
```

This will run all tests defined in the `test/` directory, confirming the correctness of the core mathematical simulation engine (`src/js/engine.js`).