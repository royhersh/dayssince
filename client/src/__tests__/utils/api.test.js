import axios from 'axios';
import api from '../../utils/api';

jest.mock('axios');
describe('Testing API', () => {
  it('merge items in localstorage with items from db', async () => {
    const itemsInLocalStorage = [{ renderId: 'localId', title: 'local' }];
    const itemsReturnedFromDb = [{ _id: 'idFromDb', title: 'title of db item' }];
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: itemsReturnedFromDb }));
    const result = await api.POST.mergeItems(itemsInLocalStorage);
    expect(axios.post).toBeCalledWith('/dayssince/api/items/merge', itemsInLocalStorage);
    expect(result[0].renderId).toBe(itemsReturnedFromDb[0]._id);
  });
});

/* The rest of api.js is being tested in e2e.js */
