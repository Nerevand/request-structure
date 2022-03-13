import { call } from 'redux-saga/effects'

export default function* callAPI(fn, ...args) {

  while (true) {
    try {
      return yield call(fn, ...args)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
