const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function uc01UseCaseCompletePurchaseJourney() {

  const startTime = Date.now();

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-background-networking');
  options.addArguments('--disable-sync');
  options.addArguments('--disable-features=AutofillServerCommunication,AutofillEnableAccountStorageForAddresses');
  options.addArguments('--incognito');

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
    await driver.executeScript('arguments[0].click();', addButtons[0]);

    // 8. Navigate to the shopping cart with retry
    let onCartPage = false;
    let cartAttempts = 0;
    while (!onCartPage && cartAttempts < 10) {
      const cartLink = await driver.wait(
        until.elementLocated(By.css('.shopping_cart_link')), 5000
      );
      await driver.executeScript('arguments[0].click();', cartLink);
      await driver.sleep(500);
      const url = await driver.getCurrentUrl();
      if (url.includes('cart.html')) onCartPage = true;
      cartAttempts++;
    }
    if (!onCartPage) throw new Error('Failed to navigate to cart page');

    // 9. Wait for checkout button and click using JavaScript injection
    const checkoutBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="checkout"]')), 20000
    );
    await driver.wait(until.elementIsVisible(checkoutBtn), 10000);
    await driver.executeScript('arguments[0].click();', checkoutBtn);

    // 10. Wait for checkout form to load
    await driver.wait(
      until.elementLocated(By.css('[data-test="firstName"]')), 20000
    );

    // 11. Fill in the checkout form with valid details
    await driver.findElement(By.css('[data-test="firstName"]')).sendKeys('Jane');
    await driver.findElement(By.css('[data-test="lastName"]')).sendKeys('Smith');
    await driver.findElement(By.css('[data-test="postalCode"]')).sendKeys('12345');

    // 12. Click Continue to reach the order summary
    const continueBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="continue"]')), 10000
    );
    await driver.wait(until.elementIsVisible(continueBtn), 5000);
    await driver.executeScript('arguments[0].click();', continueBtn);

    // 13. Wait for order summary and click Finish
    const finishBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="finish"]')), 20000
    );
    await driver.wait(until.elementIsVisible(finishBtn), 10000);
    await driver.executeScript('arguments[0].click();', finishBtn);

    // 14. Wait for the order confirmation page
    await driver.wait(
      until.elementLocated(By.css('[data-test="complete-header"]')), 20000
    );
    const confirmationText = await driver.findElement(
      By.css('[data-test="complete-header"]')
    ).getText();

    // 15. Assertion: Verify the order confirmation message
    if (confirmationText.includes('Thank you for your order')) {
      console.log('✅ TEST PASSED: Order confirmed — full purchase journey completed successfully');
    } else {
      console.log('❌ TEST FAILED: Order confirmation message was not displayed');
      console.log(`   Received: ${confirmationText}`);
      throw new Error('Assertion failed — order confirmation not found');
    }

    // 16. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    await driver.quit();
  }

}

uc01UseCaseCompletePurchaseJourney();