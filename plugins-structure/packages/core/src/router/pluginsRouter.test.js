import { pluginsRouter } from "./pluginsRouter";

const routes = [
  { path: "/", fetch: jest.fn() },
  { path: "/test/path1", fetch: jest.fn() },
  { path: "/test/path2", fetch: jest.fn() },
  { path: "/test/subroute/path1", fetch: jest.fn() },
  { path: "/path1", fetch: jest.fn() },
];

function routeByPath(path) {
  return routes.find((route) => route.path === path);
}

describe("Given pluginsRouter", () => {
  let windowSpy;
  function setWindowPathname(path) {
    windowSpy.mockImplementation(() => ({
      location: {
        pathname: path,
      },
    }));
  }
  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get");
  });
  afterEach(() => {
    windowSpy.mockRestore();
  });

  describe("with valid routes setup", () => {
    beforeEach(async () => {
      setWindowPathname("/");
      await pluginsRouter.init({ routes });
    });
    afterEach(() => {
      for (const route of routes) {
        route.fetch.mockRestore();
      }
      pluginsRouter.cleanup();
    });
    it("should initialize router successfully", async () => {
      expect(routeByPath("/").fetch).toBeCalled();
    });
    it("should navigate between routes", async () => {
      const path1 = "/test/path1";
      await pluginsRouter.navigateTo(path1);
      expect(routeByPath(path1).fetch).toBeCalled();

      const path2 = "/test/path2";
      await pluginsRouter.navigateTo(path2);
      expect(routeByPath(path2).fetch).toBeCalled();
    });
    it("should not call any routes if navigation path does not match", async () => {
      // Reset initial call so we can check the number of calls after the
      // navigation.
      routeByPath("/").fetch.mockReset();
      // Navigate to an invalid route
      await pluginsRouter.navigateTo("/invalid/url");
      // No routes called.
      for (const route of routes) {
        expect(route.fetch).not.toBeCalled();
      }
    });
  });
  describe("with invalid routes setup", () => {
    beforeEach(() => {
      // Set pathname to a valid route.
      setWindowPathname("/");
    });
    afterEach(() => {
      pluginsRouter.cleanup();
    });
    it("should not initialize the router if 'routes' is empty", async () => {
      await expect(pluginsRouter.init()).rejects.toThrow();
      expect(routeByPath("/").fetch).not.toBeCalled();
    });
    it("should not initialize the router if 'routes' is malformed", async () => {
      const fetch = jest.fn();
      // Invalid `pathhhh` key.
      const routes = [{ pathhhh: "/", fetch }];
      await expect(pluginsRouter.init({ routes })).rejects.toThrow();
      expect(fetch).not.toBeCalled();
    });
    it("should not navigate and throw error if route is not initialized", async () => {
      await expect(pluginsRouter.navigateTo("/")).rejects.toThrow();
    });
  });
  describe("with proxy configured", () => {
    const proxy = {
      "/": ["/path1", "/test/path1"],
      "/custom": ["/test/path2", "/test/subroute/path1"],
    };
    beforeEach(async () => {
      setWindowPathname("/");
      pluginsRouter.setupProxyConfig(proxy);
      await pluginsRouter.init({ routes });
    });
    afterEach(() => {
      for (const route of routes) {
        route.fetch.mockRestore();
      }
      pluginsRouter.cleanup();
    });
    it("should fetch both proxied and regular-setup routes", async () => {
      expect(routeByPath("/").fetch).toBeCalled();
      expect(routeByPath("/path1").fetch).toBeCalled();
      expect(routeByPath("/test/path1").fetch).toBeCalled();
      // Navigate to another proxied route:
      await pluginsRouter.navigateTo("/custom");
      expect(routeByPath("/test/path2").fetch).toBeCalled();
      expect(routeByPath("/test/subroute/path1").fetch).toBeCalled();
    });
  });
});
