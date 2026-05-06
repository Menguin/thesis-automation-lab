describe('DT-R2 | Decision Table — Checkout Form Submission', () => {

  it('First name and last name provided, postcode missing should display a postcode error', () => {

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

    // 9. Locate the First Name field and fill it with a valid value
    cy.get('[data-test="firstName"]').type('Jane');

    // 10. Locate the Last Name field and fill it with a valid value
    cy.get('[data-test="lastName"]').type('Smith');

    // 11. Leave the Postcode field intentionally empty — this is the condition under test
    // 12. Locate and click the Continue button
    cy.get('[data-test="continue"]').click();

    // 13. Assertion: Verify the error message is visible
    cy.get('[data-test="error"]').should('be.visible');

    // 14. Assertion: Verify the error message contains the expected postcode error
    cy.get('[data-test="error"]').should('contain', 'Postal Code is required');

    // 15. Assertion: Verify the user has not advanced past the checkout information page
    cy.url().should('not.include', 'step-two');

  });

});