import { createSelector } from 'reselect'

import { useAPIRequest } from '../../hooks'

import { actions, selectors } from '../@reducer'


const selector = createSelector(selectors.root, (state): any => state.createRecord)

function useCreateRecord() {
  return useAPIRequest((data: any) => actions.createRecord(data), selector)
}

export default useCreateRecord
