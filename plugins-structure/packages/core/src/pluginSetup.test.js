import { pluginSetup } from "./pluginSetup";

const reducer = jest.fn();
const action = jest.fn();

const validReducers = [{ key: "customReducer", reducer }];
const services = [{ id: "custom/service1", action }];

const validSetup = {
  services,
  reducers: validReducers,
  name: "custom",
};

describe("Given pluginSetup method", () => {
  it("should create and setup plugins correctly", () => {
    const customPlugin = pluginSetup(validSetup);
    expect(customPlugin).toHaveProperty(
      "reducers",
      "services",
      "name",
      "initialize"
    );
  });
  it("should throw error when some parameter is incorrect", () => {
    expect(() =>
      pluginSetup({
        services: [{ foo: "bar" }],
        reducers: validReducers,
        name: "custom",
      })
    ).toThrowError(
      "`services` must be an array of objects where the id key is required"
    );
    expect(() =>
      pluginSetup({
        services,
        reducers: [{ foo: "bar" }],
        name: "custom",
      })
    ).toThrowError("`reducers` must be array of { key, reducer }");
    expect(() =>
      pluginSetup({
        services: [{ foo: "bar" }],
        reducers: validReducers,
        name: null,
      })
    ).toThrowError("`name` is required and must be a string");
  });
});
