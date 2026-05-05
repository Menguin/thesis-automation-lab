describe('EP-01 | Equivalence Partitioning — Product Sort Dropdown', () => {

  it('Valid sort partition: selecting price low-to-high should reorder the product list', () => {

    // 1. Navigate to the target web application using the Base URL
    cy.visit('/');

    // 2. Locate the username input field and fill it with valid credentials
    cy.get('#user-name').type('standard_user');

    // 3. Locate the password input field and fill it
    cy.get('#password').type('secret_sauce');

    // 4. Locate and click the login submission button
    cy.get('#login-button').click();

    // 5. Wait for the inventory list to confirm successful login
    cy.get('.inventory_list').should('be.visible');

    // 6. Locate the sort dropdown and select the 'Price (low to high)' option
    cy.get('[data-test="product-sort-container"]').select('lohi');

    // 7. Assertion: Retrieve all product prices and verify they are in ascending order
    cy.get('.inventory_item_price').then(($prices) => {
      const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')));
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });

  });

});