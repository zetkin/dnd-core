'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _flummox = require('flummox');

function areOffsetsEqual(offsetA, offsetB) {
  if (offsetA === offsetB) {
    return true;
  }

  return offsetA && offsetB && offsetA.x === offsetB.x && offsetA.y === offsetB.y;
}

var DragOffsetStore = (function (_Store) {
  _inherits(DragOffsetStore, _Store);

  function DragOffsetStore(flux) {
    _classCallCheck(this, DragOffsetStore);

    _Store.call(this);

    var dragDropActionIds = flux.dragDropActionIds;

    this.register(dragDropActionIds.beginDrag, this.handleBeginDrag);
    this.register(dragDropActionIds.hover, this.handleHover);
    this.register(dragDropActionIds.endDrag, this.handleEndDrag);
    this.register(dragDropActionIds.drop, this.handleDrop);

    this.state = {
      initialSourceClientOffset: null,
      initialClientOffset: null,
      clientOffset: null
    };
  }

  DragOffsetStore.prototype.handleBeginDrag = function handleBeginDrag(_ref) {
    var clientOffset = _ref.clientOffset;
    var sourceClientOffset = _ref.sourceClientOffset;

    this.setState({
      initialClientOffset: clientOffset,
      initialSourceClientOffset: sourceClientOffset,
      clientOffset: clientOffset
    });
  };

  DragOffsetStore.prototype.handleHover = function handleHover(_ref2) {
    var clientOffset = _ref2.clientOffset;
    var prevClientOffset = this.state.clientOffset;

    if (!areOffsetsEqual(clientOffset, prevClientOffset)) {
      this.setState({
        clientOffset: clientOffset
      });
    }
  };

  DragOffsetStore.prototype.handleEndDrag = function handleEndDrag() {
    this.setState({
      initialClientOffset: null,
      initialSourceClientOffset: null,
      clientOffset: null
    });
  };

  DragOffsetStore.prototype.handleDrop = function handleDrop() {
    this.setState({
      initialClientOffset: null,
      initialSourceClientOffset: null,
      clientOffset: null
    });
  };

  DragOffsetStore.prototype.getInitialClientOffset = function getInitialClientOffset() {
    return this.state.initialClientOffset;
  };

  DragOffsetStore.prototype.getInitialSourceClientOffset = function getInitialSourceClientOffset() {
    return this.state.initialSourceClientOffset;
  };

  DragOffsetStore.prototype.getClientOffset = function getClientOffset() {
    return this.state.clientOffset;
  };

  DragOffsetStore.prototype.getSourceClientOffset = function getSourceClientOffset() {
    var _state = this.state;
    var clientOffset = _state.clientOffset;
    var initialClientOffset = _state.initialClientOffset;
    var initialSourceClientOffset = _state.initialSourceClientOffset;

    if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
      return null;
    }

    return {
      x: clientOffset.x + initialSourceClientOffset.x - initialClientOffset.x,
      y: clientOffset.y + initialSourceClientOffset.y - initialClientOffset.y
    };
  };

  DragOffsetStore.prototype.getDifferenceFromInitialOffset = function getDifferenceFromInitialOffset() {
    var _state2 = this.state;
    var clientOffset = _state2.clientOffset;
    var initialClientOffset = _state2.initialClientOffset;

    if (!clientOffset || !initialClientOffset) {
      return null;
    }

    return {
      x: clientOffset.x - initialClientOffset.x,
      y: clientOffset.y - initialClientOffset.y
    };
  };

  return DragOffsetStore;
})(_flummox.Store);

exports['default'] = DragOffsetStore;
module.exports = exports['default'];