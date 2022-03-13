import {
  DeleteRecordActions,
  UpdateRecordActions,
  CreateRecordActions,
  FetchRecordActions,
  FetchPaginatedRecordsActions,
  FetchPaginatedRecordsConfig,
  requestFactory,
} from '../../../../redux/modules/factories'

const makeFetchRecordsReducer = (
  actions: FetchPaginatedRecordsActions,
  config?: FetchPaginatedRecordsConfig
) => requestFactory.makeFetchPaginatedRecordsReducer(actions, config)

const makeFetchRecordReducer = (actions: FetchRecordActions) =>
  requestFactory.makeFetchRecordReducer(actions)

const makeCreateRecordReducer = (actions: CreateRecordActions) =>
  requestFactory.makeCreateRecordReducer(actions)

const makeUpdateRecordReducer = (actions: UpdateRecordActions) =>
  requestFactory.makeUpdateRecordReducer(actions)

const makeDeleteRecordReducer = (actions: DeleteRecordActions) =>
  requestFactory.makeDeleteRecordReducer(actions)

export default {
  makeDeleteRecordReducer,
  makeCreateRecordReducer,
  makeFetchRecordReducer,
  makeFetchRecordsReducer,
  makeUpdateRecordReducer,
}
