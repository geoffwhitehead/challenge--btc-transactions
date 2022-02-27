module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  globalSetup: './test/setup.ts',
  globalTeardown: './test/teardown.ts',
};
