module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "extends": ["eslint:recommended", "standard-preact"],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
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
    ]
  },
  "globals": {
    "Uint8Array": true
  }
};
