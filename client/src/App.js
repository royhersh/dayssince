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
  constructor(props) {
    super(props);
    this.state = {
      userToken: false,
    };
  }

  componentDidMount() {
    const { fetchData, location } = this.props;
    const { token: tokenFromUrl } = queryString.parse(location.search);

    fetchData();
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
    }

    const userToken = localStorage.getItem('token');
    this.setState({ userToken });
  }

  renderItems() {
    const { items } = this.props;
    return items.map(item => <DaysSinceItem key={item.id} {...item} />);
  }

  render() {
    // const { showForm } = this.state;
    const { createNewItem, showPlusButton } = this.props;
    const { userToken } = this.state;
    const addButtonClass = classNames({
      'add-button': true,
      'add-button--hidden': !showPlusButton,
    });
    const footerClass = classNames('footer__login-icon', {
      'footer__login-icon--loggedin': userToken,
    });
    const footerIconClass = classNames({
      'fas fa-user-slash': !userToken,
      'fas fa-user': userToken,
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

        <div className="footer ">
          <a href="/auth/google" className={footerClass}>
            <i className={footerIconClass} />
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
