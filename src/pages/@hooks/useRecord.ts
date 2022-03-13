import { createSelector } from 'reselect'

import { useAPIRequest } from '../../hooks'

import { actions, selectors } from '../@reducer'


const selector = createSelector(selectors.root, (state): any => state.record)

function useRecord() {
  return useAPIRequest((id: number) => actions.fetchRecord({ id }), selector)
}

export default useRecord
