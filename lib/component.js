'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Cync.Component React Component
 * When subclassing if `componentWillUpdate` or `shouldComponentUpdate` are
 * overridden a call to the `super` function is required.
 *
 * Examples:
 *    // Extend Cync.Component
 *    class MyComponent extends Cync.Component {
 *      render() {
 *        return <span/>;
 *      }
 *    }
 *
 *    // Component Wrapper Store and Store State passed directly to Child
 *    // store => `this.props.store`
 *    // wrapper state => `this.props.data`
 *    ...
 *    componentWillUpdate(nextProps, nextState) {
 *      super.componentWillUpdate(nextProps, nextState);
 *      ...
 *    }
 *
 *    render() {
 *      return (
 *        <Cync.Component>
 *          <SomeComponent/>
 *        </Cync.Component>
 *      );
 *    }
 *    ...
 */

var Component = function (_React$Component) {
  _inherits(Component, _React$Component);

  function Component(props) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, props));

    _this.store = typeof props.store === 'undefined' ? new _store2.default() : props.store;
    _this.state = _this.store.state.toObject();
    _this.store._stateDidChange = function (storeState) {
      _store2.default.prototype._stateDidChange.call(_this.store, storeState);
      _this._syncWithStore(storeState);
    };
    return _this;
  }

  _createClass(Component, [{
    key: 'shouldComponentSync',
    value: function shouldComponentSync() {
      return true;
    }
  }, {
    key: '_syncWithStore',
    value: function _syncWithStore(storeState) {
      if (_immutable2.default.is(storeState, _immutable2.default.Map(this.state))) {
        return false;
      }
      if (!this.shouldComponentSync(storeState)) {
        return false;
      }

      this.setState(storeState.toObject());
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (!_immutable2.default.is(this.store.state, _immutable2.default.Map(nextState))) {
        this.store.setState(nextState);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utils.shallowEqual)(this.props, nextProps) || !(0, _utils.shallowEqual)(this.state, nextState);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.cloneElement(_react2.default.Children.only(this.props.children), { data: this.state, store: this.store });
    }
  }]);

  return Component;
}(_react2.default.Component);

Component.propTypes = {
  store: _react2.default.PropTypes.object,
  children: _react2.default.PropTypes.array
};
exports.default = Component;