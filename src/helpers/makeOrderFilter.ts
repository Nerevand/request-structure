import * as R from 'ramda'

const makeOrderFilter = R.curry(
  <T extends Record<any, any>, K extends keyof T>(sortByProp: K | null, records: T[]): T[] => {
    if (R.isNil(sortByProp)) {
      return records
    }

    return R.sortBy(o => o[sortByProp], records)
  }
)

export default makeOrderFilter
