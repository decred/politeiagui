module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "react"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "extends": [
    "eslint:recommended"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "jsx-quotes": [
      "error",
      "prefer-double"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-trailing-spaces": [
      "error"
    ],
    "no-console": [
      "off"
    ],
    "eol-last": [
      "error",
      "always"
    ],
    "react/jsx-uses-vars":1,
    "react/jsx-uses-react":1,
  },
  "globals": {
    "Uint8Array": true
  }
};
