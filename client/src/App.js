import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionCreators from './actions/index';
// import ItemForm from './components/itemForm';
import DaysSinceItem from './components/daysSinceItem';

import './sass/main.scss';

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   showForm: false,
    // };
    props.fetchData();

    // this.toggleForm = this.toggleForm.bind(this);
  }

  // handleCloseItemForm = () => this.setState({ showForm: false });

  // handleAddItem = ({ date, title }) => {
  //   const { addItem } = this.props;
  //   addItem({ date, title });
  //   this.closeForm();
  // };

  // closeForm() {
  //   this.setState({
  //     showForm: false,
  //   });
  // }

  // toggleForm() {
  //   const { showForm } = this.state;
  //   this.setState({
  //     showForm: !showForm,
  //   });
  // }

  renderItems() {
    const { items } = this.props;
    return items.map(item => <DaysSinceItem key={item.id} {...item} />);
  }


  render() {
    // const { showForm } = this.state;
    const { createNewItem } = this.props;
    return (
      <div className="app-wrapper">
        <div className="header">Days Since</div>
        <div className="items-container">{this.renderItems()}</div>
        <div id="modal" />

        <div
          role="button"
          tabIndex={0}
          className="add-button"
          onKeyPress={createNewItem}
          onClick={createNewItem}
        >
          +
        </div>
        {/* showForm &&
        <ItemForm onClose={this.handleCloseItemForm} onSave={this.handleAddItem} /> */
        }
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

const mapStateToProps = state => ({ items: state.items });

export default connect(
  mapStateToProps,
  actionCreators,
)(App);
