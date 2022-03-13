import React, { useCallback } from 'react';

import {
  useRecords,
  useRecord,
  useCreateRecord,
  useUpdateRecord,
  useDeleteRecord,
} from './@hooks'

import logo from '../logo.svg';
import '../App.css';

function App() {
  // const [arrayWithRecords, fetchRecords] = useRecords()
  const [dataRecord, fetchRecord] = useRecord()
  const [, createRecord] = useCreateRecord()
  const [, updateRecord] = useUpdateRecord()
  const [, deleteRecord] = useDeleteRecord()

  const handleCreateRecord = useCallback(() => {
    const data = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
    createRecord(data)
  }, [createRecord])

  const handleUpdateRecord = useCallback(() => {
    const data = {
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1,
    }
    updateRecord(data)
  }, [updateRecord])

  const handleDeleteRecordById = useCallback(() => {
    deleteRecord(1)
  }, [deleteRecord])

  const handleFetchRecordById = useCallback(() => {
    fetchRecord(1)
  }, [fetchRecord])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleDeleteRecordById}>
          do some action
        </button>
      </header>
    </div>
  );
}

export default App;
