import makeRequestSaga, {
  Executor,
  RequestActionCreator,
  RequestActionType,
  RequestFailureActionType,
  RequestSaga,
  RequestSagaConfig,
  RequestSuccessActionType,
} from './makeRequestSaga'

export type DeleteRecordActionCreators = {
  deleteRecord: RequestActionCreator<RequestActionType>
  deleteRecordSuccess: RequestActionCreator<RequestSuccessActionType>
  deleteRecordFailure: RequestActionCreator<RequestFailureActionType>
}

export type MakeDeleteRecordSagaConfig = RequestSagaConfig

export const makeDeleteRecordFactory = (requestFactory = makeRequestSaga) => (
  actions: DeleteRecordActionCreators,
  executor: Executor,
  config?: MakeDeleteRecordSagaConfig
): RequestSaga =>
  requestFactory(
    {
      request: actions.deleteRecord,
      requestSuccess: actions.deleteRecordSuccess,
      requestFailure: actions.deleteRecordFailure,
    },
    executor,
    config
  )

export default makeDeleteRecordFactory()
