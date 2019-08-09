import React from 'react';
// import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
// import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import api from '../utils/api';
import { App } from '../App';

require('jest-localstorage-mock');

jest.mock('../utils/api');
Enzyme.configure({ adapter: new Adapter() });

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

describe('Testing initial data fetch flow', () => {
  let props;
  let populateItems;
  let createNewItem;

  beforeEach(() => {
    [populateItems, createNewItem] = new Array(2).fill(jest.fn());

    props = {
      populateItems,
      createNewItem,
      location: {
        search: '',
      },
    };

    localStorage.clear();
  });

  afterEach(() => {
    // populateItems.mockClear();
  });

  it('merge items from localStorage to API when has token in URL and populate merged data', async () => {
    /**
     * If we have token in URL, then:
     * 1. send to API merge request with items in localStorage
     * 2. call populate items with data came back from api
     * 3. set token in localStorage
     * 4. remove items in localStorage
     */
    const dataInLocalStorage = 'data in localStorage';
    localStorage.setItem('items', JSON.stringify(dataInLocalStorage));
    api.POST.mergeItems.mockImplementation(async () => 'merged data');

    await shallow(
      <App
        {...props}
        location={{
          search: '?token=tokenString',
        }}
      />,
    );
    await flushPromises();

    expect(api.POST.mergeItems.mock.calls[0][0]).toEqual(dataInLocalStorage);
    expect(populateItems.mock.calls[0][0]).toEqual('merged data');
    expect(localStorage.setItem).toHaveBeenLastCalledWith('token', 'tokenString');
    expect(localStorage.removeItem).toHaveBeenLastCalledWith('items');
  });

  it("populate data from API when there's token in localStorage", async () => {
    localStorage.setItem('token', 'token exist in localStorage');
    api.GET.items.mockImplementation(async () => 'data from API');

    await shallow(<App {...props} />);
    await flushPromises();
    expect(populateItems.mock.calls[0][0]).toEqual('data from API');
  });

  it("populate data from localStorage when there's no token", async () => {
    const dataInLocalStorage = 'data in localStorage';
    localStorage.setItem('items', JSON.stringify(dataInLocalStorage));

    await shallow(<App {...props} />);
    await flushPromises();
    expect(populateItems.mock.calls[0][0]).toEqual('data in localStorage');
  });
});
