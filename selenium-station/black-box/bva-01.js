const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function bva01BoundaryValueAnalysisCartItemCount() {

  // Start the timer
  const startTime = Date.now();

  // Configure Chrome to run headless (required for CI environments with no display)
  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

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

    // 6. Wait for the inventory list to confirm successful login
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 5000);

    // 7. Locate all Add to Cart buttons and click each one individually
const addButtons = await driver.findElements(By.css('.btn_inventory'));
for (const button of addButtons) {
  await button.click();
  await driver.sleep(500);
}

    // 8. Retrieve the cart badge element and read its displayed text
    const badge = await driver.findElement(By.css('.shopping_cart_badge'));
    const badgeText = await badge.getText();

    // 9. Assertion: Verify the cart badge displays the maximum item count of 6
    if (badgeText === '6') {
      console.log('✅ TEST PASSED: Cart badge correctly displays the maximum count of 6');
    } else {
      console.log('❌ TEST FAILED: Cart badge does not reflect the correct item count');
      console.log(`   Expected: 6`);
      console.log(`   Received: ${badgeText}`);
      throw new Error(`Assertion failed — cart badge expected '6' but received '${badgeText}'`);
    }

    // 10. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 11. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

bva01BoundaryValueAnalysisCartItemCount();