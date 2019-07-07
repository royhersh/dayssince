import axios from 'axios';

const API_PREFIX = '/dayssince/api/';

const setAuthToken = () => {
  const userToken = localStorage.getItem('token');
  axios.defaults.headers.common.Authorization = userToken;
};

const copy_idToId = items => items.map(item => ({ ...item, id: item._id }));
// GET
const getItems = async () => {
  setAuthToken();
  const { data } = await axios.get(`${API_PREFIX}items`);
  return copy_idToId(data);
};

// POST
const mergeItems = async (items) => {
  setAuthToken();
  const { data } = await axios.post(`${API_PREFIX}items/merge`, items);
  return copy_idToId(data);
};

// POST
const createItem = async ({ date, title }) => {
  setAuthToken();
  const { data } = await axios.post(`${API_PREFIX}items/`, { date, title });
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
};
