import { findMatch, generatePath, router } from "./router";

const mockRoutes = [
  {
    path: "/test-url",
    view: () =>
      (document.querySelector("#root").innerHTML = "hello from test url"),
  },
  {
    path: "/test-url/:id/test/:id2",
    view: ({ id, id2 }) =>
      (document.querySelector(
        "#root"
      ).innerHTML = `hello from test url id1-${id} id2-${id2}`),
  },
  {
    path: "/",
    view: () => (document.querySelector("#root").innerHTML = "hello from home"),
  },
];

const mockNestedRoutes = [
  ...mockRoutes,
  {
    path: "/test-url/:id",
    view: ({ id }) =>
      (document.querySelector(
        "#root"
      ).innerHTML = `hello from test url id-${id}`),
  },
  {
    path: "/test-url/:id/test",
    view: ({ id }) =>
      (document.querySelector(
        "#root"
      ).innerHTML = `hello from test url id-${id}`),
  },
];

function getGoodDOM() {
  const div = document.createElement("div");
  div.innerHTML = `
    <span href="/" data-link>Go to home</span>
    <span href="/test-url" data-link>Go to test</span>
    <div id="root"></div>
  `;
  return div;
}

const routerArg = {
  routes: [],
  clickHandler: () => {},
  popStateHandler: () => {},
};

describe("Given the router", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    document.body.innerHTML = "";
    document.body.insertAdjacentElement("beforeend", getGoodDOM());
    router.reset();
  });

  it("should have methods: navigateTo, getRoutes, getIsInitialized, reset and init", () => {
    expect(router.navigateTo).toBeFunction();
    expect(router.getRoutes).toBeFunction();
    expect(router.getIsInitialized).toBeFunction();
    expect(router.reset).toBeFunction();
    expect(router.init).toBeFunction();
  });

  it("should throw an error if routes is not an array", async () => {
    const routesTypeErrorMsg = "routes is required and must be an array";
    await expect(router.init()).rejects.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
    await expect(
      router.init({ routes: { obj: test } })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(router.init({ routes: "string" })).rejects.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
    await expect(router.init({ routes: 123 })).rejects.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
    await expect(router.init({ routes: null })).rejects.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
    await expect(router.init({ routes: undefined })).rejects.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
    await expect(router.init({ routes: [] })).not.toThrowWithMessage(
      TypeError,
      routesTypeErrorMsg
    );
  });

  it("should throw an error if clickHandler is not a function", async () => {
    const routesTypeErrorMsg = "clickHandler must be a function";
    await expect(
      router.init({ ...routerArg, clickHandler: "string" })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, clickHandler: 123 })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, clickHandler: [] })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, clickHandler: {} })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, clickHandler: () => {} })
    ).not.toThrowWithMessage(TypeError, routesTypeErrorMsg);
  });

  it("should throw an error if popStateHandler is not a function", async () => {
    const routesTypeErrorMsg = "popStateHandler must be a function";
    await expect(
      router.init({ ...routerArg, popStateHandler: "string" })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, popStateHandler: 123 })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, popStateHandler: [] })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, popStateHandler: {} })
    ).rejects.toThrowWithMessage(TypeError, routesTypeErrorMsg);
    await expect(
      router.init({ ...routerArg, popStateHandler: () => {} })
    ).not.toThrowWithMessage(TypeError, routesTypeErrorMsg);
  });

  it("should be initialized", () => {
    router.init({ routes: mockRoutes });
    expect(router.getIsInitialized()).toBeTruthy();
  });

  it("should return routes", async () => {
    router.init({ routes: mockRoutes });
    expect(router.getRoutes()).toBe(mockRoutes);
  });

  it("should navigate to the designed url with the navigateTo method", () => {
    const pushState = jest.spyOn(window.history, "pushState");
    expect(window.location.pathname).toBe("/");
    router.init({ routes: mockRoutes });
    router.navigateTo(mockRoutes[0].path);
    expect(pushState).toBeCalledWith(null, null, mockRoutes[0].path);
  });

  it("should navigate to the designed url with the navigateTo method when route has params", () => {
    const pushState = jest.spyOn(window.history, "pushState");
    expect(window.location.pathname).toBe("/");
    router.init({ routes: mockRoutes });
    router.navigateTo("/test-url/5/test/1");
    expect(pushState).toBeCalledWith(null, null, "/test-url/5/test/1");
  });

  it("should matchPath correctly", () => {
    router.init({ routes: mockRoutes });
    expect(router.matchPath("/test-url")).toBeTruthy();
    expect(router.matchPath("/test")).toBeFalsy();
    expect(router.matchPath("/test-ur")).toBeFalsy();
    expect(router.matchPath("/tst-url")).toBeFalsy();
    expect(router.matchPath("/test-url/5/test/1")).toBeTruthy();
    expect(router.matchPath("/test-url/test/1")).toBeFalsy();
    expect(router.matchPath("/test-url/test")).toBeFalsy();
    expect(router.matchPath("/test-url/5/test")).toBeFalsy();
    expect(router.matchPath("/testrl/5/test/1")).toBeFalsy();
    expect(router.matchPath("/test-url/5/tes/1")).toBeFalsy();
  });

  it("should find correct matches for nested routes", () => {
    let matchNested = findMatch(mockNestedRoutes, "/test-url/5/test/1");
    let [route, arg1, arg2] = matchNested.result;
    expect(matchNested.route.path).toEqual("/test-url/:id/test/:id2");
    expect(route).toEqual("/test-url/5/test/1");
    expect(arg1).toEqual("5");
    expect(arg2).toEqual("1");

    matchNested = findMatch(mockNestedRoutes, "/test-url/4");
    [route, arg1] = matchNested.result;
    expect(matchNested.route.path).toEqual("/test-url/:id");
    expect(route).toEqual("/test-url/4");
    expect(arg1).toEqual("4");

    matchNested = findMatch(mockNestedRoutes, "/test-url/4/test");
    [route, arg1, arg2] = matchNested.result;
    expect(matchNested.route.path).toEqual("/test-url/:id/test");
    expect(route).toEqual("/test-url/4/test");
    expect(arg1).toEqual("4");
    expect(arg2).not.toBeDefined();
  });
});

describe("Given the generatePath util", () => {
  describe("when no params", () => {
    it("should return the unmodified path", () => {
      expect(generatePath("/")).toBe("/");
      expect(generatePath("/courses")).toBe("/courses");
    });
  });

  describe("when missing params", () => {
    it("should throw an error", () => {
      expect(() => {
        generatePath("/:id/test", {});
      }).toThrow(/Missing ":id" param/);
    });
  });

  describe("when valid params", () => {
    it("should return the right path", () => {
      expect(generatePath("/test/:id", { id: 5 })).toBe("/test/5");
      expect(generatePath("/test/*", { "*": "test2" })).toBe("/test/test2");
      expect(generatePath("*", { "*": "test/test2" })).toBe("/test/test2");
    });
  });

  describe("when valid params but the path is not expecting them", () => {
    it("should ignore them", () => {
      expect(generatePath("/", { id: 5 })).toBe("/");
      expect(generatePath("/test", { id: 5 })).toBe("/test");
    });
  });
});
