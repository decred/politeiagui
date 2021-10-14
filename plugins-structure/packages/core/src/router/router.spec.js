import { router } from "./router";
import { getByText, waitFor, fireEvent } from "@testing-library/dom";

const mockRoutes = [
  {
    path: "/test-url",
    view: () =>
      (document.querySelector("#root").innerHTML = "hello from test url"),
  },
  {
    path: "/",
    view: () => (document.querySelector("#root").innerHTML = "hello from home"),
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

// function getGoodDOM() {
//   const div = document.createElement('div')
//   div.innerHTML = `
//     <a href="/" data-link>Go to home</a>
//     <a href="/test-url" data-link>Go to test url</a>
//   `
//   return div;
// }

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
    expect(pushState).toBeCalledWith(null, "", mockRoutes[0].path);
  });
});
