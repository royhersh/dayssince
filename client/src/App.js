import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import queryString from 'query-string';

import * as actionCreators from './actions/index';
// import ItemForm from './components/itemForm';
import DaysSinceItem from './components/daysSinceItem';

import './sass/main.scss';

class App extends Component {
  componentDidMount() {
    const { fetchData, location } = this.props;
    const { token } = queryString.parse(location.search);

    fetchData();
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  renderItems() {
    const { items } = this.props;
    return items.map(item => <DaysSinceItem key={item.id} {...item} />);
  }

  render() {
    // const { showForm } = this.state;
    const { createNewItem, showPlusButton } = this.props;
    const addButtonClass = classNames({
      'add-button': true,
      'add-button--hidden': !showPlusButton,
    });
    return (
      <div className="app-wrapper">
        <div className="header">Days Since</div>
        <div className="items-container">{this.renderItems()}</div>
        <div id="modal" />

        <div
          className={addButtonClass}
          role="button"
          tabIndex={0}
          onKeyPress={createNewItem}
          onClick={createNewItem}
        >
          +
        </div>

        <div className="footer">
          <a href="/auth/google">
            <i className="footer__login-icon fas fa-user-slash" />
          </a>
        </div>
        {/* showForm &&
        <ItemForm onClose={this.handleCloseItemForm} onSave={this.handleAddItem} /> */}
      </div>
    );
  }
}

App.propTypes = {
  fetchData: PropTypes.func.isRequired, // action-creator - fetch data from database
  addItem: PropTypes.func.isRequired,
  createNewItem: PropTypes.func.isRequired, // create new item at the beginning of the array
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      date: PropTypes.number,
    }),
  ),
};

App.defaultProps = {
  items: [],
};

const mapStateToProps = state => ({
  items: state.items,
  showPlusButton: state.ui.showPlusButton,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(App);
