const { Builder, By, until } = require('selenium-webdriver');

async function ecommerceLoginFlowValidation() {

  // Start the timer
  const startTime = Date.now();

  // 1. Launch a browser instance (Chrome)
  const driver = await new Builder().forBrowser('chrome').build();

  try {

    // 2. Navigate to the target web application
    await driver.get('https://www.saucedemo.com/');

    // 3. Locate the username input field and fill it with valid credentials
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');

    // 4. Locate the password input field and fill it
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');

    // 5. Locate and click the login submission button
    await driver.findElement(By.id('login-button')).click();

    // 6. Wait for the page to change, then grab the current URL
    await driver.wait(until.urlContains('inventory'), 5000);
    const currentURL = await driver.getCurrentUrl();

    // 7. Assertion: Verify the URL contains 'inventory'
    if (currentURL.includes('inventory')) {
      console.log('✅ TEST PASSED: Login successful, redirected to inventory page');
    } else {
      console.log('❌ TEST FAILED: Login did not redirect correctly');
    }

    // 8. Assertion: Verify the page title
    const title = await driver.getTitle();
    if (title.includes('Swag Labs')) {
      console.log('✅ TEST PASSED: Page title confirms correct application');
    } else {
      console.log('❌ TEST FAILED: Page title does not match');
    }

    // 9. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 10. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

ecommerceLoginFlowValidation();