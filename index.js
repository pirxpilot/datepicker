var Picker = require('picker');
var Calendar = require('calendar');
var inherit = require('inherit');

module.exports = Datepicker;

function Datepicker(el) {
  if (!(this instanceof Datepicker)) return new Datepicker(el);
  this.calendar = new Calendar();
  Picker.call(this, el, this.calendar);
}

inherit(Datepicker, Picker);