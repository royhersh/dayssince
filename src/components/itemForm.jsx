import React, { Component } from 'react';


class ItemForm extends Component {
  render() {
    return (
     <div className="item-form">
      <section className="item-form__date">
        <label className="item-form__date__label" htmlFor="since">Days Since</label>
        <input className="item-form__date__input" type="date" name="since"/>
      </section>

      <section className="item-form__description">
        <label className="item-form__description__label" htmlFor="description">Description</label>
        <input type="text" name="description"/>
      </section>

      <section className="item-form__buttons">
      <button className="btn btn--negative item-form__buttons--cancel">Cancel</button>
      <button className="btn btn--positive item-form__buttons--save">Save</button>
      </section>
     </div>
    );
  }
}

export default ItemForm;
