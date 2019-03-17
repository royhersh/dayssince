import React, { Component } from 'react';
import './sass/main.scss';

class App extends Component {
  render() {
    return (
     <div className="app wrapper">
      <div className="header">Days Since</div>

      <div className="items-container">
        <div className="item">
          <div className="item--counter">34</div>
          <div className="item--title">Car Wash</div>
          <div className="item--edit-button">E</div>
        </div>

        <div className="item">
          <div className="item--counter">64</div>
          <div className="item--title">Dentist</div>
          <div className="item--edit-button">E</div>
        </div>
      </div>

      <div className="add-button">+</div>
     </div>
    );
  }
}

export default App;
