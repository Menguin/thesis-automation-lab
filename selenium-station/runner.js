const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Find all .js files in the root selenium-station folder
const rootFiles = fs
  .readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && f !== 'runner.js')
  .map(f => path.join(__dirname, f));

// 2. Find all .js files in the black-box subfolder
const blackBoxDir = path.join(__dirname, 'black-box');
const blackBoxFiles = fs
  .readdirSync(blackBoxDir)
  .filter(f => f.endsWith('.js'))
  .map(f => path.join(blackBoxDir, f));

// 3. Combine both lists into one suite
const allFiles = [...rootFiles, ...blackBoxFiles];

let passed = 0;
let failed = 0;

console.log(`\n🚀 Starting Selenium Suite: Found ${allFiles.length} test(s)...\n`);

// 4. Loop through and execute each test file individually
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

// 5. Print the final suite summary
console.log(`📊 SELENIUM SUITE RESULTS:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}\n`);

// 6. Exit with code 1 if any tests failed
if (failed > 0) {
  process.exit(1);
}