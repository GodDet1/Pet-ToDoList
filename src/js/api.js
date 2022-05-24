import axios from 'axios';

const URL = 'https://628bac69667aea3a3e345810.mockapi.io/api/v1/list/';

async function getList() {
  const response = await axios.get(URL);
  return response.data;
}

async function createItem(obj) {
  return await axios.post(URL, obj);
}

async function deleteItem(id) {
  return await axios.delete(URL + id);
}

async function putItem(id, obj) {
  return await axios.put(URL + id, obj);
}

export { getList, createItem, deleteItem, putItem };
