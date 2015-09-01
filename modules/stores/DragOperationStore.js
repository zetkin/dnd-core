'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _flummox = require('flummox');

var _lodashArrayXor = require('lodash/array/xor');

var _lodashArrayXor2 = _interopRequireDefault(_lodashArrayXor);

var _lodashArrayWithout = require('lodash/array/without');

var _lodashArrayWithout2 = _interopRequireDefault(_lodashArrayWithout);

var _lodashArrayIntersection = require('lodash/array/intersection');

var _lodashArrayIntersection2 = _interopRequireDefault(_lodashArrayIntersection);

var ALL_DIRTY_WILDCARD = { __all__: true };

var DragOperationStore = (function (_Store) {
  _inherits(DragOperationStore, _Store);

  function DragOperationStore(flux) {
    _classCallCheck(this, DragOperationStore);

    _Store.call(this);

    var dragDropActionIds = flux.dragDropActionIds;
    var registryActionIds = flux.registryActionIds;

    this.register(dragDropActionIds.beginDrag, this.handleBeginDrag);
    this.register(dragDropActionIds.publishDragSource, this.handlePublishDragSource);
    this.register(dragDropActionIds.hover, this.handleHover);
    this.register(dragDropActionIds.endDrag, this.handleEndDrag);
    this.register(dragDropActionIds.drop, this.handleDrop);
    this.register(registryActionIds.removeTarget, this.handleRemoveTarget);

    this.dirtyHandlerIds = [];
    this.state = {
      itemType: null,
      item: null,
      sourceId: null,
      targetIds: [],
      dropResult: null,
      didDrop: false,
      isSourcePublic: null
    };
  }

  DragOperationStore.prototype.setState = function setState(nextState) {
    var dirtyHandlerIds = arguments.length <= 1 || arguments[1] === undefined ? ALL_DIRTY_WILDCARD : arguments[1];

    this.dirtyHandlerIds = dirtyHandlerIds;
    _Store.prototype.setState.call(this, nextState);
  };

  DragOperationStore.prototype.handleBeginDrag = function handleBeginDrag(_ref) {
    var itemType = _ref.itemType;
    var item = _ref.item;
    var sourceId = _ref.sourceId;
    var isSourcePublic = _ref.isSourcePublic;

    this.setState({
      itemType: itemType,
      item: item,
      sourceId: sourceId,
      isSourcePublic: isSourcePublic,
      dropResult: null,
      didDrop: false
    });
  };

  DragOperationStore.prototype.handlePublishDragSource = function handlePublishDragSource() {
    this.setState({
      isSourcePublic: true
    });
  };

  DragOperationStore.prototype.handleHover = function handleHover(_ref2) {
    var targetIds = _ref2.targetIds;
    var prevTargetIds = this.state.targetIds;

    var dirtyHandlerIds = _lodashArrayXor2['default'](targetIds, prevTargetIds);

    var didChange = false;
    if (dirtyHandlerIds.length === 0) {
      for (var i = 0; i < targetIds.length; i++) {
        if (targetIds[i] !== prevTargetIds[i]) {
          didChange = true;
          break;
        }
      }
    } else {
      didChange = true;
    }

    if (!didChange) {
      return;
    }

    var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
    var innermostTargetId = targetIds[targetIds.length - 1];

    if (prevInnermostTargetId !== innermostTargetId) {
      if (prevInnermostTargetId) {
        dirtyHandlerIds.push(prevInnermostTargetId);
      }
      if (innermostTargetId) {
        dirtyHandlerIds.push(innermostTargetId);
      }
    }

    this.setState({
      targetIds: targetIds
    }, dirtyHandlerIds);
  };

  DragOperationStore.prototype.handleRemoveTarget = function handleRemoveTarget(_ref3) {
    var targetId = _ref3.targetId;
    var targetIds = this.state.targetIds;

    if (targetIds.indexOf(targetId) === -1) {
      return;
    }

    this.setState({
      targetIds: _lodashArrayWithout2['default'](targetIds, targetId)
    }, []);
  };

  DragOperationStore.prototype.handleDrop = function handleDrop(_ref4) {
    var dropResult = _ref4.dropResult;

    this.setState({
      dropResult: dropResult,
      didDrop: true,
      targetIds: []
    });
  };

  DragOperationStore.prototype.handleEndDrag = function handleEndDrag() {
    this.setState({
      itemType: null,
      item: null,
      sourceId: null,
      dropResult: null,
      didDrop: false,
      isSourcePublic: null,
      targetIds: []
    });
  };

  DragOperationStore.prototype.isDragging = function isDragging() {
    return Boolean(this.getItemType());
  };

  DragOperationStore.prototype.getItemType = function getItemType() {
    return this.state.itemType;
  };

  DragOperationStore.prototype.getSourceId = function getSourceId() {
    return this.state.sourceId;
  };

  DragOperationStore.prototype.getTargetIds = function getTargetIds() {
    return this.state.targetIds.slice(0);
  };

  DragOperationStore.prototype.getItem = function getItem() {
    return this.state.item;
  };

  DragOperationStore.prototype.getDropResult = function getDropResult() {
    return this.state.dropResult;
  };

  DragOperationStore.prototype.didDrop = function didDrop() {
    return this.state.didDrop;
  };

  DragOperationStore.prototype.isSourcePublic = function isSourcePublic() {
    return this.state.isSourcePublic;
  };

  DragOperationStore.prototype.areDirty = function areDirty(handlerIds) {
    if (this.dirtyHandlerIds === ALL_DIRTY_WILDCARD) {
      return true;
    }

    return _lodashArrayIntersection2['default'](handlerIds, this.dirtyHandlerIds).length > 0;
  };

  return DragOperationStore;
})(_flummox.Store);

exports['default'] = DragOperationStore;
module.exports = exports['default'];