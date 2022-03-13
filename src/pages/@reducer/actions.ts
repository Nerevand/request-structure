import { createActionCreator } from '../../redux/helpers'

const createAction = createActionCreator('somePageName')

export default {
  createRecord: createAction('CREATE_RECORD'),
  createRecordSuccess: createAction('CREATE_RECORD_SUCCESS'),
  createRecordFailure: createAction('CREATE_RECORD_FAILURE'),

  updateRecord: createAction('UPDATE_RECORD'),
  updateRecordSuccess: createAction('UPDATE_RECORD_SUCCESS'),
  updateRecordFailure: createAction('UPDATE_RECORD_FAILURE'),

  deleteRecord: createAction('DELETE_RECORD'),
  deleteRecordSuccess: createAction('DELETE_RECORD_SUCCESS'),
  deleteRecordFailure: createAction('DELETE_RECORD_FAILURE'),

  fetchRecords: createAction('FETCH_RECORDS'),
  fetchRecordsSuccess: createAction('FETCH_RECORDS_SUCCESS'),
  fetchRecordsFailure: createAction('FETCH_RECORDS_FAILURE'),

  fetchRecord: createAction('FETCH_RECORD'),
  fetchRecordSuccess: createAction('FETCH_RECORD_SUCCESS'),
  fetchRecordFailure: createAction('FETCH_RECORD_FAILURE'),
}
