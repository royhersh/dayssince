import React from 'react';
// import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
// import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import api from '../utils/api';
import { App } from '../App';

require('jest-localstorage-mock');

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

jest.mock('../utils/api');
Enzyme.configure({ adapter: new Adapter() });

const [populateItems, createNewItem] = new Array(2).fill(jest.fn());
const props = {
  populateItems,
  createNewItem,
  location: {
    search: '?token=tokenString',
  },
};

describe('Testing initial data fetch flow', () => {
  it('merge items from localStorage to API when has token in URL', async () => {
    /**
     * If we have token in URL, then:
     * 1. send to API merge request with items in localStorage
     * 2. call populate items with data came back from api
     * 3. set token in localStorage
     * 4. remove items in localStorage
     */
    const dataInLocalStorage = 'some data';
    localStorage.setItem('items', JSON.stringify(dataInLocalStorage));
    api.POST.mergeItems.mockImplementation(async () => 'merged data');

    await shallow(<App {...props} />);
    await flushPromises();

    expect(api.POST.mergeItems.mock.calls[0][0]).toEqual(dataInLocalStorage);
    expect(populateItems.mock.calls[0][0]).toEqual('merged data');
    expect(localStorage.setItem).toHaveBeenLastCalledWith('token', 'tokenString');
    expect(localStorage.removeItem).toHaveBeenLastCalledWith('items');
  });
});
