# Research Log: Automation Framework Comparison

## System Environment Baseline
* **Operating System:** Windows 11 
* **Node.js Version:** v24.14.0 
* **Hardware:**  16GB RAM / AMD Ryzen 5 5600H with Radeon Graphics
* **Network Condition:** Home Wi-Fi / Download Mbps 117.36, Upload Mbps 20.87, Ping ms 7, Download Latency 106, Upload Latency 220

---

## Incident Log: March 16, 2026
### Framework: Cypress
**Issue:** Graphical User Interface (GUI) Initialization Failure.
**Symptoms:** Launching the Cypress Test Runner resulted in a non-responsive "White Screen" (Electron frame initialization failure).
**Root Cause:** Incompatibility between the Electron-based GUI and local GPU acceleration/Windows environment during the initial handshake.
**Resolution:** Bypassed the visual Test Runner and pivoted to "Headless Mode" via CLI (`npx cypress run`).
**Thesis Insight:** While Cypress offers a robust GUI, its dependency on the Electron environment can introduce setup friction compared to Playwright's more lightweight CLI-first approach. This affects the "Ease of Setup" metric for the comparison study.

---

## Milestone: Full Framework Interoperability Achieved
**Date:** March 16, 2026
**Status:** All three stations (Playwright, Cypress, Selenium) are verified and operational.
**Observation:** Selenium performed the "Headed" execution successfully. While it felt slightly slower to "spin up" than Playwright, it reached the same conclusion.

---

## Milestone: Architectural Symmetry Achieved
**Date:** March 16, 2026
**Status:** All three stations now operate under a standardized configuration architecture.
**Changes Implemented:**
1. **`playwright.config.js` created** — Playwright now uses a dedicated configuration file to manage the `baseURL`, mirroring the existing `cypress.config.js`. This eliminates hardcoded URLs from the Playwright test script and elevates the project from a collection of scripts to a cohesive framework.
2. **`login.spec.js` updated** — The hardcoded `https://www.saucedemo.com/` URL was replaced with a relative path `'/'`, now resolved automatically via `playwright.config.js`.
3. **Playwright JSON Reporter enabled** — The `run-playwright` script was updated to output structured benchmark data to `results/playwright.json` via the `--reporter=json` flag. This file can be imported directly into Excel or R for final thesis chart generation.
4. **Selenium Stopwatch added** — Because Selenium does not have a built-in reporter, a manual `Date.now()` timer was implemented in `login-test.js`. Execution time is logged to the console, providing a comparable timing metric across all three frameworks.
5. **`results/` folder created** — A dedicated directory was manually created to house benchmark output files. This was a prerequisite for the Playwright reporter to function correctly.
**Thesis Insight:** The absence of a native reporter in Selenium required a manual instrumentation solution, while Playwright and Cypress both offer built-in reporting mechanisms. This disparity is a notable data point in the "Developer Experience" and "Data Collection" dimensions of the comparative analysis.

---

## Milestone: Project Published to GitHub
**Date:** March 16, 2026
**Status:** All project files committed and pushed to a public GitHub repository.
**Version Control Configuration:** A `.gitignore` file was created to exclude auto-generated and environment-specific files from the repository. The exclusion policy was deliberately designed to retain all benchmark data under `/results/` so that raw thesis evidence remains publicly visible and independently verifiable.
**Files Excluded from Version Control:**
* `node_modules/` — 20,000+ dependency files, recoverable via `npm install`
* `test-results/` — Playwright diagnostic screenshots and traces
* `playwright-report/` — Auto-generated HTML report
* `.env` — Security and environment variables
* `.DS_Store` / `Thumbs.db` — OS-generated junk files
**Thesis Insight:** The discipline of version control — specifically the intentional decision of what to include and exclude — is itself a research methodology consideration. Retaining benchmark output in the repository ensures full transparency and reproducibility of results.