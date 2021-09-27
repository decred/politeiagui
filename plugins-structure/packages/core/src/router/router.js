export async function navigateTo(url, routes) {
  const cleanup = await router(routes);
  cleanup && cleanup();
  window.history.pushState(null, null, url);
  router(routes);
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

export async function router(routes) {
  if (!routes) throw Error("routes is required");
  if (!Array.isArray(routes)) throw Error("routes must be an array");
  // Tests routes for potential match
  const potentialMatches = routes.map((route) => ({
    route,
    result: window.location.pathname.match(pathToRegex(route.path)),
  }));

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [window.location.pathname],
    };
  }

  await match.route.view(getParams(match));

  return match.route.cleanup;
}
