/* eslint-disable-next-line no-undef */
module.exports = {
  extends: ['eslint:recommended', 'plugin:compat/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['prettier', 'import'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'consistent-this': ['error', 'no-reassign'],
    'eol-last': 'error',
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'generator-star-spacing': 'error',
    'guard-for-in': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/first': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/no-duplicates': 'error',
    'import/order': ['error', { alphabetize: { order: 'asc' }, 'newlines-between': 'never' }],
    'new-cap': ['error', { properties: false, capIsNew: false }],
    'new-parens': 'error',
    'no-alert': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-continue': 'error',
    'no-duplicate-imports': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-nested-ternary': 'error',
    'no-new-func': 'error',
    'no-new': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-restricted-syntax': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'no-use-before-define': 'off',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'object-shorthand': 'error',
    'operator-assignment': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'prettier/prettier': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true }],
    radix: 'error',
    'rest-spread-spacing': 'error',
    'unicode-bom': 'error',
    'template-curly-spacing': 'error',
    'wrap-iife': ['error', 'inside'],
    'yield-star-spacing': 'error',
  },
  globals: {
    document: 'readonly',
    window: 'readonly',
    Enemy: 'readonly',
    Player: 'readonly',
    Item: 'readonly',
    drawSprite: 'readonly',
    setupCanvas: 'readonly',
    RULES: 'readonly',
    SPRITE: 'readonly',
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    polyfills: ['Array.from', 'Promise'],
    'import/resolver': {
      node: {
        paths: ['app/javascript'],
        extensions: ['.js'],
      },
    },
  },
  ignorePatterns: ['node_modules/'],
};
