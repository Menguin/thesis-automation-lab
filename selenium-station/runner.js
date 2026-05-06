const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootFiles = fs
  .readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && f !== 'runner.js')
  .map(f => path.join(__dirname, f));

const blackBoxFiles = fs
  .readdirSync(path.join(__dirname, 'black-box'))
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(__dirname, 'black-box', f));

const benchmarkingFiles = fs
  .readdirSync(path.join(__dirname, 'benchmarking'))
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(__dirname, 'benchmarking', f));

const allFiles = [...rootFiles, ...blackBoxFiles, ...benchmarkingFiles];

let passed = 0;
let failed = 0;

console.log(`\n🚀 Starting Selenium Suite: Found ${allFiles.length} test(s)...\n`);

for (const file of allFiles) {
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

console.log(`📊 SELENIUM SUITE RESULTS:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}\n`);

if (failed > 0) {
  process.exit(1);
}