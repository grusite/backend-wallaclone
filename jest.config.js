module.exports = {
  setupTestFrameworkScriptFile: "./test/helpers/setup.js",
  testEnvironment: "node",
  collectCoverageFrom: ["app/**/*.{js}"],
  coverageReporters: ["html"]
};
