const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'q92r8m',
  e2e: {
    // 1. The Base URL: The default website for all tests
    baseUrl: 'https://www.saucedemo.com',
    
    // 2. Where to find the tests
    specPattern: 'cypress-station/**/*.cy.js',
    
    // 3. Keep the folder clean
    supportFile: false, 

     // 4. Disable insecure environment variable access in browser code
    allowCypressEnv: false,
  },
});