import { createSelector } from 'reselect'

import { useAPIRequest } from '../../hooks'

import { actions, selectors } from '../@reducer'


const selector = createSelector(selectors.root, (state): any => state.records)

function useRecords() {
  return useAPIRequest(options => actions.fetchRecords(options), selector)
}

export default useRecords
