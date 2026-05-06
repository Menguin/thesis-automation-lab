const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function uc01UseCaseCompletePurchaseJourney() {

  const startTime = Date.now();

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

    // 6. Wait for the inventory list to confirm successful login
    await driver.wait(until.elementLocated(By.css('.inventory_list')), 10000);

    // 7. Add the first available product to the cart
    const addButtons = await driver.findElements(By.css('.btn_inventory'));
    await addButtons[0].click();

    // 8. Navigate to the shopping cart
    await driver.findElement(By.css('.shopping_cart_link')).click();

    // 9. Wait for the cart page and click Checkout
    await driver.wait(until.elementLocated(By.css('[data-test="checkout"]')), 10000);
    await driver.findElement(By.css('[data-test="checkout"]')).click();

    // 10. Wait for the checkout form and fill in valid details
    await driver.wait(until.elementLocated(By.css('[data-test="firstName"]')), 10000);
    await driver.findElement(By.css('[data-test="firstName"]')).sendKeys('Jane');
    await driver.findElement(By.css('[data-test="lastName"]')).sendKeys('Smith');
    await driver.findElement(By.css('[data-test="postalCode"]')).sendKeys('12345');

    // 11. Click Continue to reach the order summary
    await driver.findElement(By.css('[data-test="continue"]')).click();

    // 12. Click Finish to complete the purchase
    await driver.wait(until.elementLocated(By.css('[data-test="finish"]')), 10000);
    await driver.findElement(By.css('[data-test="finish"]')).click();

    // 13. Wait for and verify the order confirmation page
    await driver.wait(until.elementLocated(By.css('[data-test="complete-header"]')), 10000);
    const confirmationText = await driver.findElement(
      By.css('[data-test="complete-header"]')
    ).getText();

    // 14. Assertion: Verify the order confirmation message
    if (confirmationText.includes('Thank you for your order')) {
      console.log('✅ TEST PASSED: Order confirmed — full purchase journey completed successfully');
    } else {
      console.log('❌ TEST FAILED: Order confirmation message was not displayed');
      console.log(`   Received: ${confirmationText}`);
      throw new Error('Assertion failed — order confirmation not found');
    }

    // 15. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    await driver.quit();
  }

}

uc01UseCaseCompletePurchaseJourney();