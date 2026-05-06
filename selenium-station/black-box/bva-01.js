const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function bva01BoundaryValueAnalysisCartItemCount() {

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

    // 7. Click each Add to Cart button and confirm each click registered
    // before moving to the next — synchronises with React state updates
    const addToCartSelectors = [
      '[data-test="add-to-cart-sauce-labs-backpack"]',
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
      '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
      '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
      '[data-test="add-to-cart-sauce-labs-onesie"]',
      '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'
    ];

    for (let i = 0; i < addToCartSelectors.length; i++) {
      const button = await driver.wait(
        until.elementLocated(By.css(addToCartSelectors[i])), 5000
      );
      await driver.wait(until.elementIsVisible(button), 5000);
      await button.click();

      // Retry loop — wait for badge to confirm this click registered
      const expectedCount = String(i + 1);
      let confirmed = false;
      let attempts = 0;
      while (!confirmed && attempts < 20) {
        await driver.sleep(500);
        const badges = await driver.findElements(By.css('.shopping_cart_badge'));
        if (badges.length > 0) {
          const text = await badges[0].getText();
          if (text === expectedCount) confirmed = true;
        }
        attempts++;
      }
      if (!confirmed) {
        throw new Error(`Click ${i + 1} not registered — badge did not reach ${expectedCount}`);
      }
    }

    // 8. All six clicks confirmed — assert final count
    console.log('✅ TEST PASSED: Cart badge correctly displays the maximum count of 6');

    // 9. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    // 10. Always close the browser when done, even if the test fails
    await driver.quit();
  }

}

bva01BoundaryValueAnalysisCartItemCount();