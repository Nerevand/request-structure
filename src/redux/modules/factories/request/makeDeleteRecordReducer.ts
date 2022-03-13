import { Action, ActionCreator, createReducer } from '../../..//helpers'

export type DeleteRecordActions<
  T = any,
  Options = any,
  E = any
  > = {
    deleteRecord: ActionCreator<Options>
    deleteRecordSuccess: ActionCreator<T>
    deleteRecordFailure: ActionCreator<E[]>
    reset?: ActionCreator
  }

export type DeleteRecordState<T = any, E = any> = {
  data: T
  errors: E[]
  inProgress: boolean
}

const initialState: DeleteRecordState = {
  data: {},
  errors: [],
  inProgress: false,
}

function makeDeleteRecordReducer<
  T,
  Options = any,
  E = any
>(actions: DeleteRecordActions<T, Options, E>) {
  return createReducer<DeleteRecordState>(
    {
      [actions.deleteRecord](state) {
        return {
          ...state,
          inProgress: true,
        }
      },
      [actions.deleteRecordSuccess](state, { payload }: Action<T>) {
        return {
          ...state,
          data: payload,
          errors: [],
          inProgress: false,
        }
      },
      [actions.deleteRecordFailure](state, { payload }: Action<E[]>) {
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

export default makeDeleteRecordReducer
