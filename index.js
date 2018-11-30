const Picker = require('popup-picker');
const Calendar = require('@pirxpilot/calendar');

class Datepicker extends Picker {
  static of(...args) {
    return new Datepicker(...args);
  }

  constructor(el, options) {
    const calendar = new Calendar(options);
    super(el, calendar);
    this.calendar = calendar;
  }
}

module.exports = Datepicker;
