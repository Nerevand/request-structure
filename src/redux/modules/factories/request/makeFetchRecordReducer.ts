import { Action, ActionCreator, createReducer } from '../../../helpers'

export type FetchRecordActions<
  T = any,
  Options = any,
  E = any
  > = {
    fetchRecord: ActionCreator<Options>
    fetchRecordSuccess: ActionCreator<T>
    fetchRecordFailure: ActionCreator<E[]>
    reset?: ActionCreator
  }

export type FetchRecordState<T = any, E = any> = {
  data: T
  errors: E[]
  initial: boolean
  inProgress: boolean
}

const initialState: FetchRecordState = {
  data: {},
  errors: [],
  initial: true,
  inProgress: false,
}

function makeFetchRecordReducer<
  T,
  Options = any,
  E = any
>(actions: FetchRecordActions<Options, T, E>) {
  return createReducer<FetchRecordState>(
    {
      [actions.fetchRecord](state) {
        return { ...state, inProgress: true }
      },
      [actions.fetchRecordSuccess](state, { payload }: Action<T>) {
        return {
          ...state,
          errors: [],
          inProgress: false,
          initial: false,
          data: payload,
        }
      },
      [actions.fetchRecordFailure](state, { payload }: Action<E[]>) {
        return {
          ...state,
          errors: payload,
          inProgress: false,
          data: {},
        }
      },
      [actions.reset || Symbol()]() {
        return initialState
      },
    },
    initialState
  )
}

export default makeFetchRecordReducer
