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
## Milestone: Continuous Integration (CI) Pipeline Deployed
**Date:** March 16, 2026
**Status:** GitHub Actions workflow operational. All three frameworks executing automatically on every push to `main`.

**Changes Implemented:**
1. **`.github/workflows/ci.yml` created** — A GitHub Actions workflow was configured to automatically trigger all three test stations in parallel on every push. Each framework runs as an isolated job on a clean `ubuntu-latest` cloud server, proving that results are not specific to the local Windows 11 development environment.
2. **Selenium headless mode enabled** — Selenium required manual configuration to run in a headless (no display) mode for CI compatibility. Three Chrome arguments were added to `login-test.js`:
   - `--headless=new` — Runs Chrome invisibly with no GUI
   - `--no-sandbox` — Required because GitHub Actions executes as root on Linux
   - `--disable-dev-shm-usage` — Prevents memory crashes on cloud server shared memory limits
3. **Playwright and Cypress required no changes** — Both frameworks detected the CI environment automatically and switched to headless execution without configuration. This is a direct, measurable contrast with Selenium's manual instrumentation requirement.
4. **Playwright results uploaded as CI artifact** — The workflow captures `results/` as a downloadable artifact after each run, meaning benchmark data is preserved at the GitHub Actions job level independently of the repository.

**Thesis Insight:** The CI deployment exposed a fundamental architectural difference between the three frameworks. Playwright and Cypress are CI-native by design — they require zero additional configuration to run in a headless cloud environment. Selenium, as a lower-level browser automation library, delegates all environment management to the developer. This distinction is a significant data point across multiple evaluation dimensions: ease of setup, portability, and operational overhead. The fact that Selenium required three additional system-level flags (`--headless=new`, `--no-sandbox`, `--disable-dev-shm-usage`) to achieve what Playwright and Cypress do automatically is itself a measurable finding.

**Reproducibility Note:** The CI pipeline now serves as an independent, automated proof of reproducibility. Every push to the repository triggers a full execution of all three stations on a clean machine — validating the claim made in Section 5 of the README that the lab can be reproduced in three commands from any environment.

## Incident Log: March 16, 2026
### CI Pipeline: Node.js Deprecation Warning
**Issue:** GitHub Actions deprecation warning on all three workflow jobs.
**Symptoms:** Warning stating that `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/upload-artifact@v4` were running on Node.js 20 and would be forced to Node.js 24 after June 2nd, 2026.
**Root Cause:** The GitHub Actions runner infrastructure is migrating from Node.js 20 to Node.js 24. The pinned action versions (`@v4`) were tied to the older runtime.
**Resolution:** Bumped all GitHub-maintained actions to their Node 24-native versions (`actions/checkout@v5`, `actions/setup-node@v5`, `actions/upload-artifact@v6`). Additionally, the test environment Node version was updated from `18` to `20` (current LTS) across all three jobs to ensure stability and forward compatibility.
**Thesis Insight:** A deliberate decision was made to pin the CI environment to Node 20 LTS rather than using a dynamic `lts/*` selector. While `lts/*` would automatically track the latest LTS release, it introduces the risk of silent environment changes between benchmark runs — directly undermining the reproducibility requirements of a comparative thesis. Pinning to a specific version ensures that all benchmark data is collected under identical, documented conditions.