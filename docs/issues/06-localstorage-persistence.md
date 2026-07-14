# 06 — localStorage persistence

**What to build:** All user inputs are automatically saved to the browser's localStorage on every change. When the page loads, the saved inputs are restored so the user's scenario is waiting for them exactly as they left it.

The Drawout Date (retirement slider position) should also be persisted.

A single JSON object should be written to a single localStorage key (e.g. `fire-calculator-v2`) on every input event. On page load, if the key exists, its values are read and applied to the form before the first calculation runs.

**Blocked by:** 02 (input form must exist).

**Status:** done

- [x] All 10 input values are saved to localStorage on every input change
- [x] Retirement slider position (Drawout Date) is also saved
- [x] On page load, saved values are restored to the form inputs and slider before the first render
- [x] If no saved values exist (first visit), inputs fall back to their coded defaults
- [x] A stale or malformed localStorage entry does not crash the app — falls back to defaults gracefully
- [x] Persisted values survive a full page close and reopen in the same browser
