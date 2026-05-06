const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function perf01PerformanceInventoryPageLoad() {

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  // 1. Launch a headless Chrome instance
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {

    // 2. Navigate to the target web application
    await driver.get('https://www.saucedemo.com/');

    // 3. Locate the username input field and fill it with valid credentials
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');

    // 4. Locate the password input field and fill it
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');

    // 5. Record the start time immediately before clicking login
    const startTime = Date.now();

    // 6. Locate and click the login submission button
    await driver.findElement(By.id('login-button')).click();

    // 7. Wait for the inventory list to confirm the page loaded
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);

    // 8. Record the end time once inventory is visible
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`⏱️ Login-to-inventory duration: ${duration}ms`);

    // 9. Assertion: Duration must be within the defined threshold
    if (duration < 3000) {
      console.log('✅ TEST PASSED: Inventory page loaded within the 3000ms threshold');
    } else {
      console.log('❌ TEST FAILED: Inventory page load exceeded the 3000ms threshold');
      console.log(`   Expected: < 3000ms`);
      console.log(`   Received: ${duration}ms`);
      throw new Error(`Assertion failed — load time ${duration}ms exceeded threshold`);
    }

    console.log(`⏱️ Execution Time: ${duration / 1000}s`);

  } finally {
    await driver.quit();
  }

}

perf01PerformanceInventoryPageLoad();