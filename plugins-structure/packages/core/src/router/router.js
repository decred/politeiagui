export const router = function() {
  const settings = {
    routes: null,
    selector: "[data-link]",
    title: "",
    onpopstate: true,
    cleanup: null
  }

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
    // Update the page title
    // Some browsers ignore the second param on pushState
    if (settings.title) document.title = settings.title;
    // We are not sending a URL state (first param)
    // because we don't need it. All info we need in
    // the route is in the redux store or sent via
    // query params. All query params are sent to the
    // view.
    window.history.pushState(null, settings.title, url);
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
      match = {
        route: settings.routes[0], // 404 is first route by default.
        result: [window.location.pathname],
      };
    }

    // Call view cb and pass query params as parameter
    await match.route.view(getParams(match));

    // Set cleanup
    settings.cleanup =  match.route.cleanup;
  }

  return {
    navigateTo(url) {
      const cleanup = settings.cleanup;
      cleanup && cleanup();
      push(url);
      // Call verifyMatch to update our router state after
      // changing the route.
      verifyMatch();
    },

    getRoutes() {
      return settings.routes;
    },

    getIsInitialized() {
      // if we have the routes set, we know the router
      // has been initialized
      return !!settings.routes;
    },

    async init(routes, options) {
      if (this.getIsInitialized()) return;
      if (!routes || !Array.isArray(routes)) throw Error("routes is required and must be an array");

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          settings[key] = options[key];
        }
      }

      settings.routes = routes;
      await verifyMatch();

      // Add events
      // Make anchor tags work
      document.body.addEventListener("click", (e) => {
        if (e.target.matches(settings.selector)) {
          e.preventDefault();
          this.navigateTo(e.target.href);
        }
      });

      // Router history
      if (settings.onpopstate) {
        // Pop state happens everytime a back button is clicked
        // in the browser or a call to history.back.
        window.addEventListener("popstate", () => {
          const cleanup = settings.cleanup;
          cleanup && cleanup();
          verifyMatch();
        });
      }
    }
  }
}();