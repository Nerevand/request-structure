import * as R from 'ramda'
import { isArray } from 'ramda-adjunct'

import { Action, ActionCreator, createReducer } from '../../../../redux/helpers'
import { makeOrderFilter } from '../../../../helpers'
import { Prelude } from '../../../../typedefs'

export type FetchPaginatedRecordStateMeta = {
  limit: number | null
  offset: number
} & Record<string, any>

export type FetchPaginatedRecordsActions<
  T = any,
  Options = any,
  E = any,
  Resp = any
  > = {
    fetchRecords: ActionCreator<Options>
    fetchRecordsFailure: ActionCreator<E[]>
    fetchRecordsSuccess: ActionCreator<Resp>
    reset?: ActionCreator
    updateMeta?: ActionCreator<Partial<FetchPaginatedRecordStateMeta>>
    updateRecords?: ActionCreator<Partial<T>[]>
  }

export type FetchPaginatedRecordsState<
  T = any,
  E = any
  > = {
    count: number
    errors: E[]
    exist: boolean
    initial: boolean
    inProgress: boolean
    meta: FetchPaginatedRecordStateMeta
    records: T[]
  }

export type FetchPaginatedRecordsConfig<
  T = any,
  E = any,
  Resp = any
  > = {
    getRecordId?: (record: Partial<T>) => string | number
    ordering?: null | keyof T
    countFieldName?: keyof Resp
    limit?: Prelude.MaybeNil<number>
    resultsFieldName?: keyof Resp
    mergeRequestPayload?: (props: {
      nextState: FetchPaginatedRecordsState<T, E>
      payload: Resp
      state: FetchPaginatedRecordsState<T, E>
    }) => FetchPaginatedRecordsState<T, E>
  }

/*
 * offset must be less than count of records
 * offset must be divided evenly by limit
 * offset must be greater than 0
 */
function normalizePagination<T, E = any>(
  state: FetchPaginatedRecordsState<T, E>
): FetchPaginatedRecordsState<T, E> {
  const { count, meta } = state
  const stateLimit = meta.limit ?? 0
  const offset = R.or(
    Math.max(0, Math.floor(Math.min(count - 1, meta.offset) / stateLimit) * stateLimit),
    0
  )

  return offset === meta.offset ? state : R.assocPath(['meta', 'offset'], offset, state)
}

function getInitialState<T, E = any>(
  limit: number | null
): FetchPaginatedRecordsState<T, E> {
  return {
    count: 0,
    errors: [],
    exist: false,
    initial: true,
    inProgress: false,
    meta: { limit, offset: 0 },
    records: [],
  }
}

function makeFetchPaginatedRecordsReducer<
  T,
  Options = any,
  E = any,
  Resp = any
>(
  actions: FetchPaginatedRecordsActions<T, Options, E, Resp>,
  config: FetchPaginatedRecordsConfig<T, E, Resp> = {}
) {
  const {
    countFieldName = 'count',
    getRecordId = R.propOr(null, 'id'),
    limit = null,
    mergeRequestPayload = null,
    ordering = null,
    resultsFieldName = 'results',
  } = config

  const orderFilter = makeOrderFilter(ordering as string)
  const baseInitialState: FetchPaginatedRecordsState<T, E> = getInitialState(limit)
  const initialState: FetchPaginatedRecordsState<T, E> = mergeRequestPayload
    ? mergeRequestPayload({
      state: baseInitialState,
      nextState: baseInitialState,
      payload: {} as Resp,
    })
    : baseInitialState

  return createReducer<FetchPaginatedRecordsState<any, any>>(
    {
      [actions.fetchRecords](state) {
        return {
          ...state,
          inProgress: true,
        }
      },

      [actions.fetchRecordsSuccess](state, { payload }: any) {
        const payloadRecords = isArray(payload) ? payload : payload[resultsFieldName as keyof Resp]
        const records: T[] = orderFilter((payloadRecords || []) as T[])
        const count: number = R.propOr(R.length(records), countFieldName as string, payload)
        const exist: boolean = R.propOr(Boolean(count), 'exist', payload)

        const nextState = normalizePagination({
          ...state,
          count: count,
          errors: [],
          exist: exist,
          initial: false,
          inProgress: false,
          records: records,
        })

        return mergeRequestPayload ? mergeRequestPayload({ state, nextState, payload }) : nextState
      },

      [actions.fetchRecordsFailure](state, { payload }: Action<E[]>) {
        return normalizePagination({
          ...state,
          count: 0,
          errors: payload,
          exist: false,
          inProgress: false,
          records: [],
        })
      },

      [actions.updateRecords || Symbol()]: (state: any, { payload: updates }: Action<Partial<T>[]>) => {
        const records = [...state.records]

          ; (updates || []).forEach(recordUpdates => {
            const id = getRecordId(recordUpdates)
            const idx = records.findIndex(record => getRecordId(record) === id)
            if (idx < 0) {
              return
            }
            records[idx] = { ...records[idx], ...recordUpdates }
          })

        return { ...state, records }
      },

      [actions.updateMeta || Symbol()]: (
        state: any,
        { payload = {} }: Action<Partial<FetchPaginatedRecordStateMeta>>
      ) => {
        return normalizePagination({
          ...state,
          meta: {
            ...state.meta,
            ...payload,
          },
        })
      },

      [actions.reset || Symbol()]() {
        return initialState
      },
    },
    initialState
  )
}

export default makeFetchPaginatedRecordsReducer
