import { appSetup } from "./appSetup";
import { pluginSetup } from "./pluginSetup";
import { store } from "./storeSetup";
import { router } from "./router";

const reducer = () => ({});
const action = jest.fn();
jest.spyOn(console, "error").mockImplementation();

const plugin = pluginSetup({
  services: [{ id: "custom/service1", action }],
  reducers: [
    { key: "customReducer", reducer },
    { key: "customReducer2", reducer },
  ],
  name: "custom",
});

describe("Given appSetup method", () => {
  describe("when only app plugins are defined", () => {
    let myApp;
    beforeEach(() => {
      myApp = appSetup({ plugins: [plugin] });
    });
    it("should setup app correctly", () => {
      expect(myApp).toHaveProperty(
        "config",
        "init",
        "getConfig",
        "createRoute"
      );
    });
    it("should connect plugin's reducers", () => {
      expect(store.getState()).toHaveProperty("customReducer");
      expect(store.getState()).toHaveProperty("customReducer2");
    });
    it("should create route correctly and allow navigation", async () => {
      const view = jest.fn();
      const route = myApp.createRoute({ path: "/", view, cleanup: jest.fn() });

      await myApp.init({ routes: [route] });
      router.navigateTo("/");

      expect(view).toBeCalled();
    });
  });
  describe("when listeners and plugins are defined on app setup", () => {
    const effect = jest.fn();
    const myApp = appSetup({
      plugins: [plugin],
      listeners: [{ type: "customReducer/fetch", effect }],
    });
    it("should listen to customReducer/fetch", async () => {
      await myApp.init({
        routes: [
          {
            path: "/",
            view: jest.fn(),
            cleanup: jest.fn(),
          },
        ],
      });
      router.navigateTo("/");
      expect(effect).not.toBeCalled();
      store.dispatch({ type: "customReducer/fetch" });
      expect(effect).toBeCalled();
    });
  });
});
