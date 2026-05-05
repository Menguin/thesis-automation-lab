const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function dtR1DecisionTableCheckoutFormPostcodeMissing() {

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

    // 7. Add the first available product to the cart
    const addButtons = await driver.findElements(By.css('.btn_inventory'));
    await addButtons[0].click();

    // 8. Navigate to the shopping cart
    await driver.findElement(By.css('.shopping_cart_link')).click();

    // 9. Wait for the cart page to load then click the Checkout button
    await driver.wait(until.elementLocated(By.css('[data-test="checkout"]')), 10000);
    await driver.findElement(By.css('[data-test="checkout"]')).click();

    // 10. Wait for the checkout form to load
    await driver.wait(until.elementLocated(By.css('[data-test="firstName"]')), 10000);

    // 11. Locate the First Name field and fill it with a valid value
    await driver.findElement(By.css('[data-test="firstName"]')).sendKeys('Jane');

    // 12. Locate the Last Name field and fill it with a valid value
    await driver.findElement(By.css('[data-test="lastName"]')).sendKeys('Smith');

    // 13. Leave the Postcode field intentionally empty — this is the condition under test
    // 14. Locate and click the Continue button
    await driver.findElement(By.css('[data-test="continue"]')).click();

    // 15. Wait for the error message to appear
    await driver.wait(until.elementLocated(By.css('[data-test="error"]')), 10000);

    // 16. Retrieve the error message text
    const errorText = await driver.findElement(By.css('[data-test="error"]')).getText();

    // 17. Assertion: Verify the error message contains the expected postcode error
    if (errorText.includes('Postal Code is required')) {
      console.log('✅ TEST PASSED: Postcode error message displayed as expected');
    } else {
      console.log('❌ TEST FAILED: Expected postcode error was not displayed');
      console.log(`   Expected to contain: Postal Code is required`);
      console.log(`   Received: ${errorText}`);
      throw new Error('Assertion failed — error message did not contain expected text');
    }

    // 18. Retrieve the current URL
    const currentURL = await driver.getCurrentUrl();

    // 19. Assertion: Verify the user remains on the checkout information page
    if (currentURL === 'https://www.saucedemo.com/checkout-step-one.html') {
      console.log('✅ TEST PASSED: User remains on the checkout information page');
    } else {
      console.log('❌ TEST FAILED: User incorrectly advanced past the checkout information page');
      console.log(`   Expected: https://www.saucedemo.com/checkout-step-one.html`);
      console.log(`   Received: ${currentURL}`);
      throw new Error('Assertion failed — user advanced past the checkout information page');
    }

    // 20. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 21. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

dtR1DecisionTableCheckoutFormPostcodeMissing();