import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as actionCreators from '../actions/index';
import Modal from './modal';

class DaysSinceItem extends Component {
  static daysSinceDate(date) {
    const dayInMs = 86400000;
    return Math.floor((Date.now() - date) / dayInMs);
  }

  constructor(props) {
    super(props);
    this.titleRef = React.createRef();

    this.state = {
      title: props.title || '',
      date: props.date || Date.now(),
      preAnimate: true,
    };

    // this.handleDateChange = this.handleDateChange.bind(this);
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
    const { id, updateItem, unsetEditMode } = this.props;
    const { title, date } = this.state;
    unsetEditMode(id);
    updateItem({ id, title, date });
  };

  setEditMode = () => {
    const { id, setEditMode, editMode } = this.props;
    !editMode && setEditMode(id);
  };

  handleCancel = () => {
    const {
      id, unsetEditMode, title, date,
    } = this.props;

    this.setState({ date, title });
    unsetEditMode(id);
  };

  handleDeleteItem = () => {
    const { id, deleteItem } = this.props;
    deleteItem(id);
  };

  render() {
    const { editMode, deleteAnimation } = this.props;
    const { title, date, preAnimate } = this.state;
    const daysSince = DaysSinceItem.daysSinceDate(date);

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
        role="button"
      >
        <div className="item-info">
          <div className="item-info__counter">
            {daysSince}
            <input
              id="item-form__date__input"
              className="item-form__date__input"
              type="date"
              name="since"
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
                onChange={this.handleTitleChange}
              />
              <Modal>
                <div
                  id="overlay"
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
          <i onClick={this.handleCancel} className="icon icon--cancel fas fa-times" />
          <i className="icon far fa-calendar-alt" />
          <i className="icon far fa-calendar-check" />
          <i onClick={this.handleDeleteItem} className="icon far fa-trash-alt" />
        </div>
      </div>
    );
  }
}

DaysSinceItem.propTypes = {
  updateItem: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  id: PropTypes.number.isRequired,
  // title: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
};

DaysSinceItem.defaultProps = {
  editMode: false,
};

export default connect(
  null,
  actionCreators,
)(DaysSinceItem);
