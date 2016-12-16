/**
 * Universal Router (https://www.kriasoft.com/universal-router/)
 *
 * Copyright © 2015-2016 Konstantin Tarkus, Kriasoft LLC. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { matchPath, matchBasePath } from './matchPath';

function flatten(arr) {
  const flattenIfArray = arr2 => arr2.reduce((a, c) => {
    if (Array.isArray(c)) {
      return [...a, ...flattenIfArray(c)];
    }
    return [...a, c];
  }, []);
  return flattenIfArray(arr);
}

function matchRoute(route, baseUrl, path, parentParams) {
  const routes = [];

  if (!route.children) {
    const match = matchPath(route.path, path, parentParams);

    if (match) {
      routes.push({
        route,
        baseUrl,
        path: match.path,
        keys: match.keys,
        params: match.params,
      });
    }
  }

  if (route.children) {
    const match = matchBasePath(route.path, path, parentParams);

    if (match) {
      routes.push({
        route,
        baseUrl,
        path: match.path,
        keys: match.keys,
        params: match.params,
      });

      for (let i = 0; i < route.children.length; i += 1) {
        const newPath = path.substr(match.path.length);

        routes.push(matchRoute(
          route.children[i],
          baseUrl + (match.path === '/' ? '' : match.path),
          newPath.startsWith('/') ? newPath : `/${newPath}`,
          match.params,
        ));
      }
    }
  }

  return flatten(routes);
}

export default matchRoute;
