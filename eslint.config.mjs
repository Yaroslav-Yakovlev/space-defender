import globals from 'globals'
import pluginJs from '@eslint/js'
import jest from 'eslint-plugin-jest'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.vscode/',
      '.idea/',
      '*.log',
      'coverage/',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly'
      }
    }
  },
  {
    files: ['*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      }
    },
    plugins: {
      jest
    },
    env: {
      jest: true,
      node: true
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  },
  pluginJs.configs.recommended
]
