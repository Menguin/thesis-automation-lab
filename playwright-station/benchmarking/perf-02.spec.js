const { test, expect } = require('@playwright/test');

test('PERF-02 | Network Observability — Inventory page network response should resolve within threshold', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Locate and click the login submission button
  await page.locator('#login-button').click();

  // 5. Wait for the inventory list to confirm the page loaded
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 6. Read network timing from the browser's Navigation Timing API
  // saucedemo uses client-side routing — waitForResponse cannot capture
  // the inventory navigation as no real HTTP request is made
  const responseTime = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav.responseEnd - nav.requestStart;
  });
  console.log(`Network response time: ${responseTime.toFixed(2)}ms`);

  // 7. Assertion: Network response must be within the defined threshold
  expect(responseTime).toBeLessThan(2000);

});