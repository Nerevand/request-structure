import * as R from 'ramda'

export enum DebuggingModules {
  REDUX = 'redux',
  // USER_PERMISSIONS = 'user_permissions',
  // WS = 'ws',
  // XHR = 'xhr',
}

export const EnabledDebuggingModules = R.pipe(
  // @ts-ignore
  R.defaultTo(R.identical('development', 'development') ? '*' : ''),
  R.trim,
  // @ts-ignore
  R.ifElse(R.identical('*'), () => R.values(DebuggingModules), R.split(',')),
  R.map(R.compose(R.trim, R.toLower)),
  R.filter(R.has(R.__, R.invertObj(DebuggingModules))),
  modules => R.zipObj(modules, R.map(R.T, modules))
  // @ts-ignore
)('*')