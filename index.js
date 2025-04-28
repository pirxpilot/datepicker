import Calendar from '@pirxpilot/calendar';
import Picker from 'popup-picker';

export default class Datepicker extends Picker {
  static of(...args) {
    return new Datepicker(...args);
  }

  constructor(el, options) {
    const calendar = new Calendar(options);
    super(el, calendar);
    this.calendar = calendar;
  }
}
