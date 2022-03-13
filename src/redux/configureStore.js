import createSagaMiddleware from 'redux-saga'
import reduxReset from 'redux-reset'
import * as R from 'ramda'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { middleware as sagaThunkMiddleware } from 'redux-saga-thunk'

import apiErrorsBoundary from './middleware/apiErrorsBoundary'
import createRootReducer from './modules'
import rootSaga from './saga'
import { DebuggingModules } from '../invariants'
import { isDebug, isDevMode } from '../helpers'

function getDevToolsExtension() {
  if (isDevMode()) {
    // noinspection JSUnresolvedVariable
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
      return window.__REDUX_DEVTOOLS_EXTENSION__({
        trace: true,
        features: {
          pause: true,
          lock: true,
          persist: true,
          export: true,
          import: 'custom',
          jump: true,
          skip: true,
          reorder: true,
          dispatch: true,
          test: false,
        },
      })
    }
    console.warn('Please install Redux DevTools for your browser')
  }
}

function getMiddlewares() {
  const middlewares = new Map()

  middlewares.set('apiErrorsBoundary', apiErrorsBoundary)
  middlewares.set('sagaThunkMiddleware', sagaThunkMiddleware)
  middlewares.set('saga', createSagaMiddleware())

  if (isDebug(DebuggingModules.REDUX)) {
    middlewares.set(
      'logger',
      createLogger({
        collapsed: true,
        logErrors: false,
      })
    )
  }

  return middlewares
}

export default function configureStore(initialState = {}) {
  const middlewares = getMiddlewares()
  const devToolsExtension = getDevToolsExtension()
  const enhancer = compose(
    ...R.filter(a => R.identical(R.type(a), 'Function'), [
      applyMiddleware(...middlewares.values()),
      reduxReset(),
      devToolsExtension,
    ])
  )

  return {
    ...createStore(createRootReducer(), initialState, enhancer),
    runSaga: (...args) => middlewares.get('saga').run(rootSaga, ...args),
  }
}
