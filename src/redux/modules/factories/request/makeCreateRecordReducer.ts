import { Action, ActionCreator, createReducer } from '../../../helpers'

export type CreateRecordActions<
  T = any,
  Options = any,
  E = any
  > = {
    createRecord: ActionCreator<Options>
    createRecordSuccess: ActionCreator<T>
    createRecordFailure: ActionCreator<E[]>
    reset?: ActionCreator
  }

export type CreateRecordState<T = any, E = any> = {
  data: T
  errors: E[]
  inProgress: boolean
}

const initialState: CreateRecordState = {
  data: {},
  errors: [],
  inProgress: false,
}

function makeCreateRecordReducer<
  T,
  Options = any,
  E = any
>(actions: CreateRecordActions<T, Options, E>) {
  return createReducer<CreateRecordState>(
    {
      [actions.createRecord](state) {
        return {
          ...state,
          inProgress: true,
        }
      },
      [actions.createRecordSuccess](state, { payload }: Action<T>) {
        return {
          ...state,
          data: payload,
          errors: [],
          inProgress: false,
        }
      },
      [actions.createRecordFailure](state, { payload }: Action<E[]>) {
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

export default makeCreateRecordReducer
