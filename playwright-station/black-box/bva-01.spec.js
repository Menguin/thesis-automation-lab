const { test, expect } = require('@playwright/test');

test('BVA-01 | Boundary Value Analysis — Max boundary: adding all available products should reflect the correct cart count', async ({ page }) => {

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

  // 6. Click the Add to Cart button for every product on the inventory page
  const addButtons = page.locator('.btn_inventory');
  const count = await addButtons.count();
  for (let i = 0; i < count; i++) {
    await addButtons.nth(i).click();
  }

  // 7. Assertion: Verify the cart badge displays the maximum item count of 6
  await expect(page.locator('.shopping_cart_badge')).toHaveText('6');

});