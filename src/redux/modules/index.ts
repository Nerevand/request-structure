import { combineReducers } from 'redux'

import example from '../../pages/@reducer'

const makeRootReducer = () =>
  combineReducers({
    example
  })

export type RootState = ReturnType<ReturnType<typeof makeRootReducer>>

export default makeRootReducer