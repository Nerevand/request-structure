import { Action, ActionCreator, createReducer } from '../../..//helpers'

export type UpdateRecordActions<
  T = any,
  Options = any,
  E = any
  > = {
    updateRecord: ActionCreator<Options>
    updateRecordSuccess: ActionCreator<T>
    updateRecordFailure: ActionCreator<E[]>
    reset?: ActionCreator
  }

export type UpdateRecordState<T = any, E = any> = {
  data: T
  errors: E[]
  inProgress: boolean
}

const initialState: UpdateRecordState = {
  data: {},
  errors: [],
  inProgress: false,
}

function makeUpdateRecordReducer<
  T,
  Options = any,
  E = any
>(actions: UpdateRecordActions<T, Options, E>) {
  return createReducer<UpdateRecordState>(
    {
      [actions.updateRecord](state) {
        return {
          ...state,
          inProgress: true,
        }
      },
      [actions.updateRecordSuccess](state, { payload }: Action<T>) {
        return {
          ...state,
          data: payload,
          errors: [],
          inProgress: false,
        }
      },
      [actions.updateRecordFailure](state, { payload }: Action<E[]>) {
        return {
          ...state,
          inProgress: false,
          errors: payload,
        }
      },
      [actions.reset || Symbol()]() {
        return initialState
      },
    },
    initialState
  )
}

export default makeUpdateRecordReducer
