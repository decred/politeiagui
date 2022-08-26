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

export function pathToRegex(path) {
  return new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
  );
}

export function isRouteParamFormatted(param) {
  return param.split("/").length === 1;
}

export function findMatch(routes, targetRoute) {
  const potentialMatches = routes.map((route) => ({
    route,
    result: targetRoute.match(pathToRegex(route.path)),
  }));
  const match = potentialMatches.find((potentialMatch) => {
    if (potentialMatch.result === null) {
      return false;
    }
    const [, ...params] = potentialMatch.result;
    if (!params.length) {
      return true;
    }
    return params.every(isRouteParamFormatted);
  });
  return match;
}

export function getParams(match) {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
}

export function getURLSearchParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
}

export function getMatches(routes, targetRoute) {
  const matches = routes
    .map((route) => ({
      route,
      result: targetRoute.match(pathToRegex(route.path)),
    }))
    .filter((match) => {
      if (match.result === null) return false;
      const [, ...params] = match.result;
      if (!params.length) return true;
      return params.every(isRouteParamFormatted);
    });
  return matches;
}

/**
 * searchSelectorElement will look recursevely to the parents of the target of
 * an event looking if it has a provided selector
 * @param {HTMLElement} el
 * @param {string} selector
 * @returns false if it hits the root or the element if an element that matches
 * the selector is found
 */
export function searchSelectorElement(el, selector) {
  if (!el || !selector) {
    return false;
  }
  if ((el.matches && el.matches(selector)) || el.selector) {
    return el;
  } else {
    if (el.parentNode) return searchSelectorElement(el.parentNode, selector);
    else return false;
  }
}

/**
 * mergeRoutes return an array with `extraRoutes` merged with `routes`. If some
 * path is already defined, it will log a warning and skip the conflicting path.
 *
 * @param {Array} routes Current app routes
 * @param {Array} extraRoutes  Routes to merge
 */
export function mergeRoutes(routes, extraRoutes) {
  const newArr = routes;
  let conflicting = false;
  for (let i = 0; i < extraRoutes.length; i++) {
    for (let j = 0; j < routes.length; j++) {
      if (extraRoutes[i].path === routes[j].path) {
        console.warn(
          `Conflicting path '${extraRoutes[i].path}'. Pay attention!`
        );
        conflicting = true;
      }
    }
    if (!conflicting) newArr.push(extraRoutes[i]);
    conflicting = false;
  }

  return newArr;
}

/**
 * isExternalLink returns if some given url does not match the current window
 * location host.
 * @param {string} url
 */
export function isExternalLink(url) {
  const tmp = document.createElement("a");
  tmp.href = url;
  return tmp.hostname && tmp.hostname !== window.top.location.hostname;
}

/**
 * isCurrentPathname returns if given `url` corresponds to current window
 * location pathname for same origin
 * @param {String} url
 * @returns {String} pathname
 */
export function isCurrentPathname(url) {
  try {
    const { origin, pathname, search } = new URL(url);
    return (
      window.location.origin === origin &&
      window.location.pathname === pathname &&
      window.location.search === search
    );
  } catch (_) {
    return url === window.location.pathname;
  }
}
