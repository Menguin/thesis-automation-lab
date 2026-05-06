const { test, expect } = require('@playwright/test');

test('DT-R2 | Decision Table — First name and last name provided, postcode missing should display a postcode error', async ({ page }) => {

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

  // 9. Locate the First Name field and fill it with a valid value
  await page.locator('[data-test="firstName"]').fill('Jane');

  // 10. Locate the Last Name field and fill it with a valid value
  await page.locator('[data-test="lastName"]').fill('Smith');

  // 11. Leave the Postcode field intentionally empty — this is the condition under test
  // 12. Locate and click the Continue button
  await page.locator('[data-test="continue"]').click();

  // 13. Assertion: Verify the error message is visible
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  // 14. Assertion: Verify the error message contains the expected postcode error
  await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');

  // 15. Assertion: Verify the user has not advanced past the checkout information page
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

});