import { pluginsInitializers } from "./pluginsInitializers";

const initializers = [
  { id: "1", action: jest.fn() },
  { id: "test/1", action: jest.fn() },
  { id: "test/2", action: jest.fn() },
  { id: "test/1/2", action: jest.fn() },
  { id: "2", action: jest.fn() },
];

const initializersByRoutesMap = {
  "/": ["1", "test/1"],
  "/path": ["2", "test/2"],
  "/nested": ["test/1/2"],
};

function findInitializerById(id) {
  return initializers.find((i) => i.id === id);
}

describe("Given pluginsInitializers", () => {
  describe("given and unconfigured pluginsInitializers", () => {
    let consoleWarnSpy;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, "warn");
      consoleWarnSpy.mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy.mockRestore();
      pluginsInitializers.cleanup();
    });
    it("should configure initializers without routes map", () => {
      pluginsInitializers.configure({ initializers });
      expect(consoleWarnSpy).toBeCalled();
      expect(pluginsInitializers.getInitializers()).toEqual(initializers);
    });
    it("should configure initializers with routes map", () => {
      pluginsInitializers.configure({ initializers, initializersByRoutesMap });
      expect(consoleWarnSpy).not.toBeCalled();
      expect(pluginsInitializers.getInitializers()).toEqual(initializers);
    });
    it("should not configure initializers without 'initializer' param", () => {
      expect(() => pluginsInitializers.configure()).toThrow();
      expect(pluginsInitializers.getInitializers()).toEqual(null);
    });
  });
  describe("given a configured pluginsInitializers", () => {
    beforeEach(() => {
      pluginsInitializers.configure({ initializers, initializersByRoutesMap });
    });
    afterEach(() => {
      pluginsInitializers.cleanup();
      for (const init of initializers) {
        init.action.mockClear();
      }
    });
    it("should initialize from id", async () => {
      await pluginsInitializers.initializeFromId("1");
      const { action } = findInitializerById("1");
      expect(action).toBeCalled();
    });
    it("should not initialize from invalid id", async () => {
      await pluginsInitializers.initializeFromId("invalid");
      for (const initializer of initializers) {
        expect(initializer.action).not.toBeCalled();
      }
    });
    it("should initialize from URL", async () => {
      await pluginsInitializers.initializeFromUrl("/");
      const { action: act1 } = findInitializerById("1");
      const { action: act2 } = findInitializerById("test/1");
      expect(act1).toBeCalled();
      expect(act2).toBeCalled();
    });
    it("should not initialize from invalid URL", async () => {
      await pluginsInitializers.initializeFromUrl("/invalid");
      for (const initializer of initializers) {
        expect(initializer.action).not.toBeCalled();
      }
    });
  });
});
