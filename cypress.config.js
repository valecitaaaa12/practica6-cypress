const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    retries: { runMode: 0, openMode: 0 },
    viewportWidth: 1366,
    viewportHeight: 900,
  },
});
