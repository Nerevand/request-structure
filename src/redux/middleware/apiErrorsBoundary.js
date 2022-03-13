
const apiErrorsBoundary = () => next => action => {
  const rv = next(action)

  if (rv instanceof Promise) {
    rv.catch(e => {
      console.error(e)
      throw e
    })
  }

  return rv
}

export default apiErrorsBoundary
