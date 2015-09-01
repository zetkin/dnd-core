'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _sources = require('./sources');

var _targets = require('./targets');

var _ = require('..');

describe('DragDropMonitor', function () {
  var manager = undefined;
  var backend = undefined;
  var registry = undefined;
  var monitor = undefined;

  beforeEach(function () {
    manager = new _.DragDropManager(_.createTestBackend);
    backend = manager.getBackend();
    registry = manager.getRegistry();
    monitor = manager.getMonitor();
  });

  describe('state change subscription', function () {
    it('throws on bad listener', function () {
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(function () {});
      }).to.not.throwError();

      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange();
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(42);
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange('hi');
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange({});
      }).to.throwError();
    });

    it('throws on bad handlerIds', function () {
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(function () {}, { handlerIds: [] });
      }).to.not.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(function () {}, { handlerIds: ['hi'] });
      }).to.not.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(function () {}, { handlerIds: {} });
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToStateChange(function () {}, { handlerIds: function handlerIds() {} });
      }).to.throwError();
    });

    it('allows to unsubscribe', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      var raisedChange = false;
      var unsubscribe = monitor.subscribeToStateChange(function () {
        raisedChange = true;
      });

      unsubscribe();
      _expectJs2['default'](unsubscribe).to.not.throwError();

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](raisedChange).to.equal(false);
    });

    it('raises global change event on beginDrag()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      monitor.subscribeToStateChange(done);
      backend.simulateBeginDrag([sourceId]);
    });

    it('raises local change event on sources and targets in beginDrag()', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);

      var raisedChangeForSourceA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceA = true;
      }, {
        handlerIds: [sourceAId]
      });

      var raisedChangeForSourceB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceB = true;
      }, {
        handlerIds: [sourceBId]
      });

      var raisedChangeForSourceAAndB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceAAndB = true;
      }, {
        handlerIds: [sourceAId, sourceBId]
      });

      var raisedChangeForTargetA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetA = true;
      }, {
        handlerIds: [targetAId]
      });

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](raisedChangeForSourceA).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceB).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceAAndB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
    });

    it('raises local change event on sources and targets in endDrag()', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);

      backend.simulateBeginDrag([sourceAId]);

      var raisedChangeForSourceA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceA = true;
      }, {
        handlerIds: [sourceAId]
      });

      var raisedChangeForSourceB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceB = true;
      }, {
        handlerIds: [sourceBId]
      });

      var raisedChangeForSourceAAndB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceAAndB = true;
      }, {
        handlerIds: [sourceAId, sourceBId]
      });

      var raisedChangeForTargetA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetA = true;
      }, {
        handlerIds: [targetAId]
      });

      backend.simulateEndDrag();
      _expectJs2['default'](raisedChangeForSourceA).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceB).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceAAndB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
    });

    it('raises local change event on sources and targets in drop()', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);

      backend.simulateBeginDrag([sourceAId]);
      backend.simulateHover([targetAId]);

      var raisedChangeForSourceA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceA = true;
      }, {
        handlerIds: [sourceAId]
      });

      var raisedChangeForSourceB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceB = true;
      }, {
        handlerIds: [sourceBId]
      });

      var raisedChangeForSourceAAndB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceAAndB = true;
      }, {
        handlerIds: [sourceAId, sourceBId]
      });

      var raisedChangeForTargetA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetA = true;
      }, {
        handlerIds: [targetAId]
      });

      backend.simulateDrop();
      _expectJs2['default'](raisedChangeForSourceA).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceB).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceAAndB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
    });

    it('raises local change event only on previous and next targets in hover()', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(_types2['default'].FOO, targetC);
      var targetD = new _targets.NormalTarget();
      var targetDId = registry.addTarget(_types2['default'].FOO, targetD);
      var targetE = new _targets.NormalTarget();
      var targetEId = registry.addTarget(_types2['default'].FOO, targetE);

      backend.simulateBeginDrag([sourceAId]);
      backend.simulateHover([targetAId, targetBId]);

      var raisedChangeForSourceA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceA = true;
      }, {
        handlerIds: [sourceAId]
      });

      var raisedChangeForSourceB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceB = true;
      }, {
        handlerIds: [sourceBId]
      });

      var raisedChangeForTargetA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetA = true;
      }, {
        handlerIds: [targetAId]
      });

      var raisedChangeForTargetB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetB = true;
      }, {
        handlerIds: [targetBId]
      });

      var raisedChangeForTargetC = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetC = true;
      }, {
        handlerIds: [targetCId]
      });

      var raisedChangeForTargetD = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetD = true;
      }, {
        handlerIds: [targetDId]
      });

      var raisedChangeForTargetE = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetE = true;
      }, {
        handlerIds: [targetEId]
      });

      var raisedChangeForSourceBAndTargetC = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceBAndTargetC = true;
      }, {
        handlerIds: [sourceBId, targetCId]
      });

      var raisedChangeForSourceBAndTargetE = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForSourceBAndTargetE = true;
      }, {
        handlerIds: [sourceBId, targetEId]
      });

      backend.simulateHover([targetDId, targetEId]);
      _expectJs2['default'](raisedChangeForSourceA).to.equal(false);
      _expectJs2['default'](raisedChangeForSourceB).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetC).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetD).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetE).to.equal(true);
      _expectJs2['default'](raisedChangeForSourceBAndTargetC).to.equal(false);
      _expectJs2['default'](raisedChangeForSourceBAndTargetE).to.equal(true);
    });

    it('raises local change event when target stops being or becomes innermost in hover()', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(_types2['default'].FOO, targetC);
      var targetD = new _targets.NormalTarget();
      var targetDId = registry.addTarget(_types2['default'].FOO, targetD);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetAId, targetBId, targetCId, targetDId]);

      var raisedChangeForTargetA = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetA = true;
      }, {
        handlerIds: [targetAId]
      });

      var raisedChangeForTargetB = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetB = true;
      }, {
        handlerIds: [targetBId]
      });

      var raisedChangeForTargetC = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetC = true;
      }, {
        handlerIds: [targetCId]
      });

      var raisedChangeForTargetD = false;
      monitor.subscribeToStateChange(function () {
        raisedChangeForTargetD = true;
      }, {
        handlerIds: [targetDId]
      });

      backend.simulateHover([targetAId, targetBId, targetCId]);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetB).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetC).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetD).to.equal(true);

      raisedChangeForTargetA = false;
      raisedChangeForTargetB = false;
      raisedChangeForTargetC = false;
      raisedChangeForTargetD = false;
      backend.simulateHover([targetAId, targetBId, targetCId, targetDId]);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetB).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetC).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetD).to.equal(true);

      raisedChangeForTargetA = false;
      raisedChangeForTargetB = false;
      raisedChangeForTargetC = false;
      raisedChangeForTargetD = false;
      backend.simulateHover([targetAId]);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetC).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetD).to.equal(true);

      raisedChangeForTargetA = false;
      raisedChangeForTargetB = false;
      raisedChangeForTargetC = false;
      raisedChangeForTargetD = false;
      backend.simulateHover([targetAId, targetBId]);
      _expectJs2['default'](raisedChangeForTargetA).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetB).to.equal(true);
      _expectJs2['default'](raisedChangeForTargetC).to.equal(false);
      _expectJs2['default'](raisedChangeForTargetD).to.equal(false);
    });

    it('raises global change event on endDrag()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);
      monitor.subscribeToStateChange(done);
      backend.simulateEndDrag();
    });

    it('raises global change event on drop()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetId]);

      monitor.subscribeToStateChange(done);
      backend.simulateDrop();
    });

    it('does not raise global change event if hover targets have not changed', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget({ a: 123 });
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.TargetWithNoDropResult();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);

      var raisedChange = false;
      monitor.subscribeToStateChange(function () {
        raisedChange = true;
      });

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](raisedChange).to.equal(true);
      raisedChange = false;

      backend.simulateHover([targetAId]);
      _expectJs2['default'](raisedChange).to.equal(true);
      raisedChange = false;

      backend.simulateHover([targetBId]);
      _expectJs2['default'](raisedChange).to.equal(true);
      raisedChange = false;

      backend.simulateHover([targetBId]);
      _expectJs2['default'](raisedChange).to.equal(false);

      backend.simulateHover([targetBId, targetAId]);
      _expectJs2['default'](raisedChange).to.equal(true);
      raisedChange = false;

      backend.simulateHover([targetBId, targetAId]);
      _expectJs2['default'](raisedChange).to.equal(false);

      backend.simulateHover([targetAId, targetBId]);
      _expectJs2['default'](raisedChange).to.equal(true);
      raisedChange = false;

      backend.simulateHover([targetAId, targetBId]);
      _expectJs2['default'](raisedChange).to.equal(false);
    });
  });

  describe('offset change subscription', function () {
    it('throws on bad listener', function () {
      _expectJs2['default'](function () {
        return monitor.subscribeToOffsetChange(function () {});
      }).to.not.throwError();

      _expectJs2['default'](function () {
        return monitor.subscribeToOffsetChange();
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToOffsetChange(42);
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToOffsetChange('hi');
      }).to.throwError();
      _expectJs2['default'](function () {
        return monitor.subscribeToOffsetChange({});
      }).to.throwError();
    });

    it('allows to unsubscribe', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      var raisedChange = false;
      var unsubscribe = monitor.subscribeToOffsetChange(function () {
        raisedChange = true;
      });

      unsubscribe();
      _expectJs2['default'](unsubscribe).to.not.throwError();

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 0, y: 0 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 0, y: 0 };
        }
      });
      _expectJs2['default'](raisedChange).to.equal(false);
    });

    it('throws when passing clientOffset without getSourceClientOffset', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      _expectJs2['default'](function () {
        return backend.simulateBeginDrag([sourceId], {
          clientOffset: { x: 0, y: 0 }
        });
      }).to.throwError();

      _expectJs2['default'](function () {
        return backend.simulateBeginDrag([sourceId], {
          clientOffset: { x: 0, y: 0 },
          getSourceClientOffset: { x: 0, y: 0 }
        });
      }).to.throwError();

      _expectJs2['default'](function () {
        return backend.simulateBeginDrag([sourceId], {
          clientOffset: { x: 0, y: 0 },
          getSourceClientOffset: function getSourceClientOffset() {
            return { x: 0, y: 0 };
          }
        });
      }).to.not.throwError();
    });

    it('sets source client offset from the innermost draggable source', function () {
      var sourceA = new _sources.NonDraggableSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var sourceC = new _sources.NormalSource();
      var sourceCId = registry.addSource(_types2['default'].FOO, sourceC);
      var sourceD = new _sources.NonDraggableSource();
      var sourceDId = registry.addSource(_types2['default'].FOO, sourceD);

      backend.simulateBeginDrag([sourceAId, sourceBId, sourceCId, sourceDId], {
        clientOffset: { x: 0, y: 0 },
        getSourceClientOffset: function getSourceClientOffset(sourceId) {
          return sourceId === sourceCId ? { x: 42, y: 0 } : { x: 0, y: 0 };
        }
      });

      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 42, y: 0 });
    });

    it('keeps track of offsets', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 50, y: 40 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 20, y: 10 };
        }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: 0, y: 0 });

      backend.simulateHover([targetId], {
        clientOffset: { x: 60, y: 70 }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 60, y: 70 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: 30, y: 40 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: 10, y: 30 });

      backend.simulateHover([targetId], {
        clientOffset: { x: 0, y: 0 }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 0, y: 0 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: -30, y: -30 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: -50, y: -40 });

      backend.simulateDrop();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 50, y: 40 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 20, y: 10 };
        }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: 0, y: 0 });

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);
    });

    it('keeps track of offsets when initial offset is not specified', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateHover([targetId], {
        clientOffset: { x: 60, y: 70 }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 60, y: 70 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateHover([targetId], {
        clientOffset: { x: 60, y: 70 }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 60, y: 70 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateDrop();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);
    });

    it('keeps track of offsets when current offset is not specified', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 50, y: 40 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 20, y: 10 };
        }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: 0, y: 0 });

      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateHover([targetId], {
        clientOffset: { x: 60, y: 70 }
      });
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.eql({ x: 20, y: 10 });
      _expectJs2['default'](monitor.getInitialClientOffset()).to.eql({ x: 50, y: 40 });
      _expectJs2['default'](monitor.getClientOffset()).to.eql({ x: 60, y: 70 });
      _expectJs2['default'](monitor.getSourceClientOffset()).to.eql({ x: 30, y: 40 });
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.eql({ x: 10, y: 30 });

      backend.simulateDrop();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.getInitialSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getInitialClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getSourceClientOffset()).to.equal(null);
      _expectJs2['default'](monitor.getDifferenceFromInitialOffset()).to.equal(null);
    });

    it('raises offset change event on beginDrag()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      monitor.subscribeToOffsetChange(done);
      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 0, y: 0 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 0, y: 0 };
        }
      });
    });

    it('raises offset change event on hover() if clientOffset changed', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 10, y: 10 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 0, y: 0 };
        }
      });

      monitor.subscribeToOffsetChange(done);
      backend.simulateHover([targetId], {
        clientOffset: { x: 20, y: 10 }
      });
    });

    it('does not raise offset change event on hover() when not tracking offset', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);

      var raisedChange = false;
      monitor.subscribeToOffsetChange(function () {
        raisedChange = true;
      });

      backend.simulateHover([targetId]);
      _expectJs2['default'](raisedChange).to.equal(false);
    });

    it('does not raise offset change event on hover() when clientOffset has not changed', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId], {
        clientOffset: { x: 100, y: 200 },
        getSourceClientOffset: function getSourceClientOffset() {
          return { x: 0, y: 0 };
        }
      });

      var raisedChange = false;
      monitor.subscribeToOffsetChange(function () {
        raisedChange = true;
      });

      backend.simulateHover([targetId], {
        clientOffset: { x: 100, y: 200 }
      });
      _expectJs2['default'](raisedChange).to.equal(false);
      backend.simulateHover([], {
        clientOffset: { x: 100, y: 200 }
      });
      _expectJs2['default'](raisedChange).to.equal(false);
      backend.simulateHover([targetId], {
        clientOffset: { x: 101, y: 200 }
      });
      _expectJs2['default'](raisedChange).to.equal(true);
    });

    it('raises offset change event on endDrag()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);
      monitor.subscribeToOffsetChange(done);
      backend.simulateEndDrag();
    });

    it('raises offset change event on drop()', function (done) {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetId]);

      monitor.subscribeToOffsetChange(done);
      backend.simulateDrop();
    });
  });

  describe('state tracking', function () {
    it('returns true from canDrag unless already dragging or drag source opts out', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var sourceC = new _sources.NormalSource();
      var sourceCId = registry.addSource(_types2['default'].BAR, sourceC);
      var sourceD = new _sources.NonDraggableSource();
      var sourceDId = registry.addSource(_types2['default'].FOO, sourceD);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.canDragSource(sourceAId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceBId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceCId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceDId)).to.equal(false);

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](monitor.canDragSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceDId)).to.equal(false);

      backend.simulateHover([targetId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.canDragSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceDId)).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.canDragSource(sourceAId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceBId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceCId)).to.equal(true);
      _expectJs2['default'](monitor.canDragSource(sourceDId)).to.equal(false);

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](monitor.canDragSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.canDragSource(sourceDId)).to.equal(false);
    });

    it('returns true from canDrop if dragging and type matches, unless target opts out', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(_types2['default'].BAR, targetC);
      var targetD = new _targets.NonDroppableTarget();
      var targetDId = registry.addTarget(_types2['default'].FOO, targetD);

      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateHover([targetAId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);
    });

    it('treats symbol types just like string types', function () {
      var FooType = Symbol();
      var BarType = Symbol();

      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(FooType, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(FooType, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget(FooType, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(BarType, targetC);
      var targetD = new _targets.NonDroppableTarget();
      var targetDId = registry.addTarget(FooType, targetD);

      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateHover([targetAId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetDId)).to.equal(false);
    });

    it('returns true from isDragging only while dragging', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var other = new _sources.NormalSource();
      var otherId = registry.addSource(_types2['default'].FOO, other);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(otherId)).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(otherId)).to.equal(false);

      backend.simulateHover([targetId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(otherId)).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(otherId)).to.equal(false);

      backend.simulateBeginDrag([otherId]);
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(otherId)).to.equal(true);
    });

    it('keeps track of dragged item, type and source handle', function () {
      var sourceA = new _sources.NormalSource({ a: 123 });
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource({ a: 456 });
      var sourceBId = registry.addSource(_types2['default'].BAR, sourceB);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.getItem()).to.equal(null);
      _expectJs2['default'](monitor.getItemType()).to.equal(null);
      _expectJs2['default'](monitor.getSourceId()).to.equal(null);

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](monitor.getItem().a).to.equal(123);
      _expectJs2['default'](monitor.getItemType()).to.equal(_types2['default'].FOO);
      _expectJs2['default'](monitor.getSourceId()).to.equal(sourceAId);

      backend.simulateHover([targetId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.getItem().a).to.equal(123);
      _expectJs2['default'](monitor.getItemType()).to.equal(_types2['default'].FOO);
      _expectJs2['default'](monitor.getSourceId()).to.equal(sourceAId);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.getItem()).to.equal(null);
      _expectJs2['default'](monitor.getItemType()).to.equal(null);
      _expectJs2['default'](monitor.getSourceId()).to.equal(null);

      backend.simulateBeginDrag([sourceBId]);
      registry.removeSource(sourceBId);
      _expectJs2['default'](monitor.getItem().a).to.equal(456);
      _expectJs2['default'](monitor.getItemType()).to.equal(_types2['default'].BAR);
      _expectJs2['default'](monitor.getSourceId()).to.equal(sourceBId);
    });

    it('keeps track of drop result and whether it occured', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget({ a: 123 });
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.TargetWithNoDropResult();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);

      _expectJs2['default'](monitor.didDrop()).to.equal(false);
      _expectJs2['default'](monitor.getDropResult()).to.equal(null);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.didDrop()).to.equal(false);
      _expectJs2['default'](monitor.getDropResult()).to.equal(null);

      backend.simulateHover([targetAId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.didDrop()).to.equal(true);
      _expectJs2['default'](monitor.getDropResult()).to.eql({ a: 123 });

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.didDrop()).to.equal(false);
      _expectJs2['default'](monitor.getDropResult()).to.equal(null);

      backend.simulateBeginDrag([sourceId]);
      _expectJs2['default'](monitor.didDrop()).to.equal(false);
      _expectJs2['default'](monitor.getDropResult()).to.equal(null);

      backend.simulateHover([targetBId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.didDrop()).to.equal(true);
      _expectJs2['default'](monitor.getDropResult()).to.eql({});

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.didDrop()).to.equal(false);
      _expectJs2['default'](monitor.getDropResult()).to.equal(null);
    });
  });

  describe('multi-type targets', function () {
    it('takes all types into consideration', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].BAZ, sourceB);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget([_types2['default'].FOO, _types2['default'].BAR], targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget([_types2['default'].BAR, _types2['default'].BAZ], targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget([_types2['default'].FOO, _types2['default'].BAR, _types2['default'].BAZ], targetC);

      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(true);

      backend.simulateHover([targetAId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(false);

      backend.simulateBeginDrag([sourceBId]);
      _expectJs2['default'](monitor.canDropOnTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.canDropOnTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.canDropOnTarget(targetCId)).to.equal(true);
    });

    it('returns false from isDragging(sourceId) if source is not published', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulateBeginDrag([sourceId], { publishSource: false });
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulatePublishDragSource();
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(true);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);
    });

    it('ignores publishDragSource() outside dragging operation', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);

      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulatePublishDragSource();
      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulateBeginDrag([sourceId], { publishSource: false });
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulatePublishDragSource();
      _expectJs2['default'](monitor.isDragging()).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(true);

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);

      backend.simulatePublishDragSource();
      _expectJs2['default'](monitor.isDragging()).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceId)).to.equal(false);
    });
  });

  describe('target handle tracking', function () {
    it('treats removing a hovered drop target as unhovering it', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.getTargetIds().length).to.be(1);
      _expectJs2['default'](monitor.isOverTarget(targetId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetId, { shallow: true })).to.equal(true);

      registry.removeTarget(targetId);
      _expectJs2['default'](monitor.getTargetIds().length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetId, { shallow: true })).to.equal(false);
    });

    it('keeps track of target handles', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(_types2['default'].FOO, targetC);

      var handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);

      backend.simulateBeginDrag([sourceId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateHover([]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateHover([targetAId, targetBId, targetCId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(3);
      _expectJs2['default'](handles[0]).to.equal(targetAId);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[1]).to.equal(targetBId);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[2]).to.equal(targetCId);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(true);

      backend.simulateHover([targetCId, targetBId, targetAId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(3);
      _expectJs2['default'](handles[0]).to.equal(targetCId);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[1]).to.equal(targetBId);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[2]).to.equal(targetAId);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(true);
    });

    it('resets target handles on drop', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      var handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetId]);
      backend.simulateDrop();
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);

      backend.simulateEndDrag();
      backend.simulateBeginDrag([sourceId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
    });

    it('resets target handles on endDrag', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      var handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover([targetId]);
      backend.simulateEndDrag();
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);

      backend.simulateBeginDrag([sourceId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
    });

    it('counts non-droppable targets, but skips targets of another type', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NonDroppableTarget();
      var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
      var targetC = new _targets.NormalTarget();
      var targetCId = registry.addTarget(_types2['default'].BAR, targetC);

      var handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateBeginDrag([sourceId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateHover([]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(0);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateHover([targetAId, targetBId, targetCId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(3);
      _expectJs2['default'](handles[0]).to.equal(targetAId);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[1]).to.equal(targetBId);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[2]).to.equal(targetCId);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateHover([targetCId, targetBId, targetAId]);
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles.length).to.be(3);
      _expectJs2['default'](handles[0]).to.equal(targetCId);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[1]).to.equal(targetBId);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](handles[2]).to.equal(targetAId);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(true);

      backend.simulateHover([targetBId]);
      backend.simulateDrop();
      handles = monitor.getTargetIds();
      _expectJs2['default'](handles[0]).to.equal(targetBId);
      _expectJs2['default'](handles.length).to.be(1);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);

      backend.simulateEndDrag();
      _expectJs2['default'](handles[0]).to.equal(targetBId);
      _expectJs2['default'](handles.length).to.be(1);
      _expectJs2['default'](monitor.isOverTarget(targetAId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetAId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetBId, { shallow: true })).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetCId, { shallow: true })).to.equal(false);
    });

    it('correctly handles isOverTarget() for multi-type targets', function () {
      var sourceA = new _sources.NormalSource();
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NormalSource();
      var sourceBId = registry.addSource(_types2['default'].BAR, sourceB);
      var sourceC = new _sources.NormalSource();
      var sourceCId = registry.addSource(_types2['default'].BAZ, sourceC);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget([_types2['default'].FOO, _types2['default'].BAR], target);

      backend.simulateBeginDrag([sourceAId]);
      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.isOverTarget(targetId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetId, { shallow: true })).to.equal(true);

      backend.simulateEndDrag();
      backend.simulateBeginDrag([sourceBId]);
      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.isOverTarget(targetId)).to.equal(true);
      _expectJs2['default'](monitor.isOverTarget(targetId, { shallow: true })).to.equal(true);

      backend.simulateEndDrag();
      backend.simulateBeginDrag([sourceCId]);
      backend.simulateHover([targetId]);
      _expectJs2['default'](monitor.isOverTarget(targetId)).to.equal(false);
      _expectJs2['default'](monitor.isOverTarget(targetId, { shallow: true })).to.equal(false);
    });

    it('does not let array mutation corrupt internal state', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);
      var handles = [targetId];

      backend.simulateBeginDrag([sourceId]);
      backend.simulateHover(handles);
      _expectJs2['default'](monitor.getTargetIds().length).to.be(1);

      handles.push(targetId);
      _expectJs2['default'](monitor.getTargetIds().length).to.be(1);
    });
  });

  describe('mirror drag sources', function () {
    it('uses custom isDragging functions', function () {
      var sourceA = new _sources.NumberSource(1, true);
      var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
      var sourceB = new _sources.NumberSource(2, true);
      var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
      var sourceC = new _sources.NumberSource(3, true);
      var sourceCId = registry.addSource(_types2['default'].BAR, sourceC);
      var sourceD = new _sources.NumberSource(4, false);
      var sourceDId = registry.addSource(_types2['default'].FOO, sourceD);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceDId)).to.equal(false);

      backend.simulateBeginDrag([sourceAId]);
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceDId)).to.equal(false);

      sourceA.number = 3;
      sourceB.number = 1;
      sourceC.number = 1;
      sourceD.number = 1;
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceDId)).to.equal(true);

      registry.removeSource(sourceDId);
      backend.simulateHover([targetId]);
      backend.simulateDrop();
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](function () {
        return monitor.isDraggingSource(sourceDId);
      }).to.throwError();

      backend.simulateEndDrag();
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](function () {
        return monitor.isDraggingSource(sourceDId);
      }).to.throwError();

      backend.simulateBeginDrag([sourceBId]);
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(false);
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(true);
      _expectJs2['default'](monitor.isDraggingSource(sourceCId)).to.equal(false);
      _expectJs2['default'](function () {
        return monitor.isDraggingSource(sourceDId);
      }).to.throwError();

      sourceA.number = 1;
      _expectJs2['default'](monitor.isDraggingSource(sourceAId)).to.equal(true);

      sourceB.number = 5;
      _expectJs2['default'](monitor.isDraggingSource(sourceBId)).to.equal(false);
    });
  });
});