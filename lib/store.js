'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _immutableCursor = require('immutable-cursor');

var _immutableCursor2 = _interopRequireDefault(_immutableCursor);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NOOP = function NOOP() {};

// Use symbols to help prevent access to internals
var __state__ = '_state_';
var __lastState__ = '_lastState_';
var __containers__ = '_containers_';
/**
 * Cync.Store Data Store
 *
 * Examples:
 *    // extend Cync Store
 *    class MyStore extends Cync.Store {
 *      constructor(state) {
 *        super(state);
 *        export
 *      }
 *      ...
 *    }
 *
 */

var Store = exports.Store = function () {
  function Store(props) {
    _classCallCheck(this, Store);

    var state = props || {};
    this[__lastState__] = this[__state__] = (0, _utils.isImmutable)(state, _immutable.Map) ? state : new _immutable.Map(state);
    this[__containers__] = [];
  }

  _createClass(Store, [{
    key: 'setState',
    value: function setState(obj, fn) {
      var cb = fn || NOOP;
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
    key: 'get',
    value: function get(item) {
      var itm = item.split('.');
      return itm.length === 1 ? this[__state__].get(item) : this[__state__].getIn(itm);
    }
  }, {
    key: 'getCursor',
    value: function getCursor(path, fn, returnPath) {
      var _this = this;

      var onChange = fn ? fn : function () {};
      var _path = returnPath ? returnPath : path;
      return _immutableCursor2.default.from(this[__state__], path, function (newState) {
        _this.setState(newState);
        onChange(newState.getIn(_path));
      });
    }
  }, {
    key: 'set',
    value: function set(field, value) {
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var fld = field.split('.');
      var newState = fld.length === 1 ? this[__state__].set(field, value) : this[__state__].setIn(fld, value);
      this.setState(newState);
      cb(this[__state__]);
    }
  }, {
    key: 'update',
    value: function update(field) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var fld = field.split('.');
      var newState = fld.length > 1 ? this[__state__].update(field, value) : this[__state__].updateIn(fld, value);
      this.setState(newState);
      cb(this[__state__]);
    }
  }, {
    key: '_stateDidChange',
    value: function _stateDidChange(state) {
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
      var _this2 = this;

      Object.keys(this[__containers__]).forEach(function (c) {
        _this2[__containers__][c].forEach(function (fn) {
          var props = _this2.state.getIn([].concat(_toConsumableArray(c.split('.'))));
          fn(props);
        });
      });
    }
  }, {
    key: 'onStateDidUpdate',
    value: function onStateDidUpdate(path, fn) {
      Array.isArray(this[__containers__][path]) ? this[__containers__][path].push(fn) : this[__containers__][path] = [fn];
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