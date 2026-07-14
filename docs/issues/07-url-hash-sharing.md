# 07 — URL hash sharing

**What to build:** A "Copy link" button that encodes all current inputs (including the Drawout Date) into the URL hash and copies the full URL to the clipboard. When someone opens that URL, the inputs are decoded from the hash and loaded — overriding any saved localStorage values — so they see the exact scenario the sender configured.

Encoding: JSON-serialise all inputs, then base64-encode the result into `window.location.hash`. This is purely client-side with no backend.

**Priority on load:** URL hash > localStorage > coded defaults.

**Blocked by:** 06 (localStorage persistence must exist, since hash overrides it).

**Status:** done

- [x] A "Copy link" button is visible in the UI
- [x] Clicking it encodes all current inputs and the Drawout Date into the URL hash
- [x] Clicking it copies the full URL (including hash) to the clipboard
- [x] A brief confirmation is shown after copying (e.g. "Link copied!")
- [x] Loading a URL with a valid hash decodes the inputs and applies them to the form, overriding localStorage
- [x] Loading a URL with a malformed or missing hash falls back to localStorage, then defaults — no crash
- [x] The hash updates in the address bar immediately when the button is clicked (so the user can also copy from the address bar)
