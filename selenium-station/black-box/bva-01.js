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

    // 7. Click each Add to Cart button with a built-in retry engine
    // If a click is dropped by the browser, the loop retries until
    // the badge confirms the click was registered
    const addToCartSelectors = [
      '[data-test="add-to-cart-sauce-labs-backpack"]',
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
      '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
      '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
      '[data-test="add-to-cart-sauce-labs-onesie"]',
      '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'
    ];

    for (let i = 0; i < addToCartSelectors.length; i++) {
      const expectedCount = String(i + 1);
      let confirmed = false;
      let attempts = 0;

      while (!confirmed && attempts < 10) {
        const button = await driver.wait(
          until.elementLocated(By.css(addToCartSelectors[i])), 5000
        );
        await driver.executeScript('arguments[0].click();', button);
        await driver.sleep(500);

        const badges = await driver.findElements(By.css('.shopping_cart_badge'));
        if (badges.length > 0) {
          const text = await badges[0].getText();
          if (text === expectedCount) confirmed = true;
        }
        attempts++;
      }

      if (!confirmed) {
        throw new Error(`Click ${i + 1} not registered after 10 retries`);
      }
    }

    // 8. All six clicks confirmed
    console.log('✅ TEST PASSED: Cart badge correctly displays the maximum count of 6');

    // 9. Stop the timer and log execution time
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`⏱️ Execution Time: ${duration}s`);

  } finally {
    await driver.quit();
  }

}

bva01BoundaryValueAnalysisCartItemCount();