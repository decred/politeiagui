import { appSetup } from "./appSetup";
import { pluginSetup } from "./pluginSetup";
import { configureCustomStore } from "./storeSetup";
import { router } from "./router";
import apiReducer from "./api/apiSlice";
import { client } from "./client/client";

const reducer = () => ({});
const fetchApi = jest.fn();
const extraArgument = { ...client, fetchApi };
const store = configureCustomStore({
  initialState: {},
  reducers: { dumb: reducer, api: apiReducer },
  extraArgument,
});
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

const plugin = pluginSetup({
  services: [{ id: "custom/service1", action }],
  reducers: [
    { key: "customReducer", reducer },
    { key: "customReducer2", reducer },
  ],
  name: "custom",
});

beforeEach(() => {
  fetchApi.mockResolvedValue({
    api: mockApiReturn,
    csrf: mockCsrfToken,
  });
});
afterEach(() => {
  fetchApi.mockRestore();
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
  describe("when creating a subrouter", () => {
    it("should create all routes from subrouter with nested path", () => {
      const app = appSetup({ plugins: [plugin], store });
      const view = jest.fn();
      const subRouter = app.createSubRouter({
        path: "/sub",
        title: "Sub",
        defaultPath: "/sub/foo",
        cleanup: jest.fn(),
        subRoutes: [{ path: "/foo", title: "Foo", view }],
      });

      expect(subRouter).toHaveLength(2);
      expect(subRouter[0]).toHaveProperty("path", "/sub");
      expect(subRouter[1]).toHaveProperty("path", "/sub/foo");
    });
  });
  describe("when creating a route with condition", () => {
    const app = appSetup({ plugins: [plugin], store });
    it("should render route view only if condition is true", async () => {
      const view = jest.fn();
      const when = jest.fn(() => true);
      const otherwise = jest.fn();
      const routeFalse = app.createRoute({
        path: "/",
        view,
        cleanup: jest.fn(),
        when,
        otherwise,
      });
      await routeFalse.view();
      expect(when).toBeCalled();
      expect(otherwise).not.toBeCalled();
      expect(view).toBeCalled();
    });
    it("should render otherwise view if condition is false", async () => {
      const view = jest.fn();
      const when = jest.fn(() => false);
      const otherwise = jest.fn();
      const routeFalse = app.createRoute({
        path: "/",
        view,
        cleanup: jest.fn(),
        when,
        otherwise,
      });
      await routeFalse.view();
      expect(when).toBeCalled();
      expect(otherwise).toBeCalled();
      expect(view).not.toBeCalled();
    });
  });
});
