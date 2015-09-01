'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('..');

var NormalTarget = (function (_DropTarget) {
  _inherits(NormalTarget, _DropTarget);

  function NormalTarget(dropResult) {
    _classCallCheck(this, NormalTarget);

    _DropTarget.call(this);
    this.didCallDrop = false;
    this.didCallHover = false;
    this.dropResult = dropResult || { foo: 'bar' };
  }

  NormalTarget.prototype.hover = function hover() {
    this.didCallHover = true;
  };

  NormalTarget.prototype.drop = function drop() {
    this.didCallDrop = true;
    return this.dropResult;
  };

  return NormalTarget;
})(_.DropTarget);

exports.NormalTarget = NormalTarget;

var NonDroppableTarget = (function (_DropTarget2) {
  _inherits(NonDroppableTarget, _DropTarget2);

  function NonDroppableTarget() {
    _classCallCheck(this, NonDroppableTarget);

    _DropTarget2.call(this);
    this.didCallDrop = false;
    this.didCallHover = false;
  }

  NonDroppableTarget.prototype.canDrop = function canDrop() {
    return false;
  };

  NonDroppableTarget.prototype.hover = function hover() {
    this.didCallHover = true;
  };

  NonDroppableTarget.prototype.drop = function drop() {
    this.didCallDrop = true;
  };

  return NonDroppableTarget;
})(_.DropTarget);

exports.NonDroppableTarget = NonDroppableTarget;

var TargetWithNoDropResult = (function (_DropTarget3) {
  _inherits(TargetWithNoDropResult, _DropTarget3);

  function TargetWithNoDropResult() {
    _classCallCheck(this, TargetWithNoDropResult);

    _DropTarget3.call(this);
    this.didCallDrop = false;
    this.didCallHover = false;
  }

  TargetWithNoDropResult.prototype.hover = function hover() {
    this.didCallHover = true;
  };

  TargetWithNoDropResult.prototype.drop = function drop() {
    this.didCallDrop = true;
  };

  return TargetWithNoDropResult;
})(_.DropTarget);

exports.TargetWithNoDropResult = TargetWithNoDropResult;

var BadResultTarget = (function (_DropTarget4) {
  _inherits(BadResultTarget, _DropTarget4);

  function BadResultTarget() {
    _classCallCheck(this, BadResultTarget);

    _DropTarget4.apply(this, arguments);
  }

  BadResultTarget.prototype.drop = function drop() {
    return 42;
  };

  return BadResultTarget;
})(_.DropTarget);

exports.BadResultTarget = BadResultTarget;

var TransformResultTarget = (function (_DropTarget5) {
  _inherits(TransformResultTarget, _DropTarget5);

  function TransformResultTarget(transform) {
    _classCallCheck(this, TransformResultTarget);

    _DropTarget5.call(this);
    this.transform = transform;
    this.didCallDrop = false;
    this.didCallHover = false;
  }

  TransformResultTarget.prototype.hover = function hover() {
    this.didCallHover = true;
  };

  TransformResultTarget.prototype.drop = function drop(monitor) {
    this.didCallDrop = true;
    var dropResult = monitor.getDropResult();
    return this.transform(dropResult);
  };

  return TransformResultTarget;
})(_.DropTarget);

exports.TransformResultTarget = TransformResultTarget;