describe('EP-01 | Equivalence Partitioning — Product Sort Dropdown', () => {

  it('Valid sort partition: selecting price low-to-high should display the cheapest product first', () => {

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

    // 7. Assertion: Verify the first price displayed is the lowest known price
    cy.get('.inventory_item_price').first().should('have.text', '$7.99');

    // 8. Assertion: Verify the last price displayed is the highest known price
    cy.get('.inventory_item_price').last().should('have.text', '$49.99');

  });

});