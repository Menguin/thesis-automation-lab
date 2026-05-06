describe('ASYNC-01 | Async/Wait Behaviour — Product Detail Navigation', () => {

  it('App should reflect correct product details and cart state across navigation', () => {

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

    // 6. Capture the name of the first product before navigating into it
    cy.get('.inventory_item_name').first().invoke('text').then((productName) => {

      // 7. Click the product to navigate to its detail page
      cy.get('.inventory_item_name').first().click();

      // 8. Assertion: Verify the detail page shows the correct product
      cy.get('.inventory_details_name')
        .should('be.visible')
        .and('contain', productName.trim());

      // 9. Add the product to the cart from the detail page
      cy.get('[data-test^="add-to-cart"]').click();

      // 10. Assertion: Verify the cart badge updated without a full page reload
      cy.get('.shopping_cart_badge').should('have.text', '1');

      // 11. Navigate back to the inventory page
      cy.get('[data-test="back-to-products"]').click();

      // 12. Assertion: Verify the inventory list is visible again
      cy.get('.inventory_list').should('be.visible');

      // 13. Assertion: Verify the cart state persisted across navigation
      cy.get('.shopping_cart_badge').should('have.text', '1');

    });

  });

});