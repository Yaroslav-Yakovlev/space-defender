export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  'moduleNameMapper': {
    '^pixi\\.js$': '<rootDir>/node_modules/pixi.js',
    '/^(.+).js$/': '$1'
  }
}
