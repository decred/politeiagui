import { findMatch, generatePath, searchSelectorElement } from "./helpers";

const mockNestedRoutes = [
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

describe("Given the generatePath helper", () => {
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

describe("Given the findMatch helper", () => {
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

describe("Given the searchSelectorElement helper", () => {
  it("should return false if no element is passed", () => {
    const selector = "selector";
    const el = searchSelectorElement(undefined, selector);
    expect(el).toBe(false);
  });
  it("should return false if no selector is passed", () => {
    const bodyEl = document.createElement("body");
    const el = searchSelectorElement(bodyEl, undefined);
    expect(el).toBe(false);
  });
  it("should return false if selector does not match element or its parents", () => {
    const bodyEl = document.createElement("body");
    const divEl = document.createElement("div");
    const anchorEl = document.createElement("a");
    divEl.appendChild(anchorEl);
    bodyEl.appendChild(divEl);
    const el = searchSelectorElement(anchorEl, "selector");
    expect(el).toBe(false);
  });
  it("should return the element if selector matches element", () => {
    const selector = "selector";
    const bodyEl = document.createElement("body");
    const divEl = document.createElement("div");
    const anchorEl = document.createElement("a");
    anchorEl[selector] = true;
    divEl.appendChild(anchorEl);
    bodyEl.appendChild(divEl);
    const el = searchSelectorElement(anchorEl, selector);
    expect(el).toBe(anchorEl);
  });
  it("should return the parent element if the selector matches it", () => {
    const selector = "selector";
    const bodyEl = document.createElement("body");
    const divEl = document.createElement("div");
    const anchorEl = document.createElement("a");
    divEl[selector] = true;
    divEl.appendChild(anchorEl);
    bodyEl.appendChild(divEl);
    const el = searchSelectorElement(anchorEl, selector);
    expect(el).toBe(divEl);
  });
  it("should return the grandparent element if the selector matches it", () => {
    const selector = "selector";
    const bodyEl = document.createElement("body");
    const divEl = document.createElement("div");
    const anchorEl = document.createElement("a");
    bodyEl[selector] = true;
    divEl.appendChild(anchorEl);
    bodyEl.appendChild(divEl);
    const el = searchSelectorElement(anchorEl, selector);
    expect(el).toBe(bodyEl);
  });
});
