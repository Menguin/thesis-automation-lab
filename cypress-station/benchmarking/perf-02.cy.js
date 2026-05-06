describe('PERF-02 | Network Observability — Inventory Page Response Time', () => {

  it('Inventory page network response should resolve within the defined threshold', () => {

    let requestStart;
    let requestEnd;

    // 1. Register a network interceptor before navigation begins
    cy.intercept('GET', '**/inventory.html', (req) => {
      requestStart = Date.now();
      req.continue((res) => {
        requestEnd = Date.now();
      });
    }).as('inventoryPage');

    // 2. Navigate to the target web application using the Base URL
    cy.visit('/');

    // 3. Locate the username input field and fill it with valid credentials
    cy.get('#user-name').type('standard_user');

    // 4. Locate the password input field and fill it
    cy.get('#password').type('secret_sauce');

    // 5. Locate and click the login submission button
    cy.get('#login-button').click();

    // 6. Wait for the intercepted request to resolve and assert the duration
    cy.wait('@inventoryPage').then(() => {
      const duration = requestEnd - requestStart;
      cy.log(`Inventory page response time: ${duration}ms`);

      // 7. Assertion: Network response must be within the defined threshold
      expect(duration).to.be.lessThan(2000);
    });

  });

});