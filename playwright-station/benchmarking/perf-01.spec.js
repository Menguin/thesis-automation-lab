const { test, expect } = require('@playwright/test');

test('PERF-01 | Performance — Inventory page should load within the defined performance threshold', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Record the start time immediately before clicking login
  const startTime = Date.now();

  // 5. Locate and click the login submission button
  await page.locator('#login-button').click();

  // 6. Wait for the inventory list to confirm the page loaded
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 7. Record the end time and calculate duration
  const duration = Date.now() - startTime;
  console.log(`Login-to-inventory duration: ${duration}ms`);

  // 8. Assertion: Duration must be within the defined threshold
  expect(duration).toBeLessThan(3000);

});