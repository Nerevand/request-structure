import * as R from 'ramda'
import { isNotFunction, isNotObj } from 'ramda-adjunct'
import { Action as BaseAction, ActionFromReducersMapObject, Reducer } from 'redux'

import { DebuggingModules } from '../../invariants'
import { isDebug } from '../../helpers'

import { Action } from './createAction'

export type CaseReducer<S, A extends Action> = (state: S, action: A) => S

export type CaseReducers<S> = {
  [K in string]: CaseReducer<S, Action & BaseAction<K>>
}

export type CombinedReducerOptions = {
  checkCasesShape?: boolean
}

export type CombinedReducer<S> = Reducer<S, Action<keyof CaseReducers<S>>> & {
  cases: CaseReducers<S>
  initialState: S
}

function runCasesShapeCheck<S>(cases: CaseReducers<S>): void {
  if (isNotObj(cases)) {
    throw new Error('Cases must be a dict')
  }

  const invalidActionTypes = ['', 'undefined', 'null']
  R.forEachObjIndexed((reducer, actionType) => {
    if (R.includes(actionType, invalidActionTypes as (keyof CaseReducers<S>)[])) {
      console.log(cases)
      throw new TypeError(`Incorrect actionType "${actionType}"`)
    }

    if (isNotFunction(reducer)) {
      throw new TypeError(
        `Case reducer must be a function.` +
        `But the reducer for "${actionType}" is "${typeof reducer}"`
      )
    }
  }, cases)
}

export default function createReducer<S>(
  cases: CaseReducers<S>,
  initialState: S,
  options: CombinedReducerOptions = {}
): CombinedReducer<S> {
  const { checkCasesShape = isDebug(DebuggingModules.REDUX) } = options
  if (checkCasesShape) {
    runCasesShapeCheck(cases)
  }

  const reducer: CombinedReducer<S> = (
    state: S | undefined = initialState,
    action: ActionFromReducersMapObject<CaseReducers<S>>
  ): S => {
    const leaf = cases[action.type]
    return leaf ? leaf(state, action) : state
  }

  reducer.initialState = initialState
  reducer.cases = cases

  return reducer
}
