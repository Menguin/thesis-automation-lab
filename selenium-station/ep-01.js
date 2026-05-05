const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function ep01EquivalencePartitioningSortDropdown() {

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

    // 7. Locate the sort dropdown and select the 'Price (low to high)' option
    const sortDropdown = await driver.findElement(
      By.css('[data-test="product-sort-container"]')
    );
    await sortDropdown.findElement(By.css('option[value="lohi"]')).click();

    // 8. Wait briefly for the page to reflect the updated sort order
    await driver.sleep(300);

    // 9. Retrieve the first and last price elements from the sorted list
    const priceElements = await driver.findElements(By.css('.inventory_item_price'));
    const firstPrice = await priceElements[0].getText();
    const lastPrice = await priceElements[priceElements.length - 1].getText();

    // 10. Assertion: Verify the first price is the lowest known price
    if (firstPrice === '$7.99') {
      console.log('✅ TEST PASSED: First product is the cheapest — sort low to high is correct');
    } else {
      console.log('❌ TEST FAILED: First product price is not the expected lowest price');
      console.log(`   Expected: $7.99`);
      console.log(`   Received: ${firstPrice}`);
      throw new Error(`Assertion failed — first price expected '$7.99' but received '${firstPrice}'`);
    }

    // 11. Assertion: Verify the last price is the highest known price
    if (lastPrice === '$49.99') {
      console.log('✅ TEST PASSED: Last product is the most expensive — sort order confirmed');
    } else {
      console.log('❌ TEST FAILED: Last product price is not the expected highest price');
      console.log(`   Expected: $49.99`);
      console.log(`   Received: ${lastPrice}`);
      throw new Error(`Assertion failed — last price expected '$49.99' but received '${lastPrice}'`);
    }

    // 12. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 13. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

ep01EquivalencePartitioningSortDropdown();