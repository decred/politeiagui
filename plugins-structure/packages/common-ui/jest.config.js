module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["jest-extended/all"],
  transform: {
    "^.+\\.(js|jsx)?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  regenerator: true,
};
