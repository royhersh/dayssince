import axios from 'axios';

const API_PREFIX = '/dayssince/api/';

function updateToken() {
  const userToken = localStorage.getItem('token');
  axios.defaults.headers.common.Authorization = userToken;
}

// GET
const getItems = async () => {
  updateToken();
  const { data } = await axios.get(`${API_PREFIX}items`);
  return data;
};

// POST
const mergeItems = async (items) => {
  updateToken();
  const { data } = await axios.post(`${API_PREFIX}items/merge`, items);
  return data;
};

export default {
  GET: {
    items: getItems,
  },
  POST: {
    mergeItems,
  },
};
