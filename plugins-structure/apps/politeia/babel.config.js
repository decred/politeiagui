module.exports = {
  env: {
    test: {
      plugins: [
        "@babel/plugin-transform-runtime",
        [
          "module-resolver",
          {
            alias: {
              "@politeiagui/core": "../../packages/core/src",
              "@politeiagui/core/client": "../../packages/core/src/client",
            },
          },
        ],
      ],
      presets: ["@babel/preset-react", "@babel/preset-env"],
    },
  },
};
