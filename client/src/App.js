import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import queryString from 'query-string';

import * as actionCreators from './actions/index';
import api from './utils/api';

import DaysSinceItem from './components/daysSinceItem';

import './sass/main.scss';

export class App extends Component {
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
      const data = await api.POST.mergeItems(itemsInLocalStorage);
      populateItems(data);
      localStorage.setItem('token', tokenFromUrl);
      localStorage.removeItem('items');
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
    return items.map(item => <DaysSinceItem key={item.renderId} {...item} />);
  }

  render() {
    const { createNewItem, showPlusButton } = this.props;
    const { userToken } = this.state;

    const footerClass = classNames('footer__login-icon', {
      'footer__login-icon--loggedin': userToken,
    });
    const footerIconClass = classNames({
      'fas fa-user-slash': !userToken,
      'fas fa-user': userToken,
    });

    const plusButton = () => {
      const addButtonClass = classNames({
        'add-button': true,
        'add-button--hidden': !showPlusButton,
      });
      return (
        <div
          className={addButtonClass}
          role="button"
          tabIndex={0}
          onKeyPress={createNewItem}
          onClick={createNewItem}
        >
          +
        </div>
      );
    };

    return (
      <div className="app-wrapper">
        <div className="header">Days Since</div>
        <div className="items-container">{this.renderItems()}</div>
        <div id="modal" />

        {plusButton()}

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
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired, // From react-router
  populateItems: PropTypes.func.isRequired, // Redux action
  createNewItem: PropTypes.func.isRequired, // create new item at the beginning of the array
  showPlusButton: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      renderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      title: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
  ),
};

App.defaultProps = {
  items: [],
  showPlusButton: true,
};

export const mapStateToProps = state => ({
  items: state.items,
  showPlusButton: state.ui.showPlusButton,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(App);
