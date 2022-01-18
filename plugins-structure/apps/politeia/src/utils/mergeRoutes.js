
export function mergeRoutes(routes, pluginRoutes, pluginName) {
  const newArr = routes;
  let conflicting = false;
  for (let i = 0; i < pluginRoutes.length; i++) {
    for(let j = 0; j < routes.length; j++) {
      if(pluginRoutes[i].path === routes[j].path) {
        console.warn(`Conflicting path '${pluginRoutes[i].path}' on plugin: ${pluginName}. Pay attention!`);
        conflicting = true;
      }
    }
    if (!conflicting) newArr.push(pluginRoutes[i]);
    conflicting = false;
  }

  return newArr;
}

