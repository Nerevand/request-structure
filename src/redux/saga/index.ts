import { all, fork } from 'redux-saga/effects'

import example from '../../pages/@saga'

export default function* root() {
  yield all(
    [
      example
    ].map(fork)
  )
}
