import isFunction from "lodash/fp/isFunction";
import isArray from "lodash/fp/isArray";
import {
  findMatch,
  getParams,
  pathToRegex,
  searchSelectorElement,
} from "./helpers";

const routerInitialSettings = {
  routes: null,
  selector: "[data-link]",
  onpopstate: true,
};

export const router = (function () {
  let settings = routerInitialSettings;
  let cleanup = null;
  let title = null;

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
    let match = findMatch(settings.routes, window.location.pathname);

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
    const selectorElement = searchSelectorElement(e.target, settings.selector);
    if (selectorElement) {
      e.preventDefault();
      this.navigateTo(selectorElement.href);
    }
  }

  function onPopStateHandler() {
    cleanup && cleanup();
    verifyMatch();
  }

  return {
    /**
     * navigateTo is used to perform navigation using the `pushState` window
     * history method. It navigates to the given valid URL that matches the
     * `Match` Object.  If the given URL does not match one of the defined
     * routes, it redirects to default `/404` Match.
     *
     * @param {String} url
     */
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

    /**
     * matchPath returns if given path matches some existing route.
     *
     * @param {String} path
     */
    matchPath(path) {
      return settings.routes.some((route) =>
        path.match(pathToRegex(route.path))
      );
    },

    /**
     * getRoutes returns the possible configured routes.
     *
     * @returns {Array} routes
     */
    getRoutes() {
      return settings.routes;
    },

    /**
     * getIsInitialized returns if the router was initialized properly.
     *
     * @returns {Boolean} isInitialized
     */
    getIsInitialized() {
      // if we have the routes set, we know the router
      // has been initialized
      return !!settings.routes;
    },

    /**
     * getHistory returns current History object
     */
    getHistory() {
      return window.history;
    },

    /**
     * reset is used for resetting the router to default settings. Restores the
     * router state, `click` and `popstate` handlers.
     */
    reset() {
      settings = { ...routerInitialSettings };
      document.body.removeEventListener("click", onClickHandler);
      window.removeEventListener("popstate", onPopStateHandler);
    },

    /**
     * init Initializes the router using the given `Config` object.
     *
     * @param {Object} config `Config` object.
     */
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
