describe('BVA-01 | Boundary Value Analysis — Shopping Cart Item Count', () => {

  it('Max boundary: adding all available products should reflect the correct cart count', () => {

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

    // 6. Click every Add to Cart button on the page in a single command
    cy.get('.btn_inventory').click({ multiple: true });

    // 7. Assertion: Verify the cart badge displays the maximum item count of 6
    cy.get('.shopping_cart_badge').should('have.text', '6');

  });

});