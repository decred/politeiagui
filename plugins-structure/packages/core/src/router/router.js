import isFunction from "lodash/fp/isFunction";
import isArray from "lodash/fp/isArray";

const routerInitialSettings = {
  routes: null,
  selector: "[data-link]",
  onpopstate: true,
};

export function generatePath(path, params) {
  return path
    .replace(/:(\w+)/g, (_, key) => {
      if (params[key] === null || params[key] === undefined) {
        throw new Error(`Missing ":${key}" param`);
      }
      return params[key];
    })
    .replace(/\/*\*$/, (_) =>
      params["*"] == null ? "" : params["*"].replace(/^\/*/, "/")
    );
}

export const router = (function () {
  let settings = routerInitialSettings;
  let cleanup = null;
  let title = null;

  function pathToRegex(path) {
    return new RegExp(
      "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
    );
  }

  function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1]
    );
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  }

  function push(url) {
    if (!window.history.pushState) return;
    // Don't run if already current page
    if (window.location.pathname === url) return;
    // We are not sending a URL state (first param)
    // because we don't need it. All info we need in
    // the route is in the redux store or sent via
    // query params. All query params are sent to the
    // view.
    window.history.pushState(null, null, url);
  }

  async function verifyMatch() {
    // Tests routes for potential match
    const potentialMatches = settings.routes.map((route) => ({
      route,
      result: window.location.pathname.match(pathToRegex(route.path)),
    }));

    let match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== null
    );

    if (!match) {
      // default to 404 route
      match = {
        route: {
          path: "/404",
          view: () =>
            (document.querySelector("#root").innerHTML = "<h1>Not found!</h1>"),
        },
        title: "Not found",
        result: [window.location.pathname],
      };
    }

    // Set title
    title = match.route.title;
    if (title) document.title = title;

    // Call view cb and pass query params as parameter
    await match.route.view(getParams(match));

    // Set cleanup
    cleanup = match.route.cleanup;
  }

  function onClickHandler(e) {
    if (e.target.matches(settings.selector)) {
      e.preventDefault();
      this.navigateTo(e.target.href);
    }
  }

  function onPopStateHandler() {
    cleanup && cleanup();
    verifyMatch();
  }

  return {
    navigateTo(url) {
      if (!this.getIsInitialized()) {
        throw Error("router is not initialized. Use the init method");
      }
      cleanup && cleanup();
      push(url);
      // Call verifyMatch to update our router state after
      // changing the route.
      verifyMatch();
    },

    matchPath(path) {
      return settings.routes.some((route) =>
        path.match(pathToRegex(route.path))
      );
    },

    getRoutes() {
      return settings.routes;
    },

    getIsInitialized() {
      // if we have the routes set, we know the router
      // has been initialized
      return !!settings.routes;
    },

    getHistory() {
      return window.history;
    },

    reset() {
      settings = { ...routerInitialSettings };
      document.body.removeEventListener("click", onClickHandler);
      window.removeEventListener("popstate", onPopStateHandler);
    },

    async init({
      routes,
      options,
      clickHandler = onClickHandler,
      popStateHandler = onPopStateHandler,
    } = {}) {
      if (this.getIsInitialized()) return;
      if (!routes || !isArray(routes))
        throw TypeError("routes is required and must be an array");
      if (!isFunction(clickHandler))
        throw TypeError("clickHandler must be a function");
      if (!isFunction(popStateHandler))
        throw TypeError("popStateHandler must be a function");

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          settings[key] = options[key];
        }
      }

      settings.routes = routes;
      await verifyMatch();

      // Add events
      // Make anchor tags work
      document.body.addEventListener("click", clickHandler.bind(this));

      // Router history
      if (settings.onpopstate) {
        // Pop state happens everytime a back button is clicked
        // in the browser or a call to history.back.
        window.addEventListener("popstate", popStateHandler);
      }
    },
  };
})();
