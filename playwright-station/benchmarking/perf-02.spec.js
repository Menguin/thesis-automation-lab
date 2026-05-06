const { test, expect } = require('@playwright/test');

test('PERF-02 | Network Observability — Inventory page network response should resolve within threshold', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Click login and capture the inventory page response via CDP
  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().includes('inventory')),
    page.locator('#login-button').click()
  ]);

  // 5. Retrieve CDP-level network timing data
  const timing = response.request().timing();
  const networkDuration = timing.responseEnd - timing.requestStart;
  console.log(`Inventory network response time: ${networkDuration.toFixed(2)}ms`);

  // 6. Assertion: Network response must be within the defined threshold
  expect(networkDuration).toBeLessThan(2000);

});