'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _flummox = require('flummox');

var RegistryActions = (function (_Actions) {
  _inherits(RegistryActions, _Actions);

  function RegistryActions() {
    _classCallCheck(this, RegistryActions);

    _Actions.apply(this, arguments);
  }

  RegistryActions.prototype.addSource = function addSource(sourceId) {
    return { sourceId: sourceId };
  };

  RegistryActions.prototype.addTarget = function addTarget(targetId) {
    return { targetId: targetId };
  };

  RegistryActions.prototype.removeSource = function removeSource(sourceId) {
    return { sourceId: sourceId };
  };

  RegistryActions.prototype.removeTarget = function removeTarget(targetId) {
    return { targetId: targetId };
  };

  return RegistryActions;
})(_flummox.Actions);

exports['default'] = RegistryActions;
module.exports = exports['default'];