describe('UC-01 | Use Case Testing — Complete Purchase Journey', () => {

  it('Primary flow: user completes a full purchase from login to order confirmation', () => {

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

    // 6. Add the first available product to the cart
    cy.get('.btn_inventory').first().click();

    // 7. Navigate to the shopping cart
    cy.get('.shopping_cart_link').click();

    // 8. Locate and click the Checkout button
    cy.get('[data-test="checkout"]').click();

    // 9. Fill in the checkout form with valid details
    cy.get('[data-test="firstName"]').type('Jane');
    cy.get('[data-test="lastName"]').type('Smith');
    cy.get('[data-test="postalCode"]').type('12345');

    // 10. Click Continue to reach the order summary
    cy.get('[data-test="continue"]').click();

    // 11. Click Finish to complete the purchase
    cy.get('[data-test="finish"]').click();

    // 12. Assertion: Verify the order confirmation page is displayed
    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('contain', 'Thank you for your order');

  });

});