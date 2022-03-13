import { useMemo, useRef } from 'react'
import debounce from 'awesome-debounce-promise'
import { Action } from 'redux'
import { Selector, useDispatch, useSelector } from 'react-redux'
import { usePromise } from 'react-use'

import { Prelude } from '../typedefs'

export type Meta = {}

export type Fetcher<Payload extends any[], Res> = {
  (...args: Payload): Promise<Res | null>
}

export type UseAPIRequest<D, Payload extends any[], Res> = [D, Fetcher<Payload, Res>, Meta]

export type UseAPIRequestOptions = {
  debounce?: Prelude.MaybeNil<number>
}

function useAPIRequest<D, Payload extends any[], Res = any>(
  actionCreator: (...args: Payload) => Action | null | undefined,
  selector: Selector<any, D>,
  options: UseAPIRequestOptions = {}
) {
  const { debounce: debounceTimeout = null } = options
  const { current: isDebounced } = useRef(debounceTimeout != null)
  const dispatch = useDispatch()
  const mounted = usePromise()
  const data = useSelector<any, D>(selector)
  const { current: meta } = useRef<Meta>({})

  const actionCreatorRef = useRef(actionCreator)
  actionCreatorRef.current = actionCreator

  const runRequest = useMemo(() => {
    const fn = async (...args: Payload): Promise<Res | null> => {
      const action = actionCreatorRef.current(...args)
      const res = action == null ? null : ((dispatch(action) as any) as Res)

      return mounted(Promise.resolve(res))
    }

    return isDebounced ? debounce(fn, debounceTimeout as number) : fn
  }, [debounceTimeout, dispatch, isDebounced, mounted])

  return [data, runRequest, meta] as UseAPIRequest<D, Payload, Res>
}

export default useAPIRequest
