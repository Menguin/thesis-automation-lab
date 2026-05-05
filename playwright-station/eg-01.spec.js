const { test, expect } = require('@playwright/test');

test('EG-01 | Error Guessing — Whitespace-only input in all fields should not bypass required field validation', async ({ page }) => {

  // 1. Navigate to the target web application using the Base URL
  await page.goto('/');

  // 2. Locate the username input field and fill it with valid credentials
  await page.locator('#user-name').fill('standard_user');

  // 3. Locate the password input field and fill it
  await page.locator('#password').fill('secret_sauce');

  // 4. Locate and click the login submission button
  await page.locator('#login-button').click();

  // 5. Wait for the inventory list to confirm successful login
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 6. Add the first available product to the cart
  await page.locator('.btn_inventory').first().click();

  // 7. Navigate to the shopping cart
  await page.locator('.shopping_cart_link').click();

  // 8. Locate and click the Checkout button
  await page.locator('[data-test="checkout"]').click();

  // 9. Locate the First Name field and fill it with whitespace only
  await page.locator('[data-test="firstName"]').fill('   ');

  // 10. Locate the Last Name field and fill it with whitespace only
  await page.locator('[data-test="lastName"]').fill('   ');

  // 11. Locate the Postcode field and fill it with whitespace only
  await page.locator('[data-test="postalCode"]').fill('   ');

  // 12. Locate and click the Continue button
  await page.locator('[data-test="continue"]').click();

  // 13. Assertion: Verify an error message is visible
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  // 14. Assertion: Verify the user has not advanced past the checkout information page
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

});