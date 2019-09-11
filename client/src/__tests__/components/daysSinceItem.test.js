import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';
import { DaysSinceItem } from '../../components/daysSinceItem';

require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });

describe('<DaysSinceItem />', () => {
  let wrapper;
  let props;
  const now = Date.now();

  beforeEach(() => {
    props = {
      tabIndex: 0,
      renderId: 'renderId',
      title: 'test title',
      date: now,
      setEditMode: jest.fn(),
      unsetEditMode: jest.fn(),
      updateItem: jest.fn(),
      deleteItem: jest.fn(),
    };

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  it('Renders counter and a title ', () => {
    wrapper = shallow(<DaysSinceItem {...props} />);
    // expect(wrapper.state('title')).toBe('test title');
    expect(wrapper.find('.item-info__title').text()).toBe('test title');
    // expect(wrapper.state('date')).toBe(now);
    expect(wrapper.find('.item-info__counter').text()).toBe('0');
  });

  it('on clicking item, invokes set edit mode action with id of item', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode={false} />);
    wrapper.simulate('click');
    expect(props.setEditMode.mock.calls).toHaveLength(1);
    expect(props.setEditMode.mock.calls[0][0]).toBe('renderId');
  });

  it('in edit mode: Item has: Input for title update', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    wrapper.find('input.item-info__title').simulate('change', {
      target: { value: 'hello' },
    });
    expect(wrapper.find('input.item-info__title').exists()).toBe(true);
    expect(wrapper.find('input.item-info__title').props().value).toBe('hello');
  });

  it('in edit mode: Item has: input date', () => {
    const twoDaysAgo = moment(now)
      .subtract(2, 'days')
      .format('YYYY-MM-DD');

    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    wrapper.find('input.item-form__date__input').simulate('change', {
      target: { value: twoDaysAgo },
    });
    expect(wrapper.find('.item-info__counter').text()).toBe('2');
  });

  it('in edit mode: Item in edit mode renders Modal with overlay', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    expect(wrapper.find('Modal').exists()).toBe(true);
    expect(wrapper.find('Modal div').props().id).toBe('overlay');
  });

  it('in edit mode: Clicking on overlay modal unset edit mode', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    wrapper.find('Modal div').simulate('click');

    expect(props.unsetEditMode.mock.calls).toHaveLength(1);
    expect(props.unsetEditMode.mock.calls[0][0]).toBe('renderId');
  });

  it('in edit mode: Clicking on overlay modal invoke updating item action', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    wrapper.find('Modal div').simulate('click');

    expect(props.updateItem.mock.calls).toHaveLength(1);
    expect(props.updateItem.mock.calls[0][0]).toEqual({
      renderId: 'renderId',
      _id: undefined,
      title: 'test title',
      date: now,
    });
  });

  it('in edit mode: click X will exit edit mode without save changes', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode title="initial title" date={now} />);

    wrapper.setState({
      title: 'hello',
      date: now - 10000,
    });

    wrapper.find('.icon--cancel').simulate('click');

    expect(props.updateItem.mock.calls).toHaveLength(0);
    expect(props.unsetEditMode.mock.calls).toHaveLength(1);
    expect(props.unsetEditMode.mock.calls[0][0]).toBe('renderId');
    expect(wrapper.state().title).toBe('initial title');
    expect(wrapper.state().date).toBe(now);
  });

  it('in edit mode: click delete icon removes item', () => {
    wrapper = shallow(<DaysSinceItem {...props} editMode />);
    wrapper.find('.icon--delete').simulate('click');

    expect(props.deleteItem.mock.calls).toHaveLength(1);
    expect(props.deleteItem.mock.calls[0][0]).toBe('renderId');
  });

  it('Element get focus when initiated with edit mode', () => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    document.body.appendChild(root);
    document.body.appendChild(modal);
    wrapper = mount(<DaysSinceItem {...props} editMode />, {
      attachTo: global.document.body.firstChild,
    });
    expect(document.querySelector('.item-info__title')).toEqual(document.activeElement);
  });

  it('test id/renderId mechanism', () => {});
});
