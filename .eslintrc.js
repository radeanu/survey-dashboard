module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended'
  ],

  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  plugins: ['prettier'],

  rules: {
    'no-debugger': 'off',
    'vue/max-len': ['warn', { code: 200 }],
    'no-console':
      process.env.NODE_ENV !== 'development'
        ? ['warn', { allow: ['error'] }]
        : 'off',
    'vue/component-name-in-template-casing': 'error',
    'no-unused-vars': 'warn',
    'vue/valid-v-html': 'warn',
    'vue/attributes-order': 'warn',
    'vue/no-confusing-v-for-v-if': 'warn',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'warn',
    'vue/this-in-template': 'error',
    'vue/array-bracket-spacing': 'warn',
    'vue/arrow-spacing': 'warn',
    'vue/block-spacing': 'warn',
    'vue/brace-style': 'warn',
    'vue/camelcase': [
      'error',
      {
        ignoreDestructuring: true
      }
    ],
    'vue/comma-dangle': 'warn',
    'vue/component-definition-name-casing': 'warn',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'warn',
    'vue/keyword-spacing': 'warn',
    'vue/match-component-file-name': 'error',
    'vue/no-deprecated-scope-attribute': 'warn',
    'vue/no-deprecated-slot-attribute': 'warn',
    'vue/no-deprecated-slot-scope-attribute': 'warn',
    'vue/no-empty-pattern': 'warn',
    'vue/no-irregular-whitespace': 'warn',
    'vue/no-reserved-component-names': 'warn',
    'vue/no-restricted-syntax': 'warn',
    'vue/no-static-inline-styles': 'warn',
    'vue/no-unsupported-features': 'warn',
    'vue/object-curly-spacing': 'warn',
    'vue/padding-line-between-blocks': 'warn',
    'vue/script-indent': 'warn',
    'vue/space-infix-ops': 'warn',
    'vue/space-unary-ops': 'warn',
    'vue/v-on-function-call': 'warn',
    'vue/valid-v-bind-sync': 'warn',
    'vue/valid-v-slot': 'warn',
    'vue/html-closing-bracket-newline': 'warn',
    'vue/html-closing-bracket-spacing': 'warn',
    'vue/html-end-tags': 'warn',
    'vue/html-indent': 'warn',
    'vue/object-curly-spacing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ]
  },

  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended'
  ]
};
