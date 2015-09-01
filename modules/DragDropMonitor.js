'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utilsMatchesType = require('./utils/matchesType');

var _utilsMatchesType2 = _interopRequireDefault(_utilsMatchesType);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

var DragDropMonitor = (function () {
  function DragDropMonitor(flux, registry) {
    _classCallCheck(this, DragDropMonitor);

    this.dragOperationStore = flux.dragOperationStore;
    this.dragOffsetStore = flux.dragOffsetStore;
    this.registry = registry;
  }

  DragDropMonitor.prototype.subscribeToStateChange = function subscribeToStateChange(listener) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$handlerIds = _ref.handlerIds;
    var handlerIds = _ref$handlerIds === undefined ? null : _ref$handlerIds;

    _invariant2['default'](typeof listener === 'function', 'listener must be a function.');

    var dragOperationStore = this.dragOperationStore;

    var handleChange = listener;
    if (handlerIds) {
      _invariant2['default'](_lodashLangIsArray2['default'](handlerIds), 'handlerIds, when specified, must be an array of strings.');
      handleChange = function () {
        if (dragOperationStore.areDirty(handlerIds)) {
          listener();
        }
      };
    }

    dragOperationStore.addListener('change', handleChange);

    return function dispose() {
      dragOperationStore.removeListener('change', handleChange);
    };
  };

  DragDropMonitor.prototype.subscribeToOffsetChange = function subscribeToOffsetChange(listener) {
    _invariant2['default'](typeof listener === 'function', 'listener must be a function.');

    var dragOffsetStore = this.dragOffsetStore;

    dragOffsetStore.addListener('change', listener);

    return function dispose() {
      dragOffsetStore.removeListener('change', listener);
    };
  };

  DragDropMonitor.prototype.canDragSource = function canDragSource(sourceId) {
    var source = this.registry.getSource(sourceId);
    _invariant2['default'](source, 'Expected to find a valid source.');

    if (this.isDragging()) {
      return false;
    }

    return source.canDrag(this, sourceId);
  };

  DragDropMonitor.prototype.canDropOnTarget = function canDropOnTarget(targetId) {
    var target = this.registry.getTarget(targetId);
    _invariant2['default'](target, 'Expected to find a valid target.');

    if (!this.isDragging() || this.didDrop()) {
      return false;
    }

    var targetType = this.registry.getTargetType(targetId);
    var draggedItemType = this.getItemType();
    return _utilsMatchesType2['default'](targetType, draggedItemType) && target.canDrop(this, targetId);
  };

  DragDropMonitor.prototype.isDragging = function isDragging() {
    return this.dragOperationStore.isDragging();
  };

  DragDropMonitor.prototype.isDraggingSource = function isDraggingSource(sourceId) {
    var source = this.registry.getSource(sourceId, true);
    _invariant2['default'](source, 'Expected to find a valid source.');

    if (!this.isDragging() || !this.isSourcePublic()) {
      return false;
    }

    var sourceType = this.registry.getSourceType(sourceId);
    var draggedItemType = this.getItemType();
    if (sourceType !== draggedItemType) {
      return false;
    }

    return source.isDragging(this, sourceId);
  };

  DragDropMonitor.prototype.isOverTarget = function isOverTarget(targetId) {
    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref2$shallow = _ref2.shallow;
    var shallow = _ref2$shallow === undefined ? false : _ref2$shallow;

    if (!this.isDragging()) {
      return false;
    }

    var targetType = this.registry.getTargetType(targetId);
    var draggedItemType = this.getItemType();
    if (!_utilsMatchesType2['default'](targetType, draggedItemType)) {
      return false;
    }

    var targetIds = this.getTargetIds();
    if (!targetIds.length) {
      return false;
    }

    var index = targetIds.indexOf(targetId);
    if (shallow) {
      return index === targetIds.length - 1;
    } else {
      return index > -1;
    }
  };

  DragDropMonitor.prototype.getItemType = function getItemType() {
    return this.dragOperationStore.getItemType();
  };

  DragDropMonitor.prototype.getItem = function getItem() {
    return this.dragOperationStore.getItem();
  };

  DragDropMonitor.prototype.getSourceId = function getSourceId() {
    return this.dragOperationStore.getSourceId();
  };

  DragDropMonitor.prototype.getTargetIds = function getTargetIds() {
    return this.dragOperationStore.getTargetIds();
  };

  DragDropMonitor.prototype.getDropResult = function getDropResult() {
    return this.dragOperationStore.getDropResult();
  };

  DragDropMonitor.prototype.didDrop = function didDrop() {
    return this.dragOperationStore.didDrop();
  };

  DragDropMonitor.prototype.isSourcePublic = function isSourcePublic() {
    return this.dragOperationStore.isSourcePublic();
  };

  DragDropMonitor.prototype.getInitialClientOffset = function getInitialClientOffset() {
    return this.dragOffsetStore.getInitialClientOffset();
  };

  DragDropMonitor.prototype.getInitialSourceClientOffset = function getInitialSourceClientOffset() {
    return this.dragOffsetStore.getInitialSourceClientOffset();
  };

  DragDropMonitor.prototype.getSourceClientOffset = function getSourceClientOffset() {
    return this.dragOffsetStore.getSourceClientOffset();
  };

  DragDropMonitor.prototype.getClientOffset = function getClientOffset() {
    return this.dragOffsetStore.getClientOffset();
  };

  DragDropMonitor.prototype.getDifferenceFromInitialOffset = function getDifferenceFromInitialOffset() {
    return this.dragOffsetStore.getDifferenceFromInitialOffset();
  };

  return DragDropMonitor;
})();

exports['default'] = DragDropMonitor;
module.exports = exports['default'];