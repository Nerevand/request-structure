import { createSelector } from 'reselect'

import { useAPIRequest } from '../../hooks'

import { actions, selectors } from '../@reducer'

const selector = createSelector(selectors.root, (state): any => state.updateRecord)

function useUpdateRecord() {
  return useAPIRequest((data: any) => actions.updateRecord(data), selector)
}

export default useUpdateRecord
