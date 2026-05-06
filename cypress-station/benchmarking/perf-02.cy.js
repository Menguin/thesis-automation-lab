describe('PERF-02 | Network Observability — Inventory Page Response Time', () => {

  it('Inventory page network response should resolve within the defined threshold', () => {

    // 1. Navigate to the target web application using the Base URL
    cy.visit('/');

    // 2. Locate the username input field and fill it with valid credentials
    cy.get('#user-name').type('standard_user');

    // 3. Locate the password input field and fill it
    cy.get('#password').type('secret_sauce');

    // 4. Locate and click the login submission button
    cy.get('#login-button').click();

    // 5. Wait for the inventory list to confirm the page loaded
    cy.get('.inventory_list').should('be.visible');

    // 6. Read network timing from the browser's Performance API
    // saucedemo uses client-side routing — no real HTTP request is made
    // for inventory.html, so cy.intercept cannot capture it.
    // The Navigation Timing API measures the actual network response
    // time for the initial application load instead
    cy.window().then((win) => {
      const navTiming = win.performance.getEntriesByType('navigation')[0];
      const responseTime = navTiming.responseEnd - navTiming.requestStart;
      cy.log(`Network response time: ${responseTime.toFixed(2)}ms`);

      // 7. Assertion: Network response must be within the defined threshold
      expect(responseTime).to.be.lessThan(2000);
    });

  });

});