import { call, fork, ForkEffect, put, takeEvery } from 'redux-saga/effects'
import { hideLoading, showLoading } from 'react-redux-loading-bar'

import { callApi } from '../../core'

export type RequestActionType = any
export type RequestSuccessActionType = any
export type RequestFailureActionType = any
export type Executor = (...args: any) => any

export type RequestAction<T> = {
  type: T
  payload: any
  meta?: any
}

export type RequestActionCreator<A> = {
  (...args: any[]): { type: A; payload: any; meta?: any }
}

export type BaseRequestActionCreators = {
  [propName: string]: RequestActionCreator<string>
}

export type RequestActionCreators = {
  request: RequestActionCreator<RequestActionType>
  requestSuccess: RequestActionCreator<RequestSuccessActionType>
  requestFailure: RequestActionCreator<RequestFailureActionType>
}

export type RequestSagaConfig = Partial<{
  withCredentials: boolean
  watcherEffect(channel: any, worker: (item: any) => any): ForkEffect
  runRequest(
    run: (...args: any) => any,
    params: { action: RequestAction<RequestActionType>;[propName: string]: any }
  ): any
  onStart(): void
  onSuccess(): void
  onError(params: { error: Error }): void
  onFinish(): void
}>

export interface RequestSaga {
  (): void

  worker(action: RequestAction<RequestActionType>): any
}

const DEFAULT_CONFIG: Required<RequestSagaConfig> = {
  withCredentials: true,
  watcherEffect: takeEvery,
  *runRequest(run, { action }) {
    //@ts-ignore
    return yield run(action.payload)
  },
  *onStart() {
    yield put(showLoading())
  },
  *onError(error) {
    yield console.error(error)
  },
  onSuccess() { },
  *onFinish() {
    yield put(hideLoading())
  },
}

function* tryForkWorker(worker?: (...args: any) => any, ...args: any): any {
  if (worker) {
    return yield fork(worker, ...args)
  }
}

function makeRequestSaga(
  actions: RequestActionCreators,
  executor: Executor,
  config?: RequestSagaConfig
): RequestSaga {
  const { withCredentials, watcherEffect, runRequest, onStart, onSuccess, onError, onFinish } = {
    ...DEFAULT_CONFIG,
    ...config,
  } as Required<RequestSagaConfig>

  function* worker(action: RequestAction<RequestActionType>) {
    yield tryForkWorker(onStart)
    let rv = null

    try {
      //@ts-ignore
      const request = yield call(
        runRequest,
        (...args) => (withCredentials ? callApi(executor, ...args) : call(executor, ...args)),
        {
          action,
          payload: action.payload,
        }
      )
      //@ts-ignore
      rv = yield request
      yield put(actions.requestSuccess(rv, action.meta))
      yield tryForkWorker(onSuccess)
    } catch (e) {
      rv = e
      yield put(actions.requestFailure(e, action.meta))
      if (onError) {
        yield tryForkWorker(onError, { error: e })
      }
    } finally {
      yield tryForkWorker(onFinish)
    }

    return rv
  }

  function* watcher() {
    if (watcherEffect) {
      yield watcherEffect(actions.request, worker)
    }
  }

  watcher.worker = worker

  return watcher
}

export default makeRequestSaga
