import React, { Component } from 'react';

class DaysSinceItem extends Component {
  
  daysSinceDate(date) {
    const dayInMs = 86400000;
    return Math.floor( (Date.now() - date) / dayInMs);
  }
  
  render() {
    const { title, date } = this.props;
    const daysSince = this.daysSinceDate(date);
    return (
      <div className="item">
        <div className="item__counter">{daysSince}</div>
        <div className="item__title">{title}</div>
        <div className="item__edit-button"><i className="fas fa-edit"></i></div>
      </div>
    );
  }
}

export default DaysSinceItem;