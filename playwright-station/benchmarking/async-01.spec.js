const { test, expect } = require('@playwright/test');

test('ASYNC-01 | Async/Wait Behaviour — App should reflect correct product details and cart state across navigation', async ({ page }) => {

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

  // 6. Capture the name of the first product before navigating into it
  const productName = await page.locator('.inventory_item_name').first().textContent();

  // 7. Click the product to navigate to its detail page
  await page.locator('.inventory_item_name').first().click();

  // 8. Assertion: Verify the detail page shows the correct product
  await expect(page.locator('.inventory_details_name')).toBeVisible();
  await expect(page.locator('.inventory_details_name')).toContainText(productName.trim());

  // 9. Add the product to the cart from the detail page
  await page.locator('[data-test^="add-to-cart"]').click();

  // 10. Assertion: Verify the cart badge updated without a full page reload
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 11. Navigate back to the inventory page
  await page.locator('[data-test="back-to-products"]').click();

  // 12. Assertion: Verify the inventory list is visible again
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 13. Assertion: Verify the cart state persisted across navigation
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

});