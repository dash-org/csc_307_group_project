// jest-unit-testing/jest.config.cjs
module.exports = {
  // Make "packages" the root so Jest can see both jest-unit-testing and express-backend
  rootDir: '..',

  // Only look for tests inside jest-unit-testing
  roots: ['<rootDir>/jest-unit-testing'],

  testEnvironment: 'node',
  transform: {},

  // Only run the backend model tests you care about
  testMatch: [
    '<rootDir>/jest-unit-testing/express-backend-testing/inventory.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/kitchen.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/membership.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/user.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/inventory-services.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/item-services.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/member-services.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/kitchen-services.test.js',
    '<rootDir>/jest-unit-testing/express-backend-testing/user-services.test.js',

    // later you can add more model tests here
  ],

  // Turn coverage ON and tell Jest which source files to measure
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/express-backend/schemas/**/*.js',
    '<rootDir>/express-backend/services/**/*.js',
  ],

  // Keep coverage output inside jest-unit-testing
  coverageDirectory: '<rootDir>/jest-unit-testing/coverage',
};
