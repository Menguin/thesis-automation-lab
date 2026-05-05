const { test, expect } = require('@playwright/test');

test('EP-01 | Equivalence Partitioning — Valid sort partition: selecting price low-to-high should reorder the product list', async ({ page }) => {

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

  // 6. Locate the sort dropdown and select the 'Price (low to high)' option
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  // 7. Assertion: Retrieve all product prices and verify they are in ascending order
  const prices = await page.locator('.inventory_item_price').evaluateAll(
    (els) => els.map(el => parseFloat(el.innerText.replace('$', '')))
  );
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);

});