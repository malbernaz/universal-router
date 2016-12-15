/**
 * Universal Router (https://www.kriasoft.com/universal-router/)
 *
 * Copyright © 2015-2016 Konstantin Tarkus, Kriasoft LLC. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { matchPath, matchBasePath } from './matchPath';

const cache = new Map();

function matchRoute(route, baseUrl, path, parentParams) {
  const routes = [];
  const key = route;
  const routeToReturn = cache.get(key);

  if (routeToReturn) {
    return routeToReturn;
  }

  if (!route.children) {
    const match = matchPath(route.path, path, parentParams);

    if (match) {
      const routeObj = {
        route,
        baseUrl,
        path: match.path,
        keys: match.keys,
        params: match.params,
      };

      cache.set(key, routeObj);

      routes.push(routeObj);
    }
  }

  if (route.children) {
    const match = matchBasePath(route.path, path, parentParams);

    if (match) {
      const routeObj = {
        route,
        baseUrl,
        path: match.path,
        keys: match.keys,
        params: match.params,
      };

      routes.push(routeObj);

      for (let i = 0; i < route.children.length; i += 1) {
        const newPath = path.substr(match.path.length);

        routes.push(matchRoute(
          route.children[i],
          baseUrl + (match.path === '/' ? '' : match.path),
          newPath.startsWith('/') ? newPath : `/${newPath}`,
          match.params
        ));
      }
    }
  }

  return Array.prototype.concat.apply([], routes);
}

export default matchRoute;
