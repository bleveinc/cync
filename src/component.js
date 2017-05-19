'use strict'

import React from 'react';
import Immutable from 'immutable';
import Store from './store';
import { shallowEqual } from './utils';

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

class Component extends React.Component {
  static propTypes = {
    store: React.PropTypes.object,
    children: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.store = (typeof props.store === 'undefined') ? new Store() : props.store;
    this.state = this.store.state.toObject();
    this.store._stateDidChange = (storeState) => {
      Store.prototype._stateDidChange.call(this.store, storeState);
      this._syncWithStore(storeState);
    };
  }

  shouldComponentSync() {
    return true;
  }

  _syncWithStore(storeState) {
    if (Immutable.is(storeState, Immutable.Map(this.state))) {
      return false;
    }
    if (!this.shouldComponentSync(storeState)) {
      return false;
    }

    this.setState(storeState.toObject());
  }

  componentWillUpdate(nextProps, nextState) {
    if (!Immutable.is(this.store.state, Immutable.Map(nextState))) {
      this.store.setState(nextState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (!shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState));
  } 

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {data: this.state, store: this.store });
  }
}

export default Component;
