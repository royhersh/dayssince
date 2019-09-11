import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';
import axios from 'axios';
import { SSL_OP_NO_TICKET } from 'constants';
import generateStore from '../store';

import { ConnectedApp } from '../index';

jest.mock('axios');
// const root = document.createElement('div');
// root.setAttribute('id', 'root');

// global.window.document.body.appendChild(root);

Enzyme.configure({ adapter: new Adapter() });

function tick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function functionalityFactory(wrapper) {
  return {
    addItem: (title) => {
      wrapper.find('.add-button').simulate('click');
      wrapper.find('input.item-info__title').simulate('change', { target: { value: title } });
      // await tick();
      wrapper.find('#overlay').simulate('click');
      // await tick();
    },
    enterEditMode: (title) => {
      wrapper.find(`DaysSinceItem[title="${title}"]`).simulate('click');
    },
    changeTitle: (newTitle) => {
      wrapper.find('input.item-info__title').simulate('change', { target: { value: newTitle } });
    },
    changeDate: (newDate) => {
      wrapper
        .find('input.item-form__date__input')
        .simulate('change', { target: { value: newDate } });
    },
    clickCancel: () => wrapper.find('.item--edit .icon--cancel').simulate('click'),
    clickDelete: () => wrapper.find('.item--edit .icon--delete').simulate('click'),
    clickOverlay: () => wrapper.find('#overlay').simulate('click'),
  };
}

describe.each`
  userToken
  ${null}
  ${'testToken'}
`('End to end tests, user token:$userToken', async ({ userToken }) => {
  let wrapper;
  let userActions;
  let root;
  let testingStore;

  beforeEach(() => {
    root = document.createElement('div');
    root.setAttribute('id', 'root');

    global.window.document.body.appendChild(root);

    localStorage.clear();
    if (userToken) localStorage.setItem('token', userToken);

    global.testingStore = generateStore();
    wrapper = mount(<ConnectedApp testingStore={global.testingStore} />, {
      attachTo: document.getElementById('root'),
    });
    userActions = functionalityFactory(wrapper);
  });

  afterEach(() => {
    wrapper.unmount();
    global.window.document.body.removeChild(root);
    root = null;
  });

  it('add 1 item', () => {
    // axios.post.mockImplementationOnce(() => Promise.resolve({ data: { _id: 'idFromDb_001', title: '' } }));
    // axios.put.mockImplementationOnce(() => Promise.resolve({ data: { _id: 'idFromDb_001', title: 'title test 1' } }));
    userActions.addItem('title test 1');

    // await tick();

    expect(wrapper.find('DaysSinceItem')).toHaveLength(1);
    expect(wrapper.find('div.item-info__title').text()).toBe('title test 1');
    expect(wrapper.find('.item-info__counter').text()).toBe('0');
  });

  it('add 2 items', () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: { _id: 'idFromDb_001' } }));
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: { _id: 'idFromDb_002' } }));
    axios.put.mockImplementation(() => Promise.resolve({ data: {} }));
    userActions.addItem('title test 1');
    userActions.addItem('title test 2');

    expect(wrapper.find('DaysSinceItem')).toHaveLength(2);
  });

  it('update item', () => {
    const twoDaysAgo = moment(Date.now())
      .subtract(2, 'days')
      .format('YYYY-MM-DD');

    userActions.addItem('title test 1');
    userActions.enterEditMode('title test 1');
    userActions.changeTitle('updated title');
    userActions.changeDate(twoDaysAgo);

    userActions.clickOverlay(); // Save

    expect(wrapper.find('div.item-info__title').text()).toBe('updated title');
    expect(wrapper.find('.item-info__counter').text()).toBe('2');
  });

  it('cancel editing item', () => {
    const twoDaysAgo = moment(Date.now())
      .subtract(2, 'days')
      .format('YYYY-MM-DD');

    userActions.addItem('title test 1');
    userActions.enterEditMode('title test 1');
    userActions.changeTitle('updated title');
    userActions.changeDate(twoDaysAgo);

    userActions.clickCancel();

    expect(wrapper.find('div.item-info__title').text()).toBe('title test 1');
    expect(wrapper.find('.item-info__counter').text()).toBe('0');
  });

  it('delete item', () => {
    jest.useFakeTimers();

    userActions.addItem('title test 1');
    userActions.addItem('title test 2');
    userActions.enterEditMode('title test 1');
    userActions.clickDelete();

    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('DaysSinceItem').length).toBe(1);
    expect(wrapper.find('DaysSinceItem[title="title test 1"]').length).toBe(0);
  });
});
