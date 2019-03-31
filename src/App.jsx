import React, { Component } from 'react';
import ItemForm from './components/itemForm';

import './sass/main.scss'

class App extends Component {
  render() {
    return (
     <div className="app-wrapper">
      <div className="header">Days Since</div>

      <div className="items-container">
        <div className="item">
          <div className="item__counter">34</div>
          <div className="item__title">Car Wash</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">64</div>
          <div className="item__title">Dentist</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>
        
        <div className="item">
          <div className="item__counter">123</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">8664</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">34</div>
          <div className="item__title">Car Wash</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">64</div>
          <div className="item__title">Dentist</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>
        
        <div className="item">
          <div className="item__counter">123</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>
        
        <div className="item">
          <div className="item__counter">8664</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">34</div>
          <div className="item__title">Car Wash</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

        <div className="item">
          <div className="item__counter">64</div>
          <div className="item__title">Dentist</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>
        
        <div className="item">
          <div className="item__counter">123</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>
        
        <div className="item">
          <div className="item__counter">8664</div>
          <div className="item__title">Something I didn't do for a long time</div>
          <div className="item__edit-button"><i className="fas fa-edit"></i></div>
        </div>

      </div>

      <div className="add-button">+</div>
     <ItemForm/>
     </div>
    );
  }
}

export default App;
