const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function bva01BoundaryValueAnalysisCartItemCount() {

  const startTime = Date.now();

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  // Disable Chrome background services that interfere with test execution
  options.addArguments('--disable-background-networking');
  options.addArguments('--disable-sync');
  options.addArguments('--disable-features=AutofillServerCommunication,AutofillEnableAccountStorageForAddresses');
  // ADD THIS LINE to fix the sticky header interception:
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

    // 7. Click each Add to Cart button using its unique data-test selector
    const addToCartSelectors = [
      '[data-test="add-to-cart-sauce-labs-backpack"]',
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
      '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
      '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
      '[data-test="add-to-cart-sauce-labs-onesie"]',
      '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'
    ];

    for (const selector of addToCartSelectors) {
      // Wait for it to exist in the DOM
      const button = await driver.wait(until.elementLocated(By.css(selector)), 5000);
      
      // Wait for it to be visible on screen
      await driver.wait(until.elementIsVisible(button), 5000);
      
      // Click it instantly — NO SLEEP!
      await button.click();
    }

    // 8. Explicitly poll the cart badge until it reaches the boundary value of '6'
    await driver.wait(async () => {
      const badge = await driver.findElements(By.css('.shopping_cart_badge'));
      if (badge.length === 0) return false; // Badge doesn't exist yet
      const text = await badge[0].getText();
      return text === '6';
    }, 5000, "Cart badge did not reach 6 in time");

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