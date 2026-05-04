const fs = require('fs');
const { execSync } = require('child_process');

// 1. Find all .js files in this folder, excluding this runner itself
const files = fs
  .readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && f !== 'runner.js');

let passed = 0;
let failed = 0;

console.log(`\n🚀 Starting Selenium Suite: Found ${files.length} test(s)...\n`);

// 2. Loop through and execute each test file individually
for (const file of files) {
  console.log(`▶️  Running: ${file}...`);
  try {
    execSync(`node ${__dirname}/${file}`, { stdio: 'inherit' });
    passed++;
  } catch (error) {
    // Catch the error so the runner does not crash — remaining tests still execute
    console.error(`\n❌ FAILED: ${file}`);
    failed++;
  }
  console.log('-----------------------------------\n');
}

// 3. Print the final suite summary
console.log(`📊 SELENIUM SUITE RESULTS:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}\n`);

// 4. Exit with code 1 if any tests failed — tells GitHub Actions to mark the job as failed
if (failed > 0) {
  process.exit(1);
}