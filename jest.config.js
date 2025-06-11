module.exports = {
  // Ambiente de teste
  testEnvironment: "node",

  // Diretórios de teste
  testMatch: ["**/tests/**/*.test.js", "**/__tests__/**/*.test.js"],

  // Arquivos de configuração
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // Cobertura de código
  collectCoverage: true,
  collectCoverageFrom: [
    "models/**/*.js",
    "controllers/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/coverage/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Limpar mocks automaticamente
  clearMocks: true,
  restoreMocks: true,

  // Timeout para testes
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Ignorar arquivos
  testPathIgnorePatterns: ["/node_modules/", "/coverage/"],
};
