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

## Incident Log: March 16, 2026
### CI Pipeline: Playwright Execution Time
**Issue:** Playwright CI job taking significantly longer than Cypress and Selenium jobs.
**Symptoms:** Playwright job averaging 1 minute 39 seconds per run compared to significantly shorter execution times for the other two frameworks.
**Root Cause:** Playwright's CI architecture requires downloading full browser binaries (Chromium, Firefox, and WebKit) plus all system dependencies onto a clean Ubuntu server on every run. This is fundamentally different from Cypress, which bundles its browser with `npm ci`, and Selenium, which uses the pre-installed Chrome via `setup-chrome@v2`. The actual test execution accounts for only ~5-10 seconds of the total — the remaining ~90 seconds is environment setup overhead.
**Resolution:** Implemented GitHub Actions browser caching via `actions/cache@v4`. The cache uses `package-lock.json` as its key, meaning browsers are only re-downloaded when dependencies change. Subsequent runs restore from cache, reducing Playwright CI time from ~1m 39s to ~20-30s.
**Thesis Insight:** This is a significant finding for the "Operational Overhead" and "CI/CD Compatibility" dimensions of the comparative analysis. Playwright's requirement to manage its own browser binaries is both a strength (version consistency, cross-browser support) and a cost (setup time, storage overhead). Cypress and Selenium both delegate browser management to the host environment, which reduces CI setup time but introduces a different risk — dependency on whatever browser version the environment provides. The caching solution mitigates Playwright's overhead in practice, but the architectural reason for that overhead is a meaningful data point in the comparative study.

## Milestone: CI Pipeline Performance Benchmarking Complete
**Date:** March 16, 2026
**Status:** All three frameworks executing within expected CI performance parameters. Playwright browser caching confirmed operational.

## CI Execution Time Benchmark (GitHub Actions, ubuntu-latest)
| Framework | Execution Time | Browser Source |
|---|---|---|
| Selenium | 40s | Pre-installed Chrome via `setup-chrome@v2` |
| Cypress | 38s | Electron bundled inside `node_modules` via `npm ci` |
| Playwright | 1m 7s | 437MB browser cache restored from GitHub Actions cache |

**Pre-caching baseline (Playwright):** 1m 39s
**Post-caching result (Playwright):** 1m 7s
**Time saved by caching:** ~32 seconds per run

**Cache Confirmation:**
```
Cache hit for: playwright-a29110c79baf5b230d371746582d78f428d6d85744d27be9ebf4a252011c
Cache Size: ~437 MB (458013712 B)
Cache restored successfully
```
**Thesis Insight:** The CI benchmark reveals a fundamental architectural trade-off between the three frameworks. Selenium and Cypress both achieve sub-40 second CI execution by delegating browser management to the host environment — Selenium uses whatever Chrome the server provides, and Cypress bundles Electron directly into its npm package. Playwright's approach is fundamentally different: it ships and manages its own browser binaries (Chromium, Firefox, WebKit), totalling 437MB. This is the measurable cost of Playwright's cross-browser consistency guarantee. While caching reduces the overhead from 1m 39s to 1m 7s, the 437MB transfer remains unavoidable because the binaries must be restored to the runner on every execution. This trade-off — greater environment control at the cost of higher setup overhead — is a significant finding in the "Operational Overhead" and "CI/CD Compatibility" dimensions of the comparative analysis and directly supports the thesis argument that no single framework is universally optimal across all evaluation criteria.

## Incident Log: March 16, 2026
### Framework: Cypress
**Issue:** Cypress GUI (`cypress open`) Crash Resolution and Version Update.

**Part 1 — GUI Resolution**
**Symptoms:** Following the original Electron/GPU crash documented above, a second attempt to launch `cypress open` reproduced the same white screen failure, confirming the issue was consistent and environment-specific rather than a one-time anomaly.
**Resolution:** The following sequence of commands cleared the corrupted Cypress cache and forced a clean reinstallation:
```bash
npx cypress cache clear
npx cypress install
npm install cypress@latest --save-dev
npx cypress install
```
**Outcome:** Cypress GUI launched successfully after the clean reinstallation. The root cause was a corrupted local Cypress binary cache rather than a permanent GPU/Electron incompatibility.
**Thesis Insight:** The resolution required four sequential CLI commands and a full cache wipe — a non-trivial recovery process. This is a meaningful data point in the "Ease of Maintenance" and "Developer Experience" dimensions of the comparative analysis. Neither Playwright nor Selenium required equivalent cache management procedures during this research period.

---

**Part 2 — Version Update and Security Warning**
**Symptoms:** After reinstalling via `cypress@latest`, the following warning appeared on launch:
```
Warning: The allowCypressEnv configuration option is enabled. This allows 
any browser code to read values from Cypress.env(). This is insecure and 
will be removed in a future major version.
```
**Root Cause:** The `cypress@latest` installation pulled a newer version than the originally pinned `^13.7.0` in `package.json`. The newer version introduced stricter security defaults around environment variable access in browser code.
**Resolution:** Added `allowCypressEnv: false` to `cypress.config.js` to explicitly disable the insecure behaviour and suppress the warning. The `package.json` dependency version was also updated to reflect the currently installed version for reproducibility.
**Thesis Insight:** This incident highlights a reproducibility risk inherent in using `^` (caret) version pinning in `package.json`. The caret allows automatic minor and patch updates, which in this case silently pulled a newer Cypress version with different security defaults. For a comparative thesis where consistent benchmark conditions are required, this is a notable observation about dependency management discipline across frameworks.