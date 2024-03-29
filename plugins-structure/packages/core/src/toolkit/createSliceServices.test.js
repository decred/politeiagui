import { createSliceServices } from "./createSliceServices";

const validServices = {
  foo: {
    onSetup: jest.fn(),
    effect: jest.fn(),
  },
};

describe("Given createSliceService tool", () => {
  it("should create slices services correctly", () => {
    const { pluginServices, serviceListeners } = createSliceServices({
      name: "test",
      services: validServices,
    });
    // Plugin Services
    expect(pluginServices).toHaveLength(1);
    expect(pluginServices[0]).toHaveProperty("id", "test/foo");
    // Services Setups
    expect(serviceListeners).toHaveProperty("foo");
    expect(serviceListeners.foo).toHaveProperty("id", "test/foo");
    expect(serviceListeners.foo).toHaveProperty("listenTo");
  });
  it("should be able to setup listeners and effects", () => {
    const { serviceListeners } = createSliceServices({
      name: "test",
      services: validServices,
    });
    // Listeners
    expect(
      serviceListeners.foo.listenTo({ type: "action/foo" })
    ).toHaveProperty("listenerCreator");
    expect(
      serviceListeners.foo.listenTo({ type: "action/foo" })
    ).toHaveProperty("id");
    expect(
      serviceListeners.foo.listenTo({ type: "action/foo" })
    ).toHaveProperty("customizeEffect");
    // Customize effect
    expect(
      serviceListeners.foo
        .listenTo({ type: "action/foo" })
        .customizeEffect(() => {})
    ).toHaveProperty("listenerCreator");
    expect(
      serviceListeners.foo
        .listenTo({ type: "action/foo" })
        .customizeEffect(() => {})
    ).toHaveProperty("id");
  });
  it("should throw when name is falsy", () => {
    const services = validServices;
    expect(() => createSliceServices({ name: "", services })).toThrow();
    expect(() => createSliceServices({ name: null, services })).toThrow();
    expect(() => createSliceServices({ name: undefined, services })).toThrow();
    expect(() => createSliceServices({ services })).toThrow();
  });
  it("should throw when services are invalid", () => {
    expect(() =>
      createSliceServices({
        name: "test",
        services: { invalidService: { onSetup: "" } },
      })
    ).toThrow();
    expect(() =>
      createSliceServices({
        name: "test",
        services: { invalidService: { effect: "" } },
      })
    ).toThrow();
    expect(() =>
      createSliceServices({
        name: "test",
        services: { invalidService: { effect: "", onSetup: jest.fn() } },
      })
    ).toThrow();
    expect(() =>
      createSliceServices({
        name: "test",
        services: { invalidService: { effect: jest.fn(), onSetup: "" } },
      })
    ).toThrow();
    expect(() => createSliceServices({ name: "test", services: {} })).toThrow();
  });
});
