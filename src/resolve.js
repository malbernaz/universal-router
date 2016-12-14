/**
 * Universal Router (https://www.kriasoft.com/universal-router/)
 *
 * Copyright © 2015-2016 Konstantin Tarkus, Kriasoft LLC. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import matchRoute from './matchRoute';

async function resolve(routes, pathOrContext) {
  const context = typeof pathOrContext === 'string' || pathOrContext instanceof String
    ? { path: pathOrContext }
    : pathOrContext;
  const rootRoute = Array.isArray(routes) ? { path: '/', children: routes } : routes;
  let result = null;
  let value;

  const match = matchRoute(rootRoute, '', context.path);

  let i = 0;
  async function next() {
    const done = match.length === i - 1;
    value = match[i];
    i += 1;

    if (!value || done || (result !== null && result !== undefined)) {
      return result;
    }

    if (value.route.action) {
      const newContext = Object.assign({}, context, value);
      result = await value.route.action(newContext, newContext.params);
    }

    return await next();
  }

  context.next = next;

  await next();

  if (result === null || result === undefined) {
    const error = new Error('Page not found');
    error.status = error.statusCode = 404;
    throw error;
  }

  return result;
}

export default resolve;
