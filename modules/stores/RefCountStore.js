'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _flummox = require('flummox');

var RefCountStore = (function (_Store) {
  _inherits(RefCountStore, _Store);

  function RefCountStore(flux) {
    _classCallCheck(this, RefCountStore);

    _Store.call(this);

    var registryActionIds = flux.registryActionIds;

    this.register(registryActionIds.addSource, this.addRef);
    this.register(registryActionIds.addTarget, this.addRef);
    this.register(registryActionIds.removeSource, this.removeRef);
    this.register(registryActionIds.removeTarget, this.removeRef);

    this.state = {
      refCount: 0
    };
  }

  RefCountStore.prototype.addRef = function addRef() {
    this.setState({
      refCount: this.state.refCount + 1
    });
  };

  RefCountStore.prototype.removeRef = function removeRef() {
    this.setState({
      refCount: this.state.refCount - 1
    });
  };

  RefCountStore.prototype.hasRefs = function hasRefs() {
    return this.state.refCount > 0;
  };

  return RefCountStore;
})(_flummox.Store);

exports['default'] = RefCountStore;
module.exports = exports['default'];