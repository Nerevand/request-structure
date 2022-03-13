import { takeLeading } from 'redux-saga/effects'

import makeRequestSaga, {
  Executor,
  RequestActionCreator,
  RequestActionType,
  RequestFailureActionType,
  RequestSaga,
  RequestSagaConfig,
  RequestSuccessActionType,
} from './makeRequestSaga'

export type FetchRecordActionCreators = {
  fetchRecord: RequestActionCreator<RequestActionType>
  fetchRecordSuccess: RequestActionCreator<RequestSuccessActionType>
  fetchRecordFailure: RequestActionCreator<RequestFailureActionType>
}

export type MakeFetchRecordSagaConfig = RequestSagaConfig

export const makeFetchRecordFactory = (requestFactory = makeRequestSaga) => (
  actions: FetchRecordActionCreators,
  executor: Executor,
  config?: MakeFetchRecordSagaConfig
): RequestSaga =>
  requestFactory(
    {
      request: actions.fetchRecord,
      requestSuccess: actions.fetchRecordSuccess,
      requestFailure: actions.fetchRecordFailure,
    },
    executor,
    {
      watcherEffect: takeLeading,
      ...config,
    }
  )

export default makeFetchRecordFactory()
