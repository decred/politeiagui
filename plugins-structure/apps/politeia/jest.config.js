module.exports = {
  transform: {
    "\\.js$": ["babel-jest", { cwd: __dirname }]
  },
  setupFilesAfterEnv: ["jest-extended/all", "./src/setupTests.js"]
};
