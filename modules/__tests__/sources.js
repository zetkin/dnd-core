'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('..');

var NormalSource = (function (_DragSource) {
  _inherits(NormalSource, _DragSource);

  function NormalSource(item) {
    _classCallCheck(this, NormalSource);

    _DragSource.call(this);
    this.item = item || { baz: 42 };
    this.didCallBeginDrag = false;
  }

  NormalSource.prototype.beginDrag = function beginDrag() {
    this.didCallBeginDrag = true;
    return this.item;
  };

  NormalSource.prototype.endDrag = function endDrag(monitor) {
    this.recordedDropResult = monitor.getDropResult();
  };

  return NormalSource;
})(_.DragSource);

exports.NormalSource = NormalSource;

var NonDraggableSource = (function (_DragSource2) {
  _inherits(NonDraggableSource, _DragSource2);

  function NonDraggableSource() {
    _classCallCheck(this, NonDraggableSource);

    _DragSource2.call(this);
    this.didCallBeginDrag = false;
  }

  NonDraggableSource.prototype.canDrag = function canDrag() {
    return false;
  };

  NonDraggableSource.prototype.beginDrag = function beginDrag() {
    this.didCallBeginDrag = true;
    return {};
  };

  return NonDraggableSource;
})(_.DragSource);

exports.NonDraggableSource = NonDraggableSource;

var BadItemSource = (function (_DragSource3) {
  _inherits(BadItemSource, _DragSource3);

  function BadItemSource() {
    _classCallCheck(this, BadItemSource);

    _DragSource3.apply(this, arguments);
  }

  BadItemSource.prototype.beginDrag = function beginDrag() {
    return 42;
  };

  return BadItemSource;
})(_.DragSource);

exports.BadItemSource = BadItemSource;

var NumberSource = (function (_DragSource4) {
  _inherits(NumberSource, _DragSource4);

  function NumberSource(number, allowDrag) {
    _classCallCheck(this, NumberSource);

    _DragSource4.call(this);
    this.number = number;
    this.allowDrag = allowDrag;
  }

  NumberSource.prototype.canDrag = function canDrag() {
    return this.allowDrag;
  };

  NumberSource.prototype.isDragging = function isDragging(monitor) {
    var item = monitor.getItem();
    return item.number === this.number;
  };

  NumberSource.prototype.beginDrag = function beginDrag() {
    return {
      number: this.number
    };
  };

  return NumberSource;
})(_.DragSource);

exports.NumberSource = NumberSource;