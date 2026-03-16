const { test, expect } = require('@playwright/test');

test('E-commerce Login Flow Validation', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Locate and click the login submission button
  await page.locator('#login-button').click();

  // 5. Assertion: Verify the login was successful by confirming the URL changed to the inventory page
  await expect(page).toHaveURL(/.*inventory/);

  // 6. Assertion: Verify the page title confirms we are on the correct application
  await expect(page).toHaveTitle(/Swag Labs/);

});