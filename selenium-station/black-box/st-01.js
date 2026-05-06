const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function st01StateTransitionCartEmptyState() {

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

    // 7. Add the first available product to the cart — transition to S2
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

    // 9. Remove the product using its specific data-test selector with JS injection
    // Retry loop — keeps clicking until the badge disappears
    let badgeGone = false;
    let attempts = 0;
    while (!badgeGone && attempts < 10) {
      const removeBtns = await driver.findElements(
        By.css('[data-test="remove-sauce-labs-backpack"]')
      );
      if (removeBtns.length > 0) {
        await driver.executeScript('arguments[0].click();', removeBtns[0]);
      }
      await driver.sleep(500);
      const badges = await driver.findElements(By.css('.shopping_cart_badge'));
      if (badges.length === 0) badgeGone = true;
      attempts++;
    }

    // 10. Assertion: Verify the cart is in the empty state
    if (badgeGone) {
      console.log('✅ TEST PASSED: Cart badge is gone — S1 empty state confirmed');
    } else {
      throw new Error('Assertion failed — cart badge did not disappear after item removal');
    }

    // 11. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    await driver.quit();
  }

}

st01StateTransitionCartEmptyState();