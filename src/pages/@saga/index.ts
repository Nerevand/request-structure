import { all, fork } from 'redux-saga/effects'

import example from './example'

export default function* root() {
  yield all([example].map(fork))
}
