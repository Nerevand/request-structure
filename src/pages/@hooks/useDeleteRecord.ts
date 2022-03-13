import { createSelector } from 'reselect'

import { useAPIRequest } from '../../hooks'

import { actions, selectors } from '../@reducer'

const selector = createSelector(selectors.root, state => state.deleteRecord)

function useDeleteRecord() {
  return useAPIRequest(id => actions.deleteRecord({ id }), selector)
}

export default useDeleteRecord
