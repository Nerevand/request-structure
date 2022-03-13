import { call, select, takeLatest } from 'redux-saga/effects'
import * as R from 'ramda'
import { isObjLike } from 'ramda-adjunct'

import makeRequestSaga, {
  Executor,
  RequestActionCreator,
  RequestActionType,
  RequestFailureActionType,
  RequestSaga,
  RequestSagaConfig,
  RequestSuccessActionType,
} from './makeRequestSaga'

export type FetchRecordsActionCreators = {
  fetchRecords: RequestActionCreator<RequestActionType>
  fetchRecordsSuccess: RequestActionCreator<RequestSuccessActionType>
  fetchRecordsFailure: RequestActionCreator<RequestFailureActionType>
}

export type MakeFetchRecordsSagaConfig = Partial<{
  filtersSelector(state: Record<string, any>): Record<string, any>
  paginationSelector(state: Record<string, any>): Partial<{ limit: number; offset: number }>
}> &
  RequestSagaConfig

export const makeFetchRecordsFactory = (requestFactory = makeRequestSaga) => (
  actions: FetchRecordsActionCreators,
  executor: Executor,
  { filtersSelector, paginationSelector, runRequest, ...config }: MakeFetchRecordsSagaConfig = {}
): RequestSaga =>
  requestFactory(
    {
      request: actions.fetchRecords,
      requestSuccess: actions.fetchRecordsSuccess,
      requestFailure: actions.fetchRecordsFailure,
    },
    executor,
    {
      watcherEffect: takeLatest,
      *runRequest(run, params) {
        //@ts-ignore
        const filters = filtersSelector ? yield select(filtersSelector) : {}
        //@ts-ignore
        const pagination = paginationSelector ? yield select(paginationSelector) : {}

        if (runRequest) {
          //@ts-ignore
          return yield call(runRequest, run, { filters, pagination, ...params })
        }

        const payload = R.pipe(
          R.path(['action', 'payload']),
          R.unless(isObjLike, R.always({}))
        )(params)

        //@ts-ignore
        return yield call(run, {
          ...filters,
          ...pagination,
          //@ts-ignore
          ...payload,
        })
      },
      ...config,
    }
  )

export default makeFetchRecordsFactory()
