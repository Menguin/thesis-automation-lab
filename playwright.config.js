const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // The base URL of the application under test
  // All page.goto() calls can now use relative paths e.g. page.goto('/')
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
});