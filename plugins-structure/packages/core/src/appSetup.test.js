import { appSetup } from "./appSetup";
import { pluginSetup } from "./pluginSetup";
import { configureCustomStore } from "./storeSetup";
import { router } from "./router";
import apiReducer from "./api/apiSlice";
import { client } from "./client/client";

const reducer = () => ({});
const store = configureCustomStore({}, { dumb: reducer, api: apiReducer });
const action = jest.fn();
const mockApiReturn = {
  version: 1,
  route: "/v1",
  pubkey: "fake_pubkey",
  testnet: true,
  mode: "piwww",
  activeusersession: true,
};
const mockCsrfToken = "fake_csrf";

jest.spyOn(console, "error").mockImplementation();
const fetchApiSpy = jest.spyOn(client, "fetchApi");

const plugin = pluginSetup({
  services: [{ id: "custom/service1", action }],
  reducers: [
    { key: "customReducer", reducer },
    { key: "customReducer2", reducer },
  ],
  name: "custom",
});

beforeEach(() => {
  fetchApiSpy.mockResolvedValueOnce({
    api: mockApiReturn,
    csrf: mockCsrfToken,
  });
});

describe("Given appSetup method", () => {
  describe("when only app plugins are defined", () => {
    let myApp;
    beforeEach(() => {
      myApp = appSetup({ plugins: [plugin], store });
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
      store,
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
  describe("when app config is incorrect", () => {
    it("should throw error when plugins are invalid", () => {
      expect(() => appSetup({ plugins: {}, store })).toThrow(
        "'plugins' must be an array"
      );
      expect(() => appSetup({ plugins: [{}], store })).toThrow();
    });
    it("should throw error when listeners are invalid", () => {
      expect(() => appSetup({ plugins: [], listeners: {}, store })).toThrow(
        "'listeners' must be an array"
      );
      expect(() => appSetup({ plugins: [], listeners: [{}], store })).toThrow();
    });
  });
});
