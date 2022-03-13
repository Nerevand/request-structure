import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import configureStore from '../redux/configureStore'

import App from './App'

const initialState = {}
const store = configureStore(initialState)
store.runSaga()

const AppProvided: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  )
}

export default AppProvided
