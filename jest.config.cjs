module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ["js"],

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/**",
    "!src/routes/**",
    "!src/models/**",
    "!src/middleware/**",
    "!src/app.js"
  ]
};