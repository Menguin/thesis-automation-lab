const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const benchmarkingDir = path.join(__dirname, 'benchmarking');
const files = fs
  .readdirSync(benchmarkingDir)
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(benchmarkingDir, f));

let passed = 0;
let failed = 0;

console.log(`\n🚀 Selenium Benchmarking Suite: Found ${files.length} test(s)...\n`);

for (const file of files) {
  const fileName = path.relative(__dirname, file);
  console.log(`▶️  Running: ${fileName}...`);
  try {
    execSync(`node "${file}"`, { stdio: 'inherit' });
    passed++;
  } catch (error) {
    console.error(`\n❌ FAILED: ${fileName}`);
    failed++;
  }
  console.log('-----------------------------------\n');
}

console.log(`📊 SELENIUM BENCHMARK RESULTS:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}\n`);

if (failed > 0) process.exit(1);