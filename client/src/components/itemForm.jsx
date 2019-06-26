import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemForm extends Component {
  static genDateObject(date) {
    const [year, month, day] = date.split('-');
    return { year, month, day };
  }

  constructor(props) {
    super(props);
    const today = new Date().toJSON().match(/.+(?=T)/g)[0];

    this.state = {
      ...ItemForm.genDateObject(today),
      title: '',
    };

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleChangeTitle = e => this.setState({ title: e.target.value });

  handleDateChange = e => this.setState(ItemForm.genDateObject(e.target.value));

  handleSaveButton = () => {
    const {
      year, month, day, title,
    } = this.state;
    const { onSave } = this.props;
    const date = new Date(`${year}-${month}-${day}`).getTime();
    onSave({ date, title });
  }

  render() {
    const {
      year, month, day, title,
    } = this.state;
    const { onClose } = this.props;
    return (
      <div className="item-form">
        <section className="item-form__date">
          <label className="item-form__date__label" htmlFor="item-form__date__input">
            Days Since
          </label>

          <div className="item-form__date__text">
            <input
              id="item-form__date__input"
              className="item-form__date__input"
              type="date"
              name="since"
              required="required"
              onChange={this.handleDateChange}
            />
            {`${day} / ${month} / ${year}`}
          </div>
        </section>

        <section className="item-form__description">
          <label className="item-form__description__label" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={title}
            onChange={this.handleChangeTitle}
          />
        </section>

        <section className="item-form__buttons">
          <button
            type="button"
            onClick={onClose}
            className="btn btn--negative item-form__buttons--cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={this.handleSaveButton}
            className="btn btn--positive item-form__buttons--save"
          >
            Save
          </button>
        </section>
      </div>
    );
  }
}
ItemForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ItemForm;
