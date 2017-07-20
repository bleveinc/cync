'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _immutableCursor = require('immutable-cursor');

var _immutableCursor2 = _interopRequireDefault(_immutableCursor);

var _utils = require('./utils');

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Use symbols to help prevent access to internals
var __state__ = Symbol('state');
var __lastState__ = Symbol('lastState');
var __containers__ = Symbol('containers');
/**
 * Cync.Store Data Store
 *
 * Examples:
 *    // extend Cync Store
 *    class MyStore extends Cync.Store {
 *      constructor(state) {
 *        super(state)
 *      }
 *      ...
 *    }
 *
 */

var Store = function () {
  function Store(props) {
    _classCallCheck(this, Store);

    var state = props || {};
    this[__lastState__] = null;
    this[__state__] = (0, _utils.isImmutable)(state, _immutable.Map) ? state : new _immutable.Map(state);
    this[__containers__] = [];
  }

  _createClass(Store, [{
    key: 'setState',
    value: function setState(obj) {
      var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var cb = fn;
      var _newState = (0, _utils.isImmutable)(obj, _immutable.Map) ? obj : new _immutable.Map(obj);
      var _state = this[__state__];

      if (_immutable2.default.is(_newState, _state)) {
        cb();
        return;
      }

      this[__lastState__] = _state;
      this[__state__] = _newState;

      this._stateDidChange(this[__state__]);
      cb(this[__state__]);
    }
  }, {
    key: 'clearState',
    value: function clearState() {
      this[__lastState__] = new _immutable.Map();
      this[__state__] = new _immutable.Map();
    }
  }, {
    key: 'get',
    value: function get(item) {
      var itm = item.split('.');
      return itm.length === 1 ? this[__state__].get(item) : this[__state__].getIn(itm);
    }
  }, {
    key: 'has',
    value: function has(item) {
      var itm = item.split('.');
      return itm.length === 1 ? this[__state__].has(item) : this[__state__].hasIn(itm);
    }
  }, {
    key: 'delete',
    value: function _delete(item) {
      var itm = item.split('.');
      return itm.length === 1 ? this[__state__].delete(item) : this[__state__].deleteIn(itm);
    }
  }, {
    key: 'getCursor',
    value: function getCursor(path) {
      var onChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      return _immutableCursor2.default.from(this[__state__], path, onChange);
    }
  }, {
    key: 'set',
    value: function set(field, value) {
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var fld = field.split('.');
      var newState = fld.length === 1 ? this[__state__].set(field, value) : this[__state__].setIn(fld, value);
      this.setState(newState, cb);
    }
  }, {
    key: 'update',
    value: function update(field) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var fld = field.split('.');
      var newState = fld.length > 1 ? this[__state__].update(field, value) : this[__state__].updateIn(fld, value);
      this.setState(newState, cb);
    }
  }, {
    key: '_stateDidChange',
    value: function _stateDidChange() {
      this._storeDidUpdate();
    }
  }, {
    key: 'isIn',
    value: function isIn(immObj, path) {
      var _v = this[__state__].getIn(path);
      return _immutable2.default.is(_v, immObj);
    }
  }, {
    key: '_storeDidUpdate',
    value: function _storeDidUpdate() {
      var _this = this;

      Object.keys(this[__containers__]).forEach(function (c) {
        _this[__containers__][c].forEach(function (fn) {
          var lastState = _this.lastState.getIn([].concat(_toConsumableArray(c.split('.'))));
          var newState = _this.state.getIn([].concat(_toConsumableArray(c.split('.'))));
          if (_immutable2.default.is(lastState, newState)) {
            return;
          }
          fn(newState, c);
        });
      });
    }
  }, {
    key: 'offStoreDidUpdate',
    value: function offStoreDidUpdate(path, fn) {
      var callbacks = this[__containers__][path];

      if (!Array.isArray(callbacks)) {
        return;
      }

      for (var i = callbacks.length - 1; i >= 0; i -= 1) {
        var cb = callbacks[i];
        if (cb === fn) {
          if (callbacks.length === 1) {
            delete this[__containers__][path];
            break;
          }

          callbacks.splice(i, 1);
          break;
        }
      }
    }
  }, {
    key: 'onStoreDidUpdate',
    value: function onStoreDidUpdate(path, fn) {
      if (!Array.isArray(this[__containers__][path])) {
        this[__containers__][path] = [];
      }
      this[__containers__][path].push(fn);
    }
  }, {
    key: 'createContainer',
    value: function createContainer(el) {
      var vars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return (0, _container2.default)(this, el, vars);
    }
  }, {
    key: 'lastState',
    get: function get() {
      return this[__lastState__];
    }
  }, {
    key: 'state',
    get: function get() {
      return this[__state__];
    }
  }]);

  return Store;
}();

exports.default = Store;