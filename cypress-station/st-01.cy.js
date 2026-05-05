describe('ST-01 | State Transition — Shopping Cart', () => {

  it('Removing the only cart item should return the cart to the empty state', () => {

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

    // 6. Add the first available product to the cart — transition to S2: Cart has items
    cy.get('.btn_inventory').first().click();

    // 7. Assertion: Verify the cart badge confirms the item was added
    cy.get('.shopping_cart_badge').should('have.text', '1');

    // 8. Remove the same product from the cart — transition to S1: Cart is empty
    cy.get('.btn_inventory').first().click();

    // 9. Assertion: Verify the cart badge no longer exists on the page
    cy.get('.shopping_cart_badge').should('not.exist');

  });

});