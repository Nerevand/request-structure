import apiRequest from '../../../../api/requests'
import { requestFactory } from '../../factories'
import {
  CreateRecordActionCreators,
  DeleteRecordActionCreators,
  FetchRecordActionCreators,
  FetchRecordsActionCreators,
  MakeCreateRecordSagaConfig,
  MakeFetchRecordSagaConfig,
  MakeFetchRecordsSagaConfig,
  UpdateRecordActionCreators,
} from '../request'

const makeFetchRecordsSaga = (
  actions: FetchRecordsActionCreators,
  config?: MakeFetchRecordsSagaConfig
) =>
  requestFactory.makeFetchRecordsSaga(
    actions,
    apiRequest.fetchRecords,
    {
      ...config,
      runRequest(run, { payload }) {
        return run(payload)
      },
    })

const makeFetchRecordSaga = (
  actions: FetchRecordActionCreators,
  config?: MakeFetchRecordSagaConfig
) =>
  requestFactory.makeFetchRecordSaga(
    actions,
    apiRequest.fetchRecord,
    {
      runRequest(run, { payload }) {
        return run(payload.id, payload)
      },
      ...config,
    }
  )

const makeCreateRecordSaga = (
  actions: CreateRecordActionCreators,
  config?: MakeCreateRecordSagaConfig
) =>
  requestFactory.makeCreateRecordSaga(
    actions,
    apiRequest.createRecord,
    {
      runRequest(run, { payload }) {
        return run(payload)
      },
      ...config,
    }
  )

const makeUpdateRecordSaga = (actions: UpdateRecordActionCreators) =>
  requestFactory.makeUpdateRecordSaga(
    actions,
    apiRequest.updateRecord,
    {
      runRequest(run, { payload }) {
        return run(payload.id, payload)
      },
    }
  )

const makeDeleteRecordSaga = (actions: DeleteRecordActionCreators) =>
  requestFactory.makeDeleteRecordSaga(
    actions,
    apiRequest.deleteRecord,
    {
      runRequest(run, { payload }) {
        return run(payload.id)
      },
    }
  )

export default {
  makeDeleteRecordSaga,
  makeUpdateRecordSaga,
  makeCreateRecordSaga,
  makeFetchRecordSaga,
  makeFetchRecordsSaga,
}
