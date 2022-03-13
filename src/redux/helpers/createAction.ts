import * as R from 'ramda'
import { isArray } from 'ramda-adjunct'
import { Action as BaseAction } from 'redux'

import { isDebug } from '../../helpers'
import { DebuggingModules } from '../../invariants'

export type BaseMeta = {
  thunk: boolean
}

export type Action<TPayload = any, TMeta extends BaseMeta = BaseMeta> = BaseAction<string> & {
  error: boolean
  meta: TMeta
  payload: TPayload
}

export type PayloadCreator<TPayload, D = any> = {
  (data?: D): TPayload
}

export type MetaCreator<TPayload, TMeta extends BaseMeta> = {
  (params: { meta: Partial<TMeta>; payload: TPayload }): TMeta
}

export type ErrorChecker<TPayload> = {
  (payload: TPayload): boolean
}

export type ActionCreatorConfig<TPayload, TMeta extends BaseMeta> = {
  payloadCreator: PayloadCreator<TPayload>
  metaCreator: MetaCreator<TPayload, TMeta>
  errorChecker: ErrorChecker<TPayload>
  thunk: boolean
  checkRegister: boolean
}

export type ActionCreatorFactoryConfig<
  TPayload = any,
  TMeta extends BaseMeta = BaseMeta
  > = ActionCreatorConfig<TPayload, TMeta> & {
    separator: string
  }

export type ActionCreator<TPayload = any, TMeta extends BaseMeta = BaseMeta> = {
  (payload?: TPayload, meta?: Partial<TMeta>): Action<TPayload, TMeta>
  sync(payload?: TPayload, meta?: Partial<TMeta>): Action<TPayload, TMeta>
  getType(): string
  toString(): string
} & string

export type ActionCreatorFactory<TPayload, TMeta extends BaseMeta> = {
  (type: string, params?: Partial<ActionCreatorFactoryConfig<TPayload, TMeta>>): ActionCreator<
    TPayload,
    TMeta
  >
  sync(
    type: string,
    params?: Partial<ActionCreatorFactoryConfig<TPayload, TMeta>>
  ): ActionCreator<TPayload, TMeta>
}

const actionsRegister = new Map<string, boolean>()

function defaultMetaCreator<TPayload, TMeta>(params: {
  meta: Partial<TMeta>
  payload: TPayload
}): TMeta {
  return params.meta as any
}

function defaultErrorChecker<TPayload>(payload: TPayload): boolean {
  const errObj = isArray(payload) ? R.head(payload) : payload
  return errObj instanceof Error
}

export function createAction<TPayload = any, TMeta extends BaseMeta = any>(
  type: string,
  {
    payloadCreator = R.identity,
    metaCreator = defaultMetaCreator,
    errorChecker = defaultErrorChecker,
    thunk = true,
    checkRegister = isDebug(DebuggingModules.REDUX),
  }: Partial<ActionCreatorConfig<TPayload, TMeta>> = {}
): ActionCreator<TPayload, TMeta> {
  if (checkRegister && actionsRegister.has(type)) {
    console.error(`Action creator with type ${type} was initialized`)
  }

  actionsRegister.set(type, true)

  const baseMeta: BaseMeta = { thunk }

  const actionCreator = (data?: TPayload, userMeta?: Partial<TMeta>): Action<TPayload, TMeta> => {
    const payload = payloadCreator(data)
    const meta = metaCreator({ meta: { ...baseMeta, ...userMeta } as Partial<TMeta>, payload })
    const error = errorChecker(payload)

    return { type, payload, error, meta } as Action<TPayload, TMeta>
  }

  actionCreator.getType = () => type
  actionCreator.toString = () => actionCreator.getType()
  actionCreator.sync = (data: TPayload, meta: TMeta): Action<TPayload, TMeta> =>
    actionCreator(data, { ...meta, thunk: false })

  return actionCreator as ActionCreator<TPayload, TMeta>
}

const actionCreatorsRegister = new Map()

export function createActionCreator<TPayload = any, TMeta extends BaseMeta = any>(
  namespace: string = '',
  {
    checkRegister = isDebug(DebuggingModules.REDUX),
    separator = '/',
    thunk = true,
    ...restFactoryParams
  }: Partial<ActionCreatorFactoryConfig<TPayload, TMeta>> = {}
): ActionCreatorFactory<TPayload, TMeta> {
  const prefix = R.concat(namespace, separator)

  if (checkRegister && actionCreatorsRegister.has(prefix)) {
    console.warn(`ActionCreator with namespace ${prefix} was initialized`)
  }

  actionCreatorsRegister.set(prefix, true)

  const creator = (
    type: string,
    params?: Partial<ActionCreatorFactoryConfig<TPayload, TMeta>>
  ): ActionCreator<TPayload, TMeta> => {
    const extendedType = R.concat(prefix, type)
    return createAction<TPayload, TMeta>(extendedType, {
      thunk,
      checkRegister,
      ...restFactoryParams,
      ...params,
    })
  }

  creator.sync = (type: string, meta?: Partial<TMeta>): ActionCreator<TPayload, TMeta> =>
    creator(type, { ...meta, thunk: false })

  return creator
}
