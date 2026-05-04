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
    const sortDropdown = await driver.findElement(By.css('[data-test="product-sort-container"]'));
    await sortDropdown.findElement(By.css('option[value="lohi"]')).click();

    // 8. Wait briefly for the DOM to reflect the updated sort order
    await driver.sleep(300);

    // 9. Retrieve all product price elements from the reordered inventory list
    const priceElements = await driver.findElements(By.css('.inventory_item_price'));
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const text = await el.getText();
        return parseFloat(text.replace('$', ''));
      })
    );

    // 10. Assertion: Verify the prices are displayed in ascending order
    const sorted = [...prices].sort((a, b) => a - b);
    const isPassed = JSON.stringify(prices) === JSON.stringify(sorted);

    if (isPassed) {
      console.log('✅ TEST PASSED: Products are sorted by price low to high');
    } else {
      console.log('❌ TEST FAILED: Products are not in the correct sort order');
      console.log(`   Expected: [${sorted.join(', ')}]`);
      console.log(`   Received: [${prices.join(', ')}]`);
    }

    // 11. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 12. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

ep01EquivalencePartitioningSortDropdown();