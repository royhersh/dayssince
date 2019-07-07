import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import queryString from 'query-string';
import api from './utils/api';

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

  async componentDidMount() {
    this.initialDataFetch();
  }

  async initialDataFetch() {
    /* see logic in 'diagrams/login-logix.xml' (draw.io) */
    const { populateItems, location } = this.props;
    const { token: tokenFromUrl } = queryString.parse(location.search);
    const itemsInLocalStorage = JSON.parse(localStorage.getItem('items')) || [];

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      const data = await api.POST.mergeItems(itemsInLocalStorage);
      localStorage.removeItem('items');
      populateItems(data);
    } else {
      const tokenInLocalStorage = localStorage.getItem('token');
      if (tokenInLocalStorage) {
        const data = await api.GET.items();
        populateItems(data);
      } else {
        populateItems(itemsInLocalStorage);
      }
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
      </div>
    );
  }
}

App.propTypes = {
  createNewItem: PropTypes.func.isRequired, // create new item at the beginning of the array
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      title: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
