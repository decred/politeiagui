module.exports = {
  env: {
    test: {
      plugins: [
        "@babel/plugin-transform-runtime",
        [
          "module-resolver",
          {
            alias: {
              "@politeiagui/core": "../core/src",
              "@politeiagui/core/client": "../core/src/client",
            },
          },
        ],
      ],
      presets: ["@babel/preset-env"],
    },
  },
};
