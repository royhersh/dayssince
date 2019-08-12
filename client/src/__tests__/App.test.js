import React from 'react';
// import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
// import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import api from '../utils/api';
import { App, mapStateToProps } from '../App';
import DaysSinceItem from '../components/daysSinceItem';

require('jest-localstorage-mock');

jest.mock('../utils/api');
Enzyme.configure({ adapter: new Adapter() });

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}
describe('<App />', () => {
  it('Test mapStateToProps', () => {
    const stateToProps = mapStateToProps({
      items: 'items',
      ui: { showPlusButton: 'showPlusButton' },
    });

    expect(stateToProps.items).toBe('items');
    expect(stateToProps.showPlusButton).toBe('showPlusButton');
  });
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

    it('merge items from localStorage to API when URL has token and populate merged data', async () => {
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

  describe('Test rendering and behaviour', () => {
    let props;
    let populateItems;
    let createNewItem;
    const dummyItems = [
      {
        renderId: 1565002595737,
        date: 1565002595737,
        editMode: false,
        title: 'Task Two',
      },
      {
        renderId: 1565002586680,
        date: 1565002586680,
        editMode: false,
        title: 'Task one',
      },
    ];
    beforeEach(() => {
      [populateItems, createNewItem] = new Array(2).fill().map(() => jest.fn());

      props = {
        populateItems,
        createNewItem,
        location: {
          search: '',
        },
        items: dummyItems,
      };
    });

    it('renders <DaysSince /> items', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();
      const DaysSinceElements = wrapper.find('Connect(DaysSinceItem)');

      expect(DaysSinceElements).toHaveLength(dummyItems.length);
    });

    it('renders modal', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();

      const modal = wrapper.find('#modal');
      expect(modal.exists()).toBe(true);
    });

    it('render plus button ', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();
      console.log(wrapper.debug());
      const plusButton = wrapper.find('.add-button');

      expect(plusButton.exists()).toBe(true);
      expect(plusButton.text()).toBe('+');
    });

    it('clicking plus button invokes handler', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();

      const plusButton = wrapper.find('.add-button');

      plusButton.simulate('click');
      expect(createNewItem.mock.calls).toHaveLength(1);
    });

    it('plus button is visible by default ', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();

      const plusButton = wrapper.find('.add-button');
      expect(plusButton.hasClass('add-button--hidden')).toBe(false);
    });

    it('plus button is invisible when shopPlustButton prop is false', async () => {
      const wrapper = await shallow(<App {...props} showPlusButton={false} />);
      await flushPromises();

      const plusButton = wrapper.find('.add-button');
      expect(plusButton.hasClass('add-button--hidden')).toBe(true);
    });

    it('user icon is greyed out when no user is logged in', async () => {
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();

      const footer = wrapper.find('.footer i');
      expect(footer.hasClass('fa-user-slash')).toBe(true);
      expect(footer.hasClass('fa-user')).toBe(false);
    });

    it('user icon is greyed out when no user is logged in', async () => {
      localStorage.setItem('token', 'token exist in localStorage');
      const wrapper = await shallow(<App {...props} />);
      await flushPromises();

      const footer = wrapper.find('.footer i');
      expect(footer.hasClass('fa-user-slash')).toBe(false);
      expect(footer.hasClass('fa-user')).toBe(true);
    });
  });
});
