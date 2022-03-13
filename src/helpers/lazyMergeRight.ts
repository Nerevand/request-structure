import * as R from 'ramda'
import { isArray, lengthNotEq } from 'ramda-adjunct'

export default (left: any, right: any) => {
  const rightKeys = R.keys(right)

  return R.reduce(
    (acc: any, key: any) => {
      const leftVal = R.prop(key, left)
      const rightVal = R.prop(key, right)

      if (isArray(leftVal) && isArray(rightVal)) {
        if (lengthNotEq(R.length(leftVal), rightVal)) {
          return R.assoc(key, rightVal, acc)
        }

        const sortedLeftVal = R.sortBy(R.identity, leftVal)
        const sortedRightVal = R.sortBy(R.identity, rightVal)
        const newValue = R.equals(sortedLeftVal, sortedRightVal) ? leftVal : rightVal
        return R.assoc(key, newValue, acc)
      }

      const newValue = R.equals(leftVal, rightVal) ? leftVal : rightVal
      return R.assoc(key, newValue, acc)
    },
    R.clone(left),
    rightKeys
  )
}
