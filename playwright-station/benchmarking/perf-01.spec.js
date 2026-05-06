const { test, expect } = require('@playwright/test');

test('PERF-01 | Performance — Inventory page should load within the defined performance threshold', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Click login and capture the inventory page response simultaneously
  // Playwright accesses response timing natively via CDP
  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().includes('inventory')),
    page.locator('#login-button').click()
  ]);

  // 5. Wait for the inventory list to confirm the page loaded
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 6. Retrieve response timing data from CDP
  const timing = response.request().timing();
  const duration = timing.responseEnd;
  console.log(`Login-to-inventory responseEnd: ${duration.toFixed(2)}ms`);

  // 7. Assertion: Duration must be within the defined threshold
  expect(duration).toBeLessThan(3000);

});