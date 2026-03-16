describe('E-commerce Login Flow Validation', () => {

  it('should log in successfully with valid credentials', () => {

    // 1. Navigate to the target web application using the Base URL
    cy.visit('/');

    // 2. Locate the username input field and fill it with valid credentials
    cy.get('#user-name').type('standard_user');

    // 3. Locate the password input field and fill it
    cy.get('#password').type('secret_sauce');

    // 4. Locate and click the login submission button
    cy.get('#login-button').click();

    // 5. Assertion: Verify the URL contains 'inventory'
    cy.url().should('include', 'inventory');

    // 6. Assertion: Verify the page title confirms correct application
    cy.title().should('include', 'Swag Labs');

  });

});