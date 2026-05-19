const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runs = parseInt(process.argv[2]) || 30;
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);

const benchmarkData = {
  metadata: {
    timestamp: new Date().toISOString(),
    totalRuns: runs,
    node: process.version,
    platform: process.platform
  },
  runs: [],
  statistics: {}
};

console.log(`\n🚀 Starting Benchmark — ${runs} run(s) per framework\n`);

for (let i = 1; i <= runs; i++) {
  console.log(`\n📊 RUN ${i} of ${runs}`);
  console.log('---------------------------------------------------');

  const runResult = {
    runNumber: i,
    timestamp: new Date().toISOString(),
    cypress: { passed: false, durationMs: 0 },
    playwright: { passed: false, durationMs: 0 },
    selenium: { passed: false, durationMs: 0 }
  };

  // Cypress
  console.log('\n▶️  Cypress...');
  const cypressStart = Date.now();
  try {
    execSync('npm run run-benchmark-cypress', { stdio: 'inherit' });
    runResult.cypress.passed = true;
  } catch (e) {
    runResult.cypress.passed = false;
  }
  runResult.cypress.durationMs = Date.now() - cypressStart;

  // Playwright
  console.log('\n▶️  Playwright...');
  const playwrightStart = Date.now();
  try {
    execSync('npm run run-benchmark-playwright', { stdio: 'inherit' });
    runResult.playwright.passed = true;
  } catch (e) {
    runResult.playwright.passed = false;
  }
  runResult.playwright.durationMs = Date.now() - playwrightStart;

  // Selenium
  console.log('\n▶️  Selenium...');
  const seleniumStart = Date.now();
  try {
    execSync('npm run run-benchmark-selenium', { stdio: 'inherit' });
    runResult.selenium.passed = true;
  } catch (e) {
    runResult.selenium.passed = false;
  }
  runResult.selenium.durationMs = Date.now() - seleniumStart;

  benchmarkData.runs.push(runResult);

  // Save after each run so progress isn't lost if interrupted
  saveData(benchmarkData);

  console.log(`\n✅ Run ${i} complete`);
}

// Calculate statistics
['cypress', 'playwright', 'selenium'].forEach(fw => {
  const durations = benchmarkData.runs.map(r => r[fw].durationMs);
  const passes = benchmarkData.runs.filter(r => r[fw].passed).length;
  const sum = durations.reduce((a, b) => a + b, 0);
  const mean = sum / durations.length;
  const variance = durations.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  const sorted = [...durations].sort((a, b) => a - b);

  benchmarkData.statistics[fw] = {
    runs: durations.length,
    passed: passes,
    failed: durations.length - passes,
    flakinessRate: parseFloat(((durations.length - passes) / durations.length * 100).toFixed(2)),
    meanMs: Math.round(mean),
    stdDevMs: Math.round(stdDev),
    minMs: Math.min(...durations),
    maxMs: Math.max(...durations),
    medianMs: sorted[Math.floor(sorted.length / 2)]
  };
});

saveData(benchmarkData);

console.log('\n===================================================');
console.log('📊 BENCHMARK COMPLETE — STATISTICS');
console.log('===================================================');
['cypress', 'playwright', 'selenium'].forEach(fw => {
  const s = benchmarkData.statistics[fw];
  console.log(`\n${fw.toUpperCase()}:`);
  console.log(`  Passed: ${s.passed} / ${s.runs}  (Flakiness: ${s.flakinessRate}%)`);
  console.log(`  Mean: ${s.meanMs}ms  StdDev: ${s.stdDevMs}ms`);
  console.log(`  Min: ${s.minMs}ms  Median: ${s.medianMs}ms  Max: ${s.maxMs}ms`);
});
console.log('\n===================================================');
console.log('📁 Data saved to: results/benchmark-data.json');
console.log('📊 Open results/charts.html in a browser to view charts');
console.log('===================================================\n');

function saveData(data) {
  // Write JSON for raw data access
  fs.writeFileSync(
    path.join(resultsDir, 'benchmark-data.json'),
    JSON.stringify(data, null, 2)
  );
  // Write JS-loadable version so charts.html works without a web server
  fs.writeFileSync(
    path.join(resultsDir, 'benchmark-data.js'),
    `const benchmarkData = ${JSON.stringify(data, null, 2)};`
  );
}