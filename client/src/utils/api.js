import axios from 'axios';

const API_PREFIX = '/dayssince/api/';

const setAuthToken = () => {
  const userToken = localStorage.getItem('token');
  axios.defaults.headers.common.Authorization = userToken;
};

const copyIdToRenderId = items => items.map(item => ({ ...item, renderId: item._id }));
// GET
const getItems = async () => {
  setAuthToken();
  const { data } = await axios.get(`${API_PREFIX}items`);
  return copyIdToRenderId(data);
};

// POST
const mergeItems = async (items) => {
  setAuthToken();
  const { data } = await axios.post(`${API_PREFIX}items/merge`, items);
  return copyIdToRenderId(data);
};

// POST
const createItem = async ({ date, title }) => {
  setAuthToken();
  const { data } = await axios.post(`${API_PREFIX}items/`, { date, title });
  return data;
};

// PUT
const updateItem = async ({ id, date, title }) => {
  setAuthToken();
  const { data } = await axios.put(`${API_PREFIX}item/${id}`, { date, title });
  return data;
};

// DELETE
const deleteItem = async (id) => {
  setAuthToken();
  const { data } = await axios.delete(`${API_PREFIX}item/${id}`);
  return data;
};

export default {
  GET: {
    items: getItems,
  },
  POST: {
    mergeItems,
    createItem,
  },
  PUT: {
    updateItem,
  },
  DELETE: {
    deleteItem,
  },
};
