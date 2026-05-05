const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function st01StateTransitionCartEmptyState() {

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

    // 7. Add the first available product to the cart — transition to S2: Cart has items
    const addButtons = await driver.findElements(By.css('.btn_inventory'));
    await addButtons[0].click();

    // 8. Retrieve the cart badge and verify it confirms the item was added
    const badge = await driver.findElement(By.css('.shopping_cart_badge'));
    const badgeText = await badge.getText();

    if (badgeText === '1') {
      console.log('✅ TEST PASSED: Cart badge confirms item was added — S2 state reached');
    } else {
      console.log('❌ TEST FAILED: Cart badge did not update after adding item');
      console.log(`   Expected: 1`);
      console.log(`   Received: ${badgeText}`);
      throw new Error('Assertion failed — cart badge did not show 1 after adding item');
    }

    // 9. Remove the same product from the cart — transition to S1: Cart is empty
    const removeButtons = await driver.findElements(By.css('.btn_inventory'));
    await removeButtons[0].click();

    // 10. Wait briefly for the page to update after removal
    await driver.sleep(300);

    // 11. Check whether the cart badge still exists on the page
    const badges = await driver.findElements(By.css('.shopping_cart_badge'));

    // 12. Assertion: Verify the cart badge no longer exists on the page
    if (badges.length === 0) {
      console.log('✅ TEST PASSED: Cart badge is gone — S1 empty state confirmed');
    } else {
      console.log('❌ TEST FAILED: Cart badge is still visible after removing the only item');
      throw new Error('Assertion failed — cart badge should not exist after item removal');
    }

    // 13. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 14. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

st01StateTransitionCartEmptyState();