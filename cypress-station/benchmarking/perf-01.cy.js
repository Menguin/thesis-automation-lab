describe('PERF-01 | Performance — Inventory Page Load After Login', () => {

  it('Inventory page should load within the defined performance threshold', () => {

    // 1. Navigate to the target web application using the Base URL
    cy.visit('/');

    // 2. Locate the username input field and fill it with valid credentials
    cy.get('#user-name').type('standard_user');

    // 3. Locate the password input field and fill it
    cy.get('#password').type('secret_sauce');

    // 4. Mark the start time immediately before clicking login
    cy.window().then((win) => {
      win.performance.mark('login-start');
    });

    // 5. Locate and click the login submission button
    cy.get('#login-button').click();

    // 6. Wait for the inventory list to confirm the page loaded
    cy.get('.inventory_list').should('be.visible');

    // 7. Mark the end time and calculate the duration
    cy.window().then((win) => {
      win.performance.mark('login-end');
      win.performance.measure('login-to-inventory', 'login-start', 'login-end');
      const measure = win.performance.getEntriesByName('login-to-inventory')[0];
      const duration = measure.duration;
      cy.log(`Login-to-inventory duration: ${duration.toFixed(2)}ms`);

      // 8. Assertion: Duration must be within the defined threshold
      expect(duration).to.be.lessThan(3000);
    });

  });

});