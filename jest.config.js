module.exports = {
  verbose: true,
  collectCoverage: true,
  testMatch: ['**/*.spec.js'],
  testURL: "http://localhost/",
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: [
    "js",
    "json",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    'vuetify/lib(.*)': '<rootDir>/node_modules/vuetify/es5$1',
    'vuetify/(.*)': '<rootDir>/node_modules/vuetify/es5$1',
    'vuetify/': '<rootDir>/node_modules/vuetify/es5$1',
    '^~shared/(.*)$': '<rootDir>/src/shared/$1',
    '^~shared': '<rootDir>/src/shared/',
    '^~components/(.*)$': '<rootDir>/src/components/$1',
    '^~components': '<rootDir>/src/components/',
    '^~views/(.*)$': '<rootDir>/src/views/$1',
    '^~views': '<rootDir>/src/views/',
    '^~widgets/(.*)$': '<rootDir>/src/components/widgets/$1',
    '^~widgets': '<rootDir>/src/components/widgets/',
    '^~services/(.*)$': '<rootDir>/src/services/$1',
    '^~services': '<rootDir>/src/services/',
  },
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules/(?!vue-router|@babel|vuetify)'],
  coverageThreshold: {
    global: { statements: 80 },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
  ],
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./tests/",
      "filename": "report.html",
      "expand": true
    }]
  ],
}
