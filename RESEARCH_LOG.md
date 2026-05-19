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

## Milestone: EG-01 Added — Error Guessing
Date: May 05, 2026
Test: Whitespace-only input entered into all three checkout form fields. Expected outcome: validation rejects it, user remains on the checkout information page.
Why no specific error text assertion — the test checks whether whitespace bypasses validation, not what the error says. Asserting the error is visible and the URL has not changed is sufficient and more robust.
Selenium sleep increased to 500ms — EG-01 submits a full form rather than clicking a single button. The additional processing time required a longer guess. This remains the sleep anti-pattern, with the duration adjusted by judgment rather than measurement — which is itself a finding. The correct value can only be guessed, not known.

Key observations:
EG-01 and DT-R1 share the same navigation flow. DT-R1 enters valid data and leaves one field empty. EG-01 enters whitespace in all fields. Same structure, different adversarial intent. The relationship between Decision Table and Error Guessing techniques is visible in the code.
The sleep duration problem as a measurable finding. 300ms in ST-01, 500ms in EG-01 — both guessed. Cypress and Playwright resolve in the minimum actual time needed. Selenium guesses a fixed duration and hopes it is long enough. The fact that the guess changed between two tests in the same suite illustrates exactly why the sleep anti-pattern degrades reliability.
Cumulative wait count across the suite: 3 waits + 1 sleep for Selenium.
Selenium's wait overhead is accumulating with every multi-step test added to the suite. This is a measurable contributor to execution time differences in the benchmark.

## Incident Log: CI Timing Failures — Selenium Station
Date: May 05, 2026
Failures across two CI runs:

dt-r1.js — timed out waiting for [data-test="checkout"] then [data-test="firstName"]
st-01.js — cart badge still visible after sleep(300)
bva-01.js — cart badge showed 4 instead of 6 — clicks fired faster than CI could register them

Root cause: All hardcoded timing values were calibrated on a local Windows 11 machine. The GitHub Actions ubuntu-latest runner runs at a different speed and every guess was wrong.
Fixes applied:

dt-r1.js — all three driver.wait() timeouts raised from 5000 to 10000
st-01.js — driver.sleep() raised from 300 to 1000
bva-01.js — driver.sleep(500) added inside the click loop between each button

Thesis Insight: This is direct empirical evidence for the sleep anti-pattern argument documented after ST-01. The prediction was that hardcoded sleeps would fail when latency changed — CI proved it correct immediately. Neither Cypress nor Playwright required a single change to pass on CI. The fixes added the following artificial overhead per run: BVA-01 — 3000ms (6 × 500ms), ST-01 — tripled sleep, DT-R1 — doubled timeouts across three waits. This overhead inflates Selenium's benchmark execution times and must be acknowledged when interpreting PERF-01 results — the slower times are not purely WebDriver protocol overhead but also include accumulated timing buffers required for cross-environment reliability.
Files changed: bva-01.js, dt-r1.js, st-01.js in selenium-station/black-box/

## Incident Log: Chrome Autofill Interference — DT-R1 Selenium Station
Date: May 06, 2026
DT-R1 intentionally leaves the postal code field empty to trigger a validation error. Instead, the test kept failing because the error never appeared — the application was advancing to step two as if the form was complete.
The cause was Chrome itself. When Selenium launches Chrome, Chrome does not know it is being tested. It runs exactly like a normal browser — including background services the developer never asked for. Two caused problems:
Google Cloud Messaging (GCM) — Chrome's push notification system. It tried to register the headless browser as a device, failed repeatedly, and printed PHONE_REGISTRATION_ERROR messages. Noise, but it consumed resources.
TensorFlow Lite — Chrome's built-in machine learning model for smart autofill. It recognised the checkout form pattern and automatically filled in the postal code field using data saved on the machine. The test had left it empty on purpose. Chrome filled it silently. The form looked complete, it submitted successfully, and the error never appeared.

Why only Selenium was affected
Cypress runs inside the browser through its own proxy — Chrome's background services do not reach it. Playwright creates a clean isolated browser session where autofill and background services are off by default. Selenium launches Chrome as a regular user-facing browser and drives it from the outside — Chrome behaves exactly as it would for a real user, including running every background service it normally would.

The fix
Three Chrome flags were added to stop the interference:

--disable-background-networking — stops GCM push notification requests
--disable-sync — stops Chrome from syncing saved addresses from a Google account
--disable-features=AutofillServerCommunication,AutofillEnableAccountStorageForAddresses — disables the autofill feature that filled the postal code

Plus an explicit .clear() on the postal code field as a backup — even if Chrome autofills before the test reaches that line, the field is cleared before Continue is clicked.

DT-R1 problem — Chrome autofill filled the postal code field automatically. Fix: three Chrome flags and an explicit .clear() on the postal code field.
BVA-01 follow-on failure — The Chrome flags were only added to dt-r1.js, not bva-01.js. The GCM background errors were still firing during BVA-01 and consuming browser resources at the exact moment button clicks were being processed. Only the first click registered. Fix: same three Chrome flags added to bva-01.js, plus the button selector strategy changed from class indexing to unique data-test attributes to eliminate stale element references entirely.

Thesis insight
These additions are not test logic. They are environment management — three flags and one extra line written purely to stop the browser from interfering with the test. Cypress and Playwright required zero equivalent configuration. A developer encountering this for the first time would not know these flags exist and would spend significant time debugging what looks like a test failure but is actually a browser environment problem. This is relevant to Developer Experience, Operational Overhead, and Test Reliability dimensions of the comparative analysis.
## Incident Log: Headless Viewport Rendering — BVA-01
Date: May 06, 2026
The problem: Only the first Add to Cart button click registered regardless of selector strategy or sleep duration. Badge consistently showed 1.
Root cause: Headless Chrome renders at a small default viewport when no window size is specified. At that size, saucedemo's sticky navigation bar overlaps the product buttons. Selenium located each button correctly but the click landed on the navigation bar on top of it. The first button is close enough to the top of the page to register. The remaining five are obscured. Clicks were silently intercepted.
The fix: --window-size=1920,1080 forces Chrome to render at full desktop resolution. At 1920×1080 the layout is correct and all six buttons are fully accessible. With the viewport fixed, the sleep between clicks was also removed entirely — elementIsVisible confirms each button is unobstructed before clicking, and the polling wait confirms all six registered.
Why only Selenium: Cypress controls the viewport through its own execution environment. Playwright defaults to 1280×720 — large enough to avoid overlap. Selenium launches Chrome externally with no default viewport configuration. The developer sets it manually or discovers the problem the hard way.
Thesis insight: This is the third category of environment management failure unique to Selenium in this suite — after timing failures and Chrome autofill interference. The pattern is now consistent across three incidents: Selenium exposes the full browser environment to the developer and managing it is a measurable, ongoing cost. Cypress and Playwright handled all three automatically.
File changed: selenium-station/black-box/bva-01.js
Date: May 06, 2026 (Part 2)
Subject: Viewport Limitations and Actionability Engines: The Sticky Header Interception

Observation:
During the execution of the Boundary Value Analysis (BVA-01) scenario in the CI/CD pipeline, the Selenium script successfully iterated through all 6 "Add to Cart" buttons without throwing an error, yet the final cart assertion failed because the badge only registered 1 item. The root cause was identified as a physical viewport limitation combined with the presence of a sticky navigation header.

Technical Analysis:
When running in headless mode, Chrome defaults to a constrained viewport (e.g., 800x600). As Selenium scrolled down the page to interact with the remaining 5 buttons, it aligned them at the absolute top edge of the browser window.

The Interception: Because the application features a sticky header ("Swag Labs" banner) with a higher CSS z-index, the buttons were positioned underneath the header.

Lack of Actionability Checks (Selenium): Selenium lacks an internal "Actionability Engine." It executed the click at the calculated X/Y coordinates blindly, clicking the sticky header instead of the button. Because the click event successfully fired somewhere on the DOM, no exception was thrown, leading to a silent failure.

Intelligent Abstraction (Cypress & Playwright): Cypress and Playwright did not suffer from this issue because both feature native Actionability Engines. Before executing a click, these frameworks calculate element occlusion (verifying no other element is covering the target). If covered, they intelligently adjust the scroll position (e.g., to the center of the screen) before interacting.

Thesis Implication:
This exposes another significant layer of Operational Overhead associated with raw WebDriver implementations. Selenium requires the engineer to manually manage physical rendering constraints and viewport dimensions (e.g., injecting --window-size=1920,1080 into the Chrome options) to prevent silent interaction failures. Modern tools completely abstract this UI layout complexity, guaranteeing that if a click is commanded, it hits the intended target.

Milestone: Selenium Station Fully Stabilised — Final Three Files Rewritten
Date: May 06, 2026
Status: All five Selenium tests passing locally and on CI.
Changes applied:
bva-01.js — The entire click loop was rewritten with a per-click retry engine using JavaScript injection (driver.executeScript('arguments[0].click()')). After each click, a retry loop checks the badge count incremented before moving to the next button. If a click is dropped by the browser — due to React state batching or CI runner load — the loop retries up to 10 times before failing. This manually replicates the action retryability that Cypress and Playwright provide natively on every interaction.
dt-r2.js — Three additions: --window-size=1920,1080 to fix the mobile layout on CI, --incognito to fully prevent Chrome autofill from accessing saved addresses, and a cart navigation retry loop that checks the URL changed to cart.html before proceeding. JavaScript injection used for checkout and continue button clicks.
st-01.js — --window-size=1920,1080 added. The remove button is now targeted by its specific data-test="remove-sauce-labs-backpack" selector rather than a generic class selector. JavaScript injection and retry loop replace the standard click and async wait pattern.
Thesis insight: The complete list of infrastructure built manually in Selenium to achieve what Cypress and Playwright provide out of the box now stands as follows — manual browser teardown, explicit page transition waits, Chrome background service flags, autofill suppression, incognito mode, window size configuration per file, React synchronisation loops, Node version standardisation, custom suite runner, JavaScript click injection, and per-click action retryability loops. Every item on this list is zero lines of code in Cypress and Playwright.

## Milestone: Benchmarking Suite Implemented — All Four Tests Verified Across All Three Stations
Date: May 06, 2026
Status: All benchmarking tests passing on CI after per-station fixes applied.

Overview
A dedicated benchmarking folder was created inside each station to house four tests designed specifically for comparative performance and behaviour measurement. These tests are separate from the black-box technique tests — they exist not to demonstrate ISTQB technique literacy but to generate the quantitative data that supports the thesis argument.
The four benchmarking tests are:
UC-01 — Use Case Testing (Complete Purchase Journey)
The only test in the entire suite that reaches the order confirmation page. Covers login → add item → cart → checkout form → order summary → finish → confirmation. Validates that the full happy path functions correctly on all three frameworks and provides an end-to-end execution time baseline.
ASYNC-01 — Async/Wait Behaviour (Product Detail Navigation)
The only test that navigates away from the inventory page into a product detail page and back. Triggers three separate DOM state transitions — inventory, detail page, inventory again — while verifying that the product name is consistent, the cart updates correctly, and the cart state persists after navigation. This is the primary test for stressing how each framework handles async DOM transitions, and it is the test that will be run 30 times to produce flakiness data.
PERF-01 — Execution Speed (Login to Inventory Load Time)
Measures the time from the login button click to the inventory list becoming visible. This is the core execution speed benchmark. Each framework measures this differently at the implementation level, but all three produce a comparable millisecond duration that can be averaged across 30 runs for the final benchmark table.
PERF-02 — Network Observability (Navigation Timing API)
Measures the network response time for the initial application load using the browser's built-in Navigation Timing API. This test exposed a significant architectural characteristic of the application under test — see incident log below.

Incident: SPA Routing — PERF-01 and PERF-02 Playwright, PERF-02 Cypress
What failed:
Both PERF-01 and PERF-02 in Playwright used page.waitForResponse(r => r.url().includes('inventory')) to capture the inventory page response. PERF-02 in Cypress used cy.intercept('GET', '**/inventory.html') to intercept the same request. All three timed out waiting for a request that never arrived.
Why it failed:
saucedemo is a Single Page Application built with React. After the initial HTML, CSS, and JavaScript bundle loads, all navigation is handled entirely by React's client-side router. When the login button is clicked, the URL changes to /inventory.html using the browser's History API — but no real HTTP GET request is made to the server. The routing happens in JavaScript within the already-loaded application. There is nothing on the network to intercept.
page.waitForResponse and cy.intercept are designed to observe real network traffic. They are correct tools — the application simply does not produce the network event they were waiting for.
The fix:
All three stations were updated to use the browser's Navigation Timing API, which measures the real HTTP response for the initial application load — the only genuine network request saucedemo makes. This is accessed differently per framework but produces consistent, comparable data:
Cypress:
javascriptcy.window().then((win) => {
  const navTiming = win.performance.getEntriesByType('navigation')[0];
  const responseTime = navTiming.responseEnd - navTiming.requestStart;
});
Playwright:
javascriptconst responseTime = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  return nav.responseEnd - nav.requestStart;
});
Selenium:
javascriptconst responseTime = await driver.executeScript(
  'return window.performance.getEntriesByType("navigation")[0].responseEnd - window.performance.getEntriesByType("navigation")[0].requestStart'
);
PERF-01 in Playwright was also rewritten — the waitForResponse pattern was replaced with a simple Date.now() timer around the login button click and inventory list visibility check, consistent with how the Selenium version measures execution speed.
Thesis insight:
This incident confirms that the PERF-02 benchmark measures initial application load performance across all three frameworks rather than inventory page navigation performance. This is a consistent limitation driven by the application's architecture, not by any framework limitation. The data produced is still valid and comparable because all three frameworks are measuring the same underlying event using the same browser API. This should be acknowledged in the methodology section — the application under test is a SPA, and the network benchmark reflects initial load rather than navigational response.
A secondary insight is that Playwright's CDP-based waitForResponse and Cypress's cy.intercept both failed on the same application for the same reason — demonstrating that even the most architecturally advanced network observation tools cannot capture what the network does not produce. The fix required dropping down to the browser's own Performance API, which is framework-agnostic.

Per-Station Code Fixes Applied
Cypress — one fix required:
PERF-02 rewrote from cy.intercept to cy.window() + Navigation Timing API. All other benchmarking tests passed without changes.
Playwright — two fixes required:
PERF-01 rewrote from page.waitForResponse to Date.now() timer. PERF-02 rewrote from page.waitForResponse to page.evaluate() + Navigation Timing API. All other benchmarking tests passed without changes.
Selenium — two files required full rewrite:
UC-01 and ASYNC-01 required the complete standard Selenium hardening pattern applied throughout the black-box suite — --window-size=1920,1080, --disable-background-networking, --disable-sync, --disable-features=AutofillServerCommunication, --incognito for UC-01, JavaScript click injection for all navigation actions, retry loops for cart navigation, and increased timeouts for all driver.wait() calls. PERF-01 and PERF-02 passed without changes as they use Date.now() and driver.executeScript() respectively — neither relies on network interception or complex page navigation.

## Thesis Insights, Revelations and Important Findings
thesis-automation-lab — Complete Finding Set
Date compiled: May 06, 2026

Finding 1: Architecture Is the Root of Every Difference
Every difference observed between the three frameworks traces back to one architectural decision — how each tool communicates with the browser.
Cypress runs inside the browser itself using a proxy layer. It shares the same execution context as the application under test. This is why its commands queue automatically, why waits are implicit, and why Chrome's background services do not interfere with its tests.
Playwright communicates with Chrome via CDP — the Chrome DevTools Protocol — a low-level debugging channel. It creates a fully isolated, controlled browser environment. This is why it can access network timing natively, why it has built-in actionability checks, and why background services are suppressed by default.
Selenium launches Chrome as a regular user-facing browser and drives it from the outside using the WebDriver protocol. Chrome does not know it is being tested. It behaves exactly as it would for a real user — running every background service, enabling autofill, rendering at its default viewport size. Every environmental difference that caused test failures in this lab originates from this single fact.

Finding 2: The Native Test Runner Gap
Cypress and Playwright ship with complete test runner infrastructure — file discovery, parallel execution, error isolation, structured reporting, and CI-compatible exit codes. Everything needed to run a test suite is included.
Selenium is a browser automation library. It provides none of this. To achieve equivalent suite-level behaviour, a custom runner.js had to be built — approximately 30 lines of infrastructure code whose sole purpose is to compensate for the absence of a built-in runner. This was documented, committed, and referenced throughout the research log as a recurring example of the Developer Experience cost.

Finding 3: The Sleep Anti-Pattern Is a Structural Consequence, Not a Developer Choice
The observation was made early that hardcoded driver.sleep() calls are an anti-pattern. What the CI failures proved is that they are not an anti-pattern that a careful Selenium developer can avoid — they are a structural consequence of Selenium's architecture.
When Cypress and Playwright assert something, they poll until the condition is true or the timeout expires. When Selenium checks something, it checks once at that exact millisecond. If the page is not ready, the check fails. The only ways to handle this in Selenium are to sleep and hope the page catches up, or to write a custom polling loop. Both were implemented in this lab. Neither is as reliable as the native polling that Cypress and Playwright provide on every assertion automatically.
The CI failures documented the prediction exactly — a sleep that passed locally on a fast Windows machine failed on a slower Linux CI runner. The correct duration was never knowable without measurement.

Finding 4: Negative Assertions Expose Different Levels of Automation Maturity
ST-01 was the first test to assert that something was no longer on the page. This produced three structurally different implementations:
Cypress uses .should('not.exist') — one assertion, automatic polling, built-in.
Playwright uses .not.toBeVisible() — one assertion, automatic polling, built-in.
Selenium has no equivalent. findElement() throws a fatal exception if the element is missing. The workaround is findElements() which returns an empty array, enabling a safe length check. But findElements() evaluates the page instantaneously without polling — requiring a sleep before checking. This is the negative assertion problem: the frameworks that matter most for state transition testing are the ones that can assert absence reliably. Selenium cannot, natively.

Finding 5: Chrome Runs Unmodified — And That Causes Real Test Failures
The dt-r2 test intentionally left the postal code field empty to trigger a validation error. The error never appeared. Chrome's built-in machine learning autofill model — TensorFlow Lite — recognised the checkout form pattern and filled in the postal code automatically. The form submitted successfully. The test failed not because of a code error or a timing issue, but because the browser was doing something the developer did not ask for and did not know about.
The fix required three Chrome command-line flags to suppress background services plus an explicit .clear() on the postal code field as a backup. Cypress and Playwright required zero equivalent configuration because they do not give Chrome the opportunity to behave as a regular user browser.

Finding 6: Headless Viewport Is Not Configured Automatically
When headless Chrome launches without an explicit window size, it renders at a small default viewport. On saucedemo at that size, the mobile layout activates — the navigation bar repositions and buttons move. Selenium tried to click buttons at their desktop positions, found nothing, and timed out.
The fix was --window-size=1920,1080, added to every Selenium test file individually — because each test launches its own Chrome instance, and each one must be configured independently.
Cypress manages its viewport through its own execution environment. Playwright defaults to a desktop-sized viewport. Both make this problem invisible to the developer.

Finding 7: React Event Batching Drops Selenium Clicks Silently
When Selenium clicked six Add to Cart buttons in rapid succession, React batched the state updates and dropped most of the click events. Only one click registered. The cart badge showed 1 instead of 6.
Selenium fires click events at JavaScript execution speed — as fast as the CPU allows — with no awareness of whether the application has finished processing the previous event. React's virtual DOM batches updates for performance. The two mechanisms are incompatible at high speed.
Cypress handles this with { multiple: true } — a single atomic operation. Playwright re-queries each element on every loop iteration and waits for the element to be actionable before clicking. Both approaches are aware of the application's readiness state. Selenium is not.
The fix required a per-click confirmation loop — after each click, a retry loop checks the badge count incremented before proceeding to the next. This manually implements what Cypress and Playwright provide natively.

Finding 8: Action Retryability Is the Most Fundamental Difference
Even with explicit waits, viewport configuration, React synchronisation loops, and JavaScript click injection, Selenium continued dropping individual click events on CI. The diagnosis was action retryability.
Playwright and Cypress monitor application state after each interaction. If a click does not produce the expected outcome, they retry automatically within their timeout window. The developer never knows this happened.
Selenium fires the WebDriver click event exactly once. If the browser is occupied at that microsecond, the event disappears. There is no retry mechanism at the framework level. Building one requires wrapping every critical click in a while loop that re-clicks until the expected DOM change is confirmed. This was implemented for three tests. In a larger suite it would be implemented dozens of times.

Finding 9: JavaScript Click Injection Is Required for Reliability
The standard button.click() in Selenium routes through the WebDriver event system, which can be swallowed under CI load. Replacing it with driver.executeScript('arguments[0].click()', button) fires the click event directly on the DOM element, bypassing the WebDriver routing layer.
This is a known workaround in professional Selenium usage. It is not documented as a recommended pattern — it is a compensatory technique. Its necessity in this lab is itself a data point: to achieve the same reliability as a standard .click() call in Cypress or Playwright, Selenium requires a mode of interaction that bypasses its own primary API.

Finding 10: Node Version Affects Framework Behaviour
The driver.wait(async () => {...}) pattern — used for custom polling conditions — behaved differently on Node 24 (local machine) versus Node 20 (CI server). On Node 20, the async condition function did not resolve correctly and the wait always timed out. The pattern was replaced with explicit while loops that produce identical behaviour on both Node versions.
Cypress and Playwright abstract their internal async mechanisms entirely from the developer. The Node version does not affect how their assertions behave. Selenium's low-level architecture exposes runtime differences at the JavaScript engine level, adding version management to the list of environmental concerns the developer must handle.

Finding 11: SPA Routing Makes Network Interception Invalid for Navigation Events
PERF-02 was originally designed to measure inventory page network response time using page.waitForResponse (Playwright) and cy.intercept (Cypress). Both timed out waiting for a request that never arrived.
saucedemo is a Single Page Application. After the initial load, all navigation is client-side. The URL changes to /inventory.html via React Router without making an HTTP request. There is nothing on the network to intercept.
This is a finding about the application architecture rather than a framework limitation — but it demonstrates that Playwright's CDP access and Cypress's network proxy only provide value when real network traffic exists. On modern SPAs, significant application transitions produce no network events at all.
All three frameworks were updated to use the browser's Navigation Timing API — measuring initial application load response time rather than navigation response time. This produces consistent, comparable data and is acknowledged in the methodology as a characteristic of the application under test.

Finding 12: The Cumulative Overhead List
Everything added to the Selenium station to achieve the same test outcomes as Cypress and Playwright, none of which required any equivalent work in the other two stations:

Manual browser launch and teardown per file
Explicit waits for every page transition
Hardcoded sleep values for timing management
Chrome background service suppression flags
Chrome autofill suppression flags
Explicit field clearing to prevent autofill interference
Window size configuration per file
Per-click React synchronisation loops
JavaScript click injection for reliable event dispatch
Per-click action retryability loops
Custom test runner for suite-level execution
Node version standardisation
Incognito mode for profile isolation

Every item on this list is zero lines of code in Cypress and Playwright.

Finding 13: CI Execution Time Reflects Infrastructure Cost, Not Just Speed
Selenium's benchmark execution times are inflated by the accumulated timing buffers required for reliability — sleeps between clicks, waits between page transitions, retry loop polling intervals. These are not measures of how fast Selenium processes the application. They are measures of how much artificial delay is needed to make Selenium behave reliably.
When interpreting PERF-01 and PERF-02 benchmark data, Selenium's slower times must be understood in this context. The timing overhead is partially attributable to WebDriver protocol latency and partially attributable to manually inserted delays. Cypress and Playwright times reflect actual framework-application interaction speed with no artificial padding.

Finding 14: The Frameworks Differ in Scope, Not Just Syntax
The most important overall finding is that comparing Selenium, Playwright, and Cypress as equivalent tools in different syntaxes is a category error. They are tools of different scope.
Cypress and Playwright are testing frameworks. They ship with a test runner, assertion library, network interception, automatic waiting, browser lifecycle management, structured reporting, and CI integration. The developer writes test logic.
Selenium is a browser automation library. It provides a protocol for sending instructions to a browser. Everything else — the runner, the assertions, the waits, the retries, the reporting, the CI configuration — is the developer's responsibility.
The choice between them is not a preference question. It is an architectural question about how much infrastructure the team is willing to build and maintain. This lab has produced a concrete, reproducible, and documented answer to what that infrastructure costs.

## Milestone: Benchmark Runner and Visualization Layer Implemented
Date: May 06, 2026
What was built
A configurable benchmark runner was added at the project root, benchmark.js, that accepts a number of iterations as a command-line argument and runs the benchmarking suite across all three stations that many times. Each iteration measures the total execution time per framework, captures pass/fail status from the exit code, and persists the data after every run so progress is not lost if the process is interrupted.
The runner produces two output files in the results/ folder. benchmark-data.json contains the structured raw data and computed statistics. benchmark-data.js contains the same data exported as a global JavaScript variable, allowing the visualization HTML to load it without requiring a local web server.
A dedicated Selenium runner, selenium-station/benchmarking-runner.js, was added alongside the main runner.js. The benchmarking runner scans only the benchmarking folder, ensuring that the 30-run benchmark measures the four benchmark tests in isolation without inflating timing data with black-box test execution.
A visualization page, results/charts.html, was added to render the benchmark data graphically. It loads Chart.js from a public CDN and renders four charts plus a complete statistics table — mean execution time per framework, execution time across all runs as a line series, flakiness rate as a percentage, and a min/mean/max distribution comparison. The HTML reads the JS-loadable data file at load time, allowing the charts to be opened directly in any browser by double-clicking the file.
The npm scripts were extended with three benchmark-specific commands — run-benchmark-cypress, run-benchmark-playwright, and run-benchmark-selenium — each scoped to the benchmarking folder of its respective station. These are called sequentially by the main benchmark.js runner for each iteration.
In addition, the Cypress and Playwright run scripts were updated to emit native JSON reporter output to results/cypress.json and results/playwright.json. These per-test JSON reports are supplementary to the benchmark data and provide granular per-test timing should it be needed for additional analysis.
Statistical Methodology
For each framework, the runner computes:

Mean execution time across all runs
Standard deviation, indicating consistency
Minimum and maximum to capture the range
Median to identify the central tendency
Flakiness rate as a percentage of failed runs

These calculations are performed directly in the runner using the standard statistical formulas. Variance is computed as the average squared difference from the mean. Standard deviation is the square root of variance. The data is calculated against the actual recorded durations rather than estimated, ensuring the reported statistics reflect real execution measurements.
The Central Limit Theorem requires n ≥ 30 for statistical validity, which is why the benchmark is intended to be run with at least 30 iterations. The runner accepts any iteration count via the command line, allowing smaller test runs (5 iterations) during development verification and full 30-run executions for thesis data collection.
Initial Verification Run
A 1-iteration verification run was executed locally to confirm the entire pipeline works end to end. The results were notable enough to warrant comment as an early observation:

Cypress: 67,507ms
Playwright: 25,112ms
Selenium: 11,359ms

This single-run snapshot contradicts the common claim in framework comparison articles that Selenium is the slowest. The reason is structural — Cypress's Electron runner has substantial startup overhead and JSON reporter processing time, Playwright spawns multiple parallel browser contexts that each carry initialization cost, and Selenium's custom runner is lean with per-test Chrome launches that are individually slower but cumulatively lighter than the alternatives.
This is precisely the kind of finding the benchmark methodology is designed to produce — measured data that contradicts received wisdom and forces the analysis to engage with structural causes rather than relying on common assumptions.
The 30-run benchmark will produce the full statistical distribution needed for the thesis comparison chapter. The 1-run verification confirms the harness itself is operating correctly and producing valid data.
Pending
The 30-iteration benchmark execution and resulting data collection. Once the CI pipeline confirms the additions are clean, the full benchmark will be executed and the data committed alongside the visualization for thesis evidence.
Files Added

benchmark.js — runner at project root
selenium-station/benchmarking-runner.js — Selenium-only benchmarking suite runner
results/charts.html — visualization page
results/benchmark-data.json — raw benchmark data (auto-generated)
results/benchmark-data.js — JS-loadable benchmark data (auto-generated)
results/cypress.json — Cypress per-test report (auto-generated)
results/playwright.json — Playwright per-test report (auto-generated)

Files Modified

package.json — three benchmark npm scripts added, Cypress and Playwright scripts updated to emit JSON reports

