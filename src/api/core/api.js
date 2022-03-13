import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import MockAdapter from 'axios-mock-adapter'
import * as R from 'ramda'
import { isArray, isFunction, isPlainObj } from 'ramda-adjunct'

import makeAPIError from './makeAPIError'

const BASE_API_URL = 'https://jsonplaceholder.typicode.com/'

if (R.not(BASE_API_URL)) {
  console.error('API_BASE_HOST is not provided')
}

const makeCamelCaseConverter = (params = {}) => data => {
  const needToConvert = isPlainObj(data) || (isArray(data) && data.some(isPlainObj))

  if (params.enable && needToConvert) {
    return R.pipe(R.evolve({ exclude: R.when(isFunction, fn => fn(data)) }), params =>
      camelcaseKeys(data, params)
    )(params)
  }

  return data
}

class BaseAPI {
  static baseConfig = {
    cache: 'no-cache',
    baseURL: BASE_API_URL,
    camelcase: { enable: true, deep: true, exclude: null },
  }

  constructor(withCredentials = true) {
    this.withCredentials = withCredentials
    this.axios = axios.create(BaseAPI.baseConfig)
    this._mock = null
  }

  request(config = {}) {
    const camelCaseConverter = makeCamelCaseConverter(
      R.mergeLeft(config.camelcase, BaseAPI.baseConfig.camelcase)
    )

    return this.axios(this._makeConfig(config))
      .then(res => R.propOr(null, 'data', res))
      .then(camelCaseConverter)
      .catch(req => {

        throw makeAPIError(req)
      })
  }

  get(url, config = {}) {
    return this.request({
      ...config,
      url,
      method: 'get',
    })
  }

  delete(url, config = {}) {
    return this.request({
      ...config,
      url,
      method: 'delete',
    })
  }

  head(url, config = {}) {
    return this.request({
      ...config,
      url,
      method: 'head',
    })
  }

  options(url, config = {}) {
    return this.request({
      ...config,
      url,
      method: 'options',
    })
  }

  post(url, body, config = {}) {
    const data = body || null
    return this.request({
      ...config,
      url,
      data,
      method: 'post',
    })
  }

  put(url, body, config = {}) {
    const data = body || null
    return this.request({
      ...config,
      url,
      data,
      method: 'put',
    })
  }

  patch(url, data = null, config = {}) {
    return this.request({
      ...config,
      url,
      data,
      method: 'patch',
    })
  }

  getUri(config = {}) {
    return this.axios.getUri(this._makeConfig(config))
  }

  get mock() {
    if (this._mock) {
      return this._mock
    }
    return (this._mock = new MockAdapter(this.axios))
  }

  _makeConfig(config) {
    const withCredentials = R.propOr(this.withCredentials, 'withCredentials')

    return R.pipe(
      // R.assocPath(['headers', 'X-Request-ID'], uuidv4()),
      R.when(withCredentials, this._mergeWithCredentials)
    )(config)
  }

  _mergeWithCredentials = config => {
    // return R.assocPath(['headers', 'Authorization'], `Bearer your-token`, config)
    return config
  }
}

export default BaseAPI
