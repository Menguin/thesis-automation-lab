const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function dtR2DecisionTableCheckoutFormPostcodeMissing() {

  const startTime = Date.now();

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  // Disable Chrome autofill — without this Chrome fills in the postal code
  // field automatically, causing the form to submit successfully and
  // preventing the validation error from appearing
  options.addArguments('--disable-background-networking');
  options.addArguments('--disable-sync');
  options.addArguments('--disable-features=AutofillServerCommunication,AutofillEnableAccountStorageForAddresses');
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

    // 6. Wait for the inventory list to confirm successful login
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);

    // 7. Add the first available product to the cart
    const addButtons = await driver.findElements(By.css('.btn_inventory'));
    await addButtons[0].click();

    // 8. Navigate to the shopping cart
    await driver.findElement(By.css('.shopping_cart_link')).click();

    // 9. Wait for the checkout button to be located and visible before clicking
    const checkoutBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="checkout"]')), 20000
    );
    await driver.wait(until.elementIsVisible(checkoutBtn), 10000);
    await checkoutBtn.click();

    // 10. Wait for the checkout form to load
    await driver.wait(
      until.elementLocated(By.css('[data-test="firstName"]')), 20000
    );

    // 11. Locate the First Name field and fill it with a valid value
    await driver.findElement(By.css('[data-test="firstName"]')).sendKeys('Jane');

    // 12. Locate the Last Name field and fill it with a valid value
    await driver.findElement(By.css('[data-test="lastName"]')).sendKeys('Smith');

    // 13. Explicitly clear the Postcode field in case Chrome autofilled it
    // Chrome's autofill can populate this field automatically — clearing it
    // ensures the field is genuinely empty for the test condition
    const postalCodeField = await driver.findElement(By.css('[data-test="postalCode"]'));
    await postalCodeField.clear();

    // 14. Wait for the Continue button to be visible then click it
    const continueBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="continue"]')), 10000
    );
    await driver.wait(until.elementIsVisible(continueBtn), 5000);
    await continueBtn.click();

    // 15. Wait for the error message to appear
    await driver.wait(
      until.elementLocated(By.css('[data-test="error"]')), 20000
    );

    // 16. Retrieve the error message text
    const errorText = await driver.findElement(
      By.css('[data-test="error"]')
    ).getText();

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

dtR2DecisionTableCheckoutFormPostcodeMissing();