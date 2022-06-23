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
