import makeRequestSaga, {
  Executor,
  RequestActionCreator,
  RequestActionType,
  RequestFailureActionType,
  RequestSaga,
  RequestSagaConfig,
  RequestSuccessActionType,
} from './makeRequestSaga'

export type CreateRecordActionCreators = {
  createRecord: RequestActionCreator<RequestActionType>
  createRecordSuccess: RequestActionCreator<RequestSuccessActionType>
  createRecordFailure: RequestActionCreator<RequestFailureActionType>
}

export type MakeCreateRecordSagaConfig = RequestSagaConfig

export const makeCreateRecordFactory = (requestFactory = makeRequestSaga) => (
  actions: CreateRecordActionCreators,
  executor: Executor,
  config?: MakeCreateRecordSagaConfig
): RequestSaga =>
  requestFactory(
    {
      request: actions.createRecord,
      requestSuccess: actions.createRecordSuccess,
      requestFailure: actions.createRecordFailure,
    },
    executor,
    config
  )

export default makeCreateRecordFactory()
