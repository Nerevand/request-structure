import { combineReducers } from 'redux'

import { example } from '../../redux/modules/factories/domains'

import actions from './actions'

export default combineReducers({
  records: example.makeFetchRecordsReducer({
    fetchRecords: actions.fetchRecords,
    fetchRecordsSuccess: actions.fetchRecordsSuccess,
    fetchRecordsFailure: actions.fetchRecordsFailure,
  }),
  // or short version
  // departments: departments.makeFetchRecordsReducer({actions}),
  record: example.makeFetchRecordReducer(actions),

  createRecord: example.makeCreateRecordReducer(actions),

  updateRecord: example.makeUpdateRecordReducer(actions),

  deleteRecord: example.makeDeleteRecordReducer(actions),
})
