'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.Store = undefined;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Store = _store2.default;
exports.Component = _component2.default;
exports.default = {
  Store: _store2.default,
  Component: _component2.default
};