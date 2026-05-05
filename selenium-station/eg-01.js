const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function eg01ErrorGuessingWhitespaceValidation() {

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
    await driver.wait(until.elementLocated(By.css('[data-test="checkout"]')), 5000);
    await driver.findElement(By.css('[data-test="checkout"]')).click();

    // 10. Wait for the checkout form to load
    await driver.wait(until.elementLocated(By.css('[data-test="firstName"]')), 5000);

    // 11. Locate the First Name field and fill it with whitespace only
    await driver.findElement(By.css('[data-test="firstName"]')).sendKeys('   ');

    // 12. Locate the Last Name field and fill it with whitespace only
    await driver.findElement(By.css('[data-test="lastName"]')).sendKeys('   ');

    // 13. Locate the Postcode field and fill it with whitespace only
    await driver.findElement(By.css('[data-test="postalCode"]')).sendKeys('   ');

    // 14. Locate and click the Continue button
    await driver.findElement(By.css('[data-test="continue"]')).click();

    // 15. Wait for the page to respond to the form submission
    await driver.sleep(500);

    // 16. Retrieve the current URL
    const currentURL = await driver.getCurrentUrl();

    // 17. Assertion: Verify the user has not advanced past the checkout information page
    if (currentURL === 'https://www.saucedemo.com/checkout-step-one.html') {
      console.log('✅ TEST PASSED: Whitespace input did not bypass validation — user remains on checkout page');
    } else {
      console.log('❌ TEST FAILED: Whitespace input bypassed validation — user incorrectly advanced');
      console.log(`   Expected: https://www.saucedemo.com/checkout-step-one.html`);
      console.log(`   Received: ${currentURL}`);
      throw new Error('Assertion failed — whitespace input should not allow form progression');
    }

    // 18. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 19. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

eg01ErrorGuessingWhitespaceValidation();