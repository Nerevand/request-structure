import BaseAPI from '../core/api'

const api = new BaseAPI()

function fetchRecords() {
  return api.get('/posts/')
}

function fetchRecord(id: number) {
  return api.get(`/posts/${id}`)
}

function createRecord(data: any) {
  return api.post(`/posts/`,
    data
  )
}

function updateRecord(id: number, data: any) {
  return api.put(`/posts/${id}`,
    data
  )
}

function deleteRecord(id: number) {
  return api.delete(`/posts/${id}`)
}

export default {
  deleteRecord,
  updateRecord,
  createRecord,
  fetchRecord,
  fetchRecords,
}
