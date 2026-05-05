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

---

**## Milestone: Selenium Custom Test Runner Implemented**
**Date:** May 04, 2026
**Status:** Selenium station now operates with an automated suite runner, achieving architectural parity with Playwright and Cypress directory scanning.

**Context:**
As the test suite expanded beyond the initial `login-test.js` to include `ep-01.js`, the Selenium station required a mechanism to execute multiple test files automatically — equivalent to how Cypress discovers `*.cy.js` files via `specPattern` and how Playwright scans the `playwright-station/` directory.

**Changes Implemented:**
1. **`selenium-station/runner.js` created** — A custom Node.js runner was built to automatically discover and execute all `.js` files within `selenium-station/`. The runner filters out itself, runs each test sequentially, and prints a structured pass/fail summary.
2. **Error isolation implemented** — Each test is wrapped in `try/catch`. If one fails, the runner continues executing remaining tests rather than crashing the suite.
3. **CI exit code handling implemented** — `process.exit(1)` is called if any tests fail, correctly signalling to GitHub Actions that the job should be marked as failed.
4. **`package.json` updated** — `run-selenium` now points to `runner.js`, meaning all future files added to `selenium-station/` are discovered automatically with no further configuration changes.

**Thesis Insight:**
This milestone surfaces one of the most significant architectural differences between the three frameworks. Cypress and Playwright ship with native test runners that handle file discovery, error isolation, structured reporting, and CI-compatible exit codes out of the box. Selenium is a browser automation library — it provides none of this. Achieving the same suite-level behaviour required the custom development of `runner.js`: approximately 30 lines of infrastructure code that exists solely to compensate for the absence of a built-in runner. This is a concrete, reproducible data point in the Developer Experience and Operational Overhead dimensions of the comparative analysis.

--------------------------------------------------------------------------------

***Date: May 05, 2026***
*Subject: Test Suite Refactoring: ISTQB Alignment and DOM State Management*
Context & Rationale:
Following the initial implementation of the Equivalence Partitioning (EP-01) and Boundary Value Analysis (BVA-01) test scenarios, a code review was conducted to evaluate the complexity and theoretical alignment of the test scripts across all three stations (Cypress, Playwright, Selenium). This led to a significant refactoring phase to better align the automation logic with formal ISTQB methodologies and to highlight framework-specific architectural behaviors.

1. Alignment with Equivalence Partitioning (EP-01 Refactor):

The Problem: The initial EP-01 script extracted all product prices programmatically, converted them from strings to floats, and performed a mathematical sort. This approach was heavily reliant on direct DOM access (e.g., el.innerText) and complex execution context switching. For instance, Cypress required converting jQuery objects to arrays ([...$prices]), and Playwright utilized evaluateAll() to run JavaScript inside the browser context. This introduced unnecessary layers of complexity and bypassed standard framework APIs.

The Solution: To strictly align with ISTQB Equivalence Partitioning—which dictates verifying representative values of a partition rather than an exhaustive list—the test was refactored. The new implementation asserts the boundaries of the sorted partition: checking that the first item is $7.99 and the last is $49.99 (known, fixed catalog values).

Outcome: This eliminated fragile DOM bypasses and contextual complexity, utilizing only two lines of standard API assertions per framework (e.g., Playwright's expect().toHaveText()).

2. Architectural Differences in State Management (BVA-01 Iteration):
The implementation of the Boundary Value Analysis scenario (which involves iterating through and clicking multiple "Add to Cart" buttons) surfaced critical differences in how each tool handles changing DOM states:

Cypress (The Managed Approach): Utilizes .each(($btn) => cy.wrap($btn).click()). Because iterating yields a raw DOM element, cy.wrap() is required to re-insert the element back into the Cypress execution chain. This allows Cypress to automatically manage retries and state updates behind the scenes.

Playwright (The Defensive Approach): Iterating through elements that change state (e.g., a button changing to "Remove" upon click) can easily trigger stale element references. Playwright requires a more explicit, defensive pattern using a for loop and the .nth(i) locator. This forces Playwright to re-query the DOM fresh on every iteration, guaranteeing the reference remains valid.

Selenium (The Raw Approach): Utilizes findElements() alongside a standard JavaScript for...of loop. While this straightforward iteration succeeds in the specific context of the SauceDemo application (since the buttons update text but are not removed from the DOM), it lacks built-in stale element protection. In a highly dynamic Single Page Application (SPA), this approach would be highly susceptible to StaleElementReferenceException errors, which would require the manual implementation of defensive querying similar to Playwright.

*Thesis Insight:
These refactoring decisions highlight a core dimension of the comparative analysis. Cypress heavily abstracts DOM state management and retries, lowering the barrier to entry but obscuring the underlying mechanics. Playwright provides modern, robust querying but expects the developer to explicitly manage state iteration defensively. Selenium provides raw access, leaving both iteration strategy and stale element protection entirely to the engineer's discretion.

--------------------------------------------------
## Milestone: BVA-01 Cypress Station Rewritten
Date: May 05, 2026
Change: The .each() loop was replaced with cy.get('.btn_inventory').click({ multiple: true }).
Why: The .each() callback passed a jQuery-wrapped element $btn into the loop — inconsistent with the decision to keep all scripts jQuery-free. The { multiple: true } option is a built-in Cypress modifier that clicks all matched elements in a single command with no loop, no callback, and no jQuery.
How it works: Cypress refuses to click multiple elements by default as a safety measure. { multiple: true } is an explicit instruction telling Cypress the behaviour is intentional — click every matching button on the page. Cypress handles the iteration internally.
Thesis Insight: { multiple: true } has no equivalent in Playwright or Selenium. Playwright requires a for loop with .nth(i). Selenium requires a for...of loop. One line in Cypress versus an explicit loop in both other frameworks is a direct, measurable difference in Developer Experience for multi-element interactions.

## Milestone: DT-R1 Added — Decision Table Testing
Date: May 05, 2026
Test: Checkout form submitted with first name and last name filled, postcode deliberately left empty. Expected outcome: postcode error displayed, user remains on the checkout information page.
Cypress — zero explicit waits across the entire flow. Two content assertions and one URL assertion. The intentionally empty postcode field is documented in the comments as a decision rather than an action.
Playwright — one explicit wait after login, all subsequent page transitions handled automatically. URL assertion uses .not.toHaveURL(/.*step-two/) — the .not negation is consistent with Playwright's built-in assertion API.
Selenium — three explicit driver.wait() calls required: one after login, one after navigating to the cart, one after clicking Checkout. Each page transition needs its own manual wait. Cypress and Playwright handle these automatically.
Thesis Insight: DT-R1 is the first multi-transition test in the suite. The number of manual waits required across an equivalent flow — zero for Cypress, one for Playwright, three for Selenium — is a direct and measurable indicator of how much async management each framework delegates to the developer. This is a concrete data point for the Async Handling benchmark.

## Milestone: ST-01 Added — State Transition Testing
Date: May 05, 2026
Test: Cart treated as a two-state system. S1 = empty, S2 = has items. Transition tested: S2 → S1 by adding one item then removing it. Badge is asserted after each transition.
## Observation: State Transitions — Negative Assertions and the Sleep Anti-Pattern
Date: May 05, 2026
Context: ST-01 required asserting the cart badge was removed from the page — a negative assertion. This exposed a structural difference between Selenium and the two modern frameworks.
Cypress and Playwright both provide native polling-based negative assertions. When .should('not.exist') or .not.toBeVisible() is executed, the framework keeps checking until the element is gone. No timing configuration needed.
Selenium has no equivalent. findElement() throws a fatal crash if the element is missing. The workaround is findElements() (plural), which returns an empty array instead. But findElements() evaluates the page instantly — it does not poll. Because the browser needs a few milliseconds to finish removing the badge after a click, calling it too quickly finds the badge still present and fails the test. The fix was await driver.sleep(300) — a hardcoded pause.
Why this matters: Hardcoded sleeps are a universally recognised anti-pattern in software engineering. They inflate execution time regardless of actual UI speed, and they cause flakiness when latency spikes push the real update time past the guessed duration.

The sleep was not an implementation choice — it was a structural consequence of Selenium's architecture. This is a reliability difference, not a syntax difference, and directly supports findings in the Async Handling, Developer Experience, and Pipeline Stability dimensions of the comparative analysis.