module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    es2021: true,
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-invalid-position-at-import-rule': 'off',
    'no-unused-vars': 'off',
    'semi': [2, 'never'],
    "vue/multi-word-component-names": ["off", {
      "ignores": []
    }]

  }
}
