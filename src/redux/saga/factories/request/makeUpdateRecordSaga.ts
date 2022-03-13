import makeRequestSaga, {
  Executor,
  RequestActionCreator,
  RequestActionType,
  RequestFailureActionType,
  RequestSaga,
  RequestSagaConfig,
  RequestSuccessActionType,
} from './makeRequestSaga'

export type UpdateRecordActionCreators = {
  updateRecord: RequestActionCreator<RequestActionType>
  updateRecordSuccess: RequestActionCreator<RequestSuccessActionType>
  updateRecordFailure: RequestActionCreator<RequestFailureActionType>
}

export type MakeUpdateRecordSagaConfig = RequestSagaConfig

export const makeUpdateRecordFactory = (requestFactory = makeRequestSaga) => (
  actions: UpdateRecordActionCreators,
  executor: Executor,
  config?: MakeUpdateRecordSagaConfig
): RequestSaga =>
  requestFactory(
    {
      request: actions.updateRecord,
      requestSuccess: actions.updateRecordSuccess,
      requestFailure: actions.updateRecordFailure,
    },
    executor,
    {
      runRequest(run, { action: { payload } }) {
        return run(payload.id, payload.data)
      },
      ...config,
    }
  )

export default makeUpdateRecordFactory()
