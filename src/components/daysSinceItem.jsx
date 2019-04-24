import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    };
  }

  componentDidMount() {
    this.titleRef.current.focus();
  }

  handleChangeTitle = e => this.setState({ title: e.target.value });

  handleClickOverlay = () => {
    const { id, title, updateItem } = this.props;
    updateItem(id, title);
  };

  render() {
    const { date, editMode } = this.props;
    const { title } = this.state;
    const daysSince = DaysSinceItem.daysSinceDate(date);

    const itemStyle = {
      zIndex: Number(editMode),
    };

    return (
      <div>
        <div className="item" style={itemStyle}>
          <div className="item-info">
            <div className="item-info__counter">{daysSince}</div>
            {editMode ? (
              <>
                <input
                  type="text"
                  className="item-info__title"
                  ref={this.titleRef}
                  value={title}
                  onChange={this.handleChangeTitle}
                />
                <Modal>
                  <div id="overlay" onClick={this.handleClickOverlay} role="button" onKeyPress={this.handleClickOverlay} tabIndex="-1" />
                </Modal>
              </>
            ) : (
              <div className="item-info__title">{title}</div>
            )}
          </div>

          <div className="item-edit">
            <i className="icon icon--cancel fas fa-times" />
            <i className="icon far fa-calendar-alt" />
            <i className="icon far fa-calendar-check" />
            <i className="icon far fa-trash-alt" />
          </div>
        </div>
      </div>
    );
  }
}

DaysSinceItem.propTypes = {
  updateItem: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
};

DaysSinceItem.defaultProps = {
  editMode: false,
};

export default connect(
  null,
  actionCreators,
)(DaysSinceItem);
