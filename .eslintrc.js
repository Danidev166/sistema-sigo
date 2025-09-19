module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General rules - más permisivo
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'no-undef': 'off', // Desactivado para evitar conflictos con globals
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    // Test files
    {
      files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}', '**/test/**/*.{js,jsx,ts,tsx}'],
      env: {
        'vitest-globals/env': true,
      },
      rules: {
        'no-unused-vars': 'off',
      },
    },
    // Cypress files
    {
      files: ['cypress/**/*.{js,jsx,ts,tsx}'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    // Config files
    {
      files: ['*.config.{js,ts}', 'vite.config.{js,ts}', 'vitest.config.{js,ts}'],
      env: {
        node: true,
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    // Scripts
    {
      files: ['scripts/**/*.{js,ts}'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-undef': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'public/',
    '.storybook/',
    'storybook-static/',
  ],
};
