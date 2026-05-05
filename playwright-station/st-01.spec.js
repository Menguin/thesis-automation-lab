const { test, expect } = require('@playwright/test');

test('ST-01 | State Transition — Removing the only cart item should return the cart to the empty state', async ({ page }) => {

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

  // 6. Add the first available product to the cart — transition to S2: Cart has items
  await page.locator('.btn_inventory').first().click();

  // 7. Assertion: Verify the cart badge confirms the item was added
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 8. Remove the same product from the cart — transition to S1: Cart is empty
  await page.locator('.btn_inventory').first().click();

  // 9. Assertion: Verify the cart badge no longer exists on the page
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

});