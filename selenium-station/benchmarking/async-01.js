const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function async01AsyncWaitBehaviourProductNavigation() {

  const startTime = Date.now();

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-background-networking');
  options.addArguments('--disable-sync');
  options.addArguments('--disable-features=AutofillServerCommunication,AutofillEnableAccountStorageForAddresses');

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

    // 7. Capture the name of the first product before navigating into it
    const productName = await driver.findElement(
      By.css('.inventory_item_name')
    ).getText();

    // 8. Click the product using JavaScript injection to navigate to its detail page
    const productLink = await driver.findElement(By.css('.inventory_item_name'));
    await driver.executeScript('arguments[0].click();', productLink);

    // 9. Wait for the product detail page to load
    await driver.wait(
      until.elementLocated(By.css('.inventory_details_name')), 10000
    );

    // 10. Assertion: Verify the detail page shows the correct product name
    const detailName = await driver.findElement(
      By.css('.inventory_details_name')
    ).getText();

    if (detailName.includes(productName)) {
      console.log('✅ TEST PASSED: Product name is consistent across navigation');
    } else {
      console.log('❌ TEST FAILED: Product name on detail page does not match');
      console.log(`   Expected to contain: ${productName}`);
      console.log(`   Received: ${detailName}`);
      throw new Error('Assertion failed — product name mismatch');
    }

    // 11. Add the product to the cart using JavaScript injection
    const addToCartBtn = await driver.wait(
      until.elementLocated(By.css('[data-test^="add-to-cart"]')), 5000
    );
    await driver.wait(until.elementIsVisible(addToCartBtn), 5000);
    await driver.executeScript('arguments[0].click();', addToCartBtn);

    // 12. Assertion: Verify the cart badge updated correctly
    await driver.wait(
      until.elementLocated(By.css('.shopping_cart_badge')), 5000
    );
    const badgeText = await driver.findElement(
      By.css('.shopping_cart_badge')
    ).getText();

    if (badgeText === '1') {
      console.log('✅ TEST PASSED: Cart badge updated correctly on detail page');
    } else {
      console.log('❌ TEST FAILED: Cart badge did not update after adding item');
      console.log(`   Expected: 1`);
      console.log(`   Received: ${badgeText}`);
      throw new Error(`Assertion failed — cart badge expected '1' but received '${badgeText}'`);
    }

    // 13. Navigate back to the inventory page using JavaScript injection
    const backBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="back-to-products"]')), 5000
    );
    await driver.executeScript('arguments[0].click();', backBtn);

    // 14. Wait for the inventory list to reload
    await driver.wait(
      until.elementLocated(By.css('.inventory_list')), 10000
    );

    // 15. Assertion: Verify the cart state persisted across navigation
    const persistedBadge = await driver.findElement(
      By.css('.shopping_cart_badge')
    ).getText();

    if (persistedBadge === '1') {
      console.log('✅ TEST PASSED: Cart state persisted across navigation — S1 confirmed');
    } else {
      console.log('❌ TEST FAILED: Cart badge did not persist after navigation');
      console.log(`   Expected: 1`);
      console.log(`   Received: ${persistedBadge}`);
      throw new Error(`Assertion failed — cart badge expected '1' after navigation but received '${persistedBadge}'`);
    }

    // 16. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 17. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

async01AsyncWaitBehaviourProductNavigation();