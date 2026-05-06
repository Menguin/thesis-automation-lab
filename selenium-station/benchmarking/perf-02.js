const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function perf02NetworkObservabilityInventoryResponse() {

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

    // 5. Locate and click the login submission button
    await driver.findElement(By.id('login-button')).click();

    // 6. Wait for the inventory list to confirm the page loaded
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);

    // 7. Retrieve network timing from the browser Performance API
    // Selenium accesses this via JavaScript execution — no native CDP access
    const responseEnd = await driver.executeScript(
      'return window.performance.getEntriesByType("navigation")[0].responseEnd'
    );
    console.log(`Inventory page responseEnd: ${responseEnd.toFixed(2)}ms`);

    // 8. Assertion: Network response must be within the defined threshold
    if (responseEnd < 2000) {
      console.log('✅ TEST PASSED: Inventory page network response within the 2000ms threshold');
    } else {
      console.log('❌ TEST FAILED: Inventory page network response exceeded the 2000ms threshold');
      console.log(`   Expected: < 2000ms`);
      console.log(`   Received: ${responseEnd.toFixed(2)}ms`);
      throw new Error(`Assertion failed — response time ${responseEnd.toFixed(2)}ms exceeded threshold`);
    }

    console.log(`⏱️ Execution Time: ${(responseEnd / 1000).toFixed(3)}s`);

  } finally {
    await driver.quit();
  }

}

perf02NetworkObservabilityInventoryResponse();