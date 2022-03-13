import { all, fork } from 'redux-saga/effects'

import { example } from '../../redux/saga/factories/domains'

import { actions } from '../@reducer'

const watchAndFetchRecords = example.makeFetchRecordsSaga({
  fetchRecords: actions.fetchRecords,
  fetchRecordsSuccess: actions.fetchRecordsSuccess,
  fetchRecordsFailure: actions.fetchRecordsFailure,
})

const watchAndFetchRecord = example.makeFetchRecordSaga(actions)

const watchAndCreateRecord = example.makeCreateRecordSaga(actions)

const watchAndUpdateRecord = example.makeUpdateRecordSaga(actions)

const watchAndDeleteRecord = example.makeDeleteRecordSaga(actions)

export default function* main() {
  yield all(
    [
      watchAndUpdateRecord,
      watchAndCreateRecord,
      watchAndFetchRecord,
      watchAndFetchRecords,
      watchAndDeleteRecord,
    ].map(fork)
  )
}
