module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ]
  };