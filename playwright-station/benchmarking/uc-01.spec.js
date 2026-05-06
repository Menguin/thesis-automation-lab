const { test, expect } = require('@playwright/test');

test('UC-01 | Use Case Testing — Primary flow: user completes a full purchase from login to order confirmation', async ({ page }) => {

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

  // 9. Fill in the checkout form with valid details
  await page.locator('[data-test="firstName"]').fill('Jane');
  await page.locator('[data-test="lastName"]').fill('Smith');
  await page.locator('[data-test="postalCode"]').fill('12345');

  // 10. Click Continue to reach the order summary
  await page.locator('[data-test="continue"]').click();

  // 11. Click Finish to complete the purchase
  await page.locator('[data-test="finish"]').click();

  // 12. Assertion: Verify the order confirmation page is displayed
  await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
  await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order');

});