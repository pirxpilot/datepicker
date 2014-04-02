var Popover = require('popover'),
  Calendar = require('calendar'),
  Emitter = require('emitter'),
  event = require('event');

module.exports = Datepicker;

/*global document*/

function clickOutside(elements, fn) {
  var self = {
    on: on,
    off: off,
    isClicked: isClicked
  }, clickedEl, handlers;

  function stop(e) {
    clickedEl = this;
    e.stopPropagation();
  }

  function pass() {
    clickedEl = undefined;
    fn();
  }

  function isClicked(el) {
    return el === clickedEl;
  }

  function on() {
    var html = document.querySelector('html');
    handlers = elements.map(function(el) {
      return event.bind(el, 'mousedown', stop.bind(el));
    });
    event.bind(html, 'mousedown', pass);
    return self;
  }

  function off() {
    var html = document.querySelector('html');
    event.unbind(html, 'mousedown', pass);
    elements.forEach(function(el, i) {
      event.unbind(el, 'mousedown', handlers[i]);
    });
    return self;
  }

  return self;
}

function useFocus(el) {
  var type, tag = el.tagName.toLowerCase();
  if (tag === 'input') {
    type = el.type;
    return type === 'text' || type === 'time';
  }
  return (tag === 'textarea' || tag === 'select');
}


function Datepicker(el) {
  if (!(this instanceof Datepicker)) return new Datepicker(el);
  Emitter.call(this);
  this.el = el;
  this.calendar = new Calendar()
    .on('change', this.onchange.bind(this));
  if (useFocus(el)) {
    event.bind(el, 'focus', this.onfocus.bind(this));
    event.bind(el, 'blur', this.onblur.bind(this));
  } else {
    event.bind(el, 'click', this.onclick.bind(this));
  }
}

Emitter(Datepicker.prototype);

Datepicker.prototype.onclick = function() {
  if (this.el.disabled) {
    return;
  }
  this.show();
};

Datepicker.prototype.onfocus = function() {
  this.show();
};

Datepicker.prototype.onblur = function() {
  if (!this.clickOutside.isClicked(this.popover.el)) {
    this.hide();
  }
};

Datepicker.prototype.onchange = function(v, complete) {
  this.emit('change', v, complete);
  this.hide();
};

Datepicker.prototype.position = function(v) {
  this._position = v;
  return this;
};

Datepicker.prototype.show = function() {
  var self = this;
  if (this._visible) {
    return;
  }
  this._visible = true;
  if (!self.popover) {
    this.popover = new Popover(this.calendar.el)
      .on('show', function() {
        self.clickOutside.on();
        self.emit('show');
      })
      .on('hide', function() {
        self.emit('hide');
      });
    this.clickOutside = clickOutside([this.el, this.popover.el], this.hide.bind(this));
    this.popover.classname = 'datepicker popover';
    if (this._position) {
      this.popover.position(this._position);
    }
  }
  this.popover.show(this.el);
};

Datepicker.prototype.hide = function() {
  if (!this._visible) {
    return;
  }
  this._visible = false;
  this.clickOutside.off();
  this.popover.hide();
  return this;
};
