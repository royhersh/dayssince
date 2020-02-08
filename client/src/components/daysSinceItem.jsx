import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import * as actionCreators from '../actions/index';
import Modal from './modal';

export class DaysSinceItem extends Component {
  static daysSinceDate(date) {
    const dayInMs = 86400000;
    return Math.floor((Date.now() - new Date(date).getTime()) / dayInMs);
  }

  constructor(props) {
    super(props);
    this.titleRef = React.createRef();

    this.state = {
      title: props.title || '',
      date: props.date,
      preAnimate: true,
    };
  }

  componentDidMount() {
    this.titleRef.current && this.titleRef.current.focus();
    window.requestAnimationFrame(() => this.setState({ preAnimate: false }));

    // TODO: re-render item tomorrow at 7:00am
    //       hold daysSince in state instead of calculating it on render.
    //       then set a a setTimeout to 7:00 to re calaulate the state and force a re render
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.date !== state.date) {
  //     return { date: props.date };
  //   }
  //   return null;
  // }

  handleDateChange = e => this.setState({ date: new Date(e.target.value).getTime() });

  handleTitleChange = e => this.setState({ title: e.target.value });

  handleClickOverlay = () => {
    const {
      renderId, _id, updateItem, unsetEditMode,
    } = this.props;
    const { title, date } = this.state;
    unsetEditMode(renderId);
    updateItem({
      renderId,
      _id,
      title,
      date,
    });
  };

  handleEnterKey = (e) => {
    if (e.key === 'Enter') this.handleClickOverlay();
  }

  setEditMode = () => {
    const { renderId, setEditMode, editMode } = this.props;
    !editMode && setEditMode(renderId);
  };

  handleCancel = () => {
    const {
      renderId, unsetEditMode, title, date,
    } = this.props;
    this.setState({ date, title });
    unsetEditMode(renderId);
  };

  handleDeleteItem = () => {
    const { _id, renderId, deleteItem } = this.props;
    deleteItem(renderId, _id);
  };


  render() {
    const { editMode, deleteAnimation, tabIndex } = this.props;
    const { title, date, preAnimate } = this.state;
    const daysSinceCounter = DaysSinceItem.daysSinceDate(date);

    const itemStyle = {
      zIndex: Number(editMode),
    };
    const itemClass = classNames('item', {
      'item--edit': editMode,
      'item--pre-animate': preAnimate,
      'item--delete': deleteAnimation,
    });

    return (
      <div
        className={classNames(itemClass)}
        style={itemStyle}
        onClick={this.setEditMode}
        onKeyPress={this.setEditMode}
        tabIndex={tabIndex}
        role="button"
      >
        <div className="item-info">
          <div className="item-info__counter">
            {daysSinceCounter}
            <input
              id="item-form__date__input"
              className="item-form__date__input"
              type="date"
              value={moment(date).format('YYYY-MM-DD')} // This is needed so ios wont reset the date on click
              name="since"
              pseudo="-webkit-date-and-time-value"
              required="required"
              onChange={this.handleDateChange}
            />
          </div>
          {editMode ? (
            <>
              <input
                type="text"
                className="item-info__title"
                ref={this.titleRef}
                value={title}
                onKeyDown={this.handleEnterKey}
                onChange={this.handleTitleChange}
              />
              <Modal>
                <div
                  id="overlay"
                  data-cy="overlay"
                  onClick={this.handleClickOverlay}
                  role="button"
                  onKeyPress={this.handleClickOverlay}
                  tabIndex="-1"
                />
              </Modal>
            </>
          ) : (
              <div className="item-info__title">{title}</div>
            )}
        </div>
        <div className="item-edit">
          <i
            onClick={this.handleCancel}
            onKeyPress={this.handleCancel}
            className="icon icon--cancel fas fa-times"
            role="button"
            tabIndex="0"
          />
          {/*
          <i className="icon far fa-calendar-alt" role="button" tabIndex="0" />
          <i className="icon far fa-calendar-check" role="button" tabIndex="0" />
          */}
          <i
            onClick={this.handleDeleteItem}
            onKeyPress={this.handleDeleteItem}
            className="icon icon--delete far fa-trash-alt"
            role="button"
            tabIndex="0"
          />
        </div>
      </div>
    );
  }
}

DaysSinceItem.propTypes = {
  /* UI Props */
  tabIndex: PropTypes.number.isRequired, // index for focusing items
  _id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // id from DB
  renderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // when we don't have _id from db we use renderId
  title: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  editMode: PropTypes.bool,
  /* CRUD Props */
  setEditMode: PropTypes.func.isRequired,
  unsetEditMode: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  deleteAnimation: PropTypes.bool,
};

DaysSinceItem.defaultProps = {
  title: '',
  _id: undefined,
  renderId: undefined,
  editMode: false,
  deleteAnimation: false,
};

export default connect(
  null,
  actionCreators,
)(DaysSinceItem);
