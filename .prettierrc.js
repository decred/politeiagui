module.exports = {
  // Include parentheses around a sole arrow function parameter
  arrowParens: "avoid",

  // Controls the printing of spaces inside object literals
  bracketSpacing: true,

  // Specify the end of line used by prettier
  endOfLine: "auto",

  // Specify the global whitespace sensitivity for HTML files.
  //  Valid options:
  // 'css' - Respect the default value of CSS display property.
  // 'strict' - Whitespaces are considered sensitive.
  // 'ignore' - Whitespaces are considered insensitive.
  htmlWhitespaceSensitivity: "css",

  // If true, puts the `>` of a multi-line jsx element at the end of the last line instead of being alone on the next line
  jsxBracketSameLine: false,

  // Use single quotes instead of double quotes in JSX
  jsxSingleQuote: false,

  // Override the parser. You shouldn't have to change this setting.
  parser: "babylon",

  // Fit code within this line limit
  printWidth: 80,

  // (Markdown) wrap prose over multiple lines
  proseWrap: "preserve",

  // Whether to add a semicolon at the end of every line
  semi: true,

  // If true, will use single instead of double quotes
  singleQuote: false,

  // Number of spaces it should use per tab
  tabWidth: 2,

  // Controls the printing of trailing commas wherever possible.
  //  Valid options:
  //     'none' - No trailing commas
  //     'es5' - Trailing commas where valid in ES5 (objects, arrays, etc)
  //     'all' - Trailing commas wherever possible (function arguments)
  trailingComma: "none",

  // Indent lines with tabs
  useTabs: false
};
