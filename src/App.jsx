import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionCreators from './actions/index';
import ItemForm from './components/itemForm';
import DaysSinceItem from './components/daysSinceItem';
import mockData from './mockData';

import './sass/main.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
    };
    // const { fetchData } = this.props;
    props.fetchData();

    this.toggleForm = this.toggleForm.bind(this);
  }

  handleCloseItemForm = () => this.setState({ showForm: false });

  handleAddItem = ({ date, title }) => {
    const { addItem } = this.props;
    addItem({ date, title });
    this.closeForm();
  };

  closeForm() {
    this.setState({
      showForm: false,
    });
  }

  toggleForm() {
    const { showForm } = this.state;
    this.setState({
      showForm: !showForm,
    });
  }

  renderItems() {
    const { items } = this.props;
    return items.map(item => <DaysSinceItem key={item.date} title={item.title} date={item.date} />);
  }

  render() {
    const { showForm } = this.state;
    return (
      <div className="app-wrapper">
        <div className="header">Days Since</div>

        <div className="items-container">{this.renderItems()}</div>

        <div
          role="button"
          tabIndex={0}
          className="add-button"
          onKeyPress={this.toggleForm}
          onClick={this.toggleForm}
        >
          +
        </div>
        {showForm && <ItemForm onClose={this.handleCloseItemForm} onSave={this.handleAddItem} />}
      </div>
    );
  }
}

App.propTypes = {
  fetchData: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
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

const mapStateToProps = state => ({ items: state.items });

export default connect(
  mapStateToProps,
  actionCreators,
)(App);
