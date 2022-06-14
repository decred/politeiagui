const newPluginCmd = jest.requireActual("../lib/cmdnewplugin");
const newAppCmd = jest.requireActual("../lib/cmdnewapp");
const fs = require("fs");

jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(false),
  readFileSync: jest.fn().mockReturnValue("__PORT__"),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  // mock console logs implementation to clean tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
describe("Given the newplugin command", () => {
  it("should create new plugins correctly", () => {
    fs.existsSync.mockReturnValue(false);
    newPluginCmd("testplugin", { port: 5000 });
    expect(fs.writeFileSync).toHaveBeenCalledTimes(4);
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
    expect(fs.copyFileSync).toHaveBeenCalledTimes(3);
    expect(fs.copyFileSync).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledTimes(5);
  });

  it("should throw error when plugin exists", () => {
    fs.existsSync.mockReturnValue(true);
    newPluginCmd("existing-plugin", { port: 3000 });
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });
});

describe("Given the newapp command", () => {
  it("should create new apps correctly", () => {
    fs.existsSync.mockReturnValue(false);
    newAppCmd("my-new-app", { port: 5000 });
    expect(fs.writeFileSync).toHaveBeenCalledTimes(5);
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(3);
    expect(fs.copyFileSync).toHaveBeenCalledTimes(3);
    expect(fs.copyFileSync).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledTimes(8);
  });

  it("should throw error when app exists", () => {
    fs.existsSync.mockReturnValue(true);
    newPluginCmd("existing-app", { port: 3000 });
    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });
});
