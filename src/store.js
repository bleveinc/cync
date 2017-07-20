import Immutable, { Map } from 'immutable'
import Cursor from 'immutable-cursor'

import { isImmutable } from './utils'
import createContainer from './container'

// Use symbols to help prevent access to internals
const __state__ = Symbol('state')
const __lastState__ = Symbol('lastState')
const __containers__ = Symbol('containers')
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
class Store {

  constructor(props) {
    let state = (props || {})
    this[__lastState__] = null
    this[__state__] = isImmutable(state, Map) ? state : new Map(state)
    this[__containers__] = []
  }

  setState(obj, fn = () => {}) {
    let cb = fn
    let _newState = isImmutable(obj, Map) ? obj : new Map(obj)
    let _state = this[__state__]

    if (Immutable.is(_newState, _state)) {
      cb()
      return
    }

    this[__lastState__] = _state
    this[__state__] = _newState

    this._stateDidChange(this[__state__])
    cb(this[__state__])
  }

  clearState() {
    this[__lastState__] = new Map()
    this[__state__] = new Map()
  }

  get(item) {
    let itm = item.split('.')
    return itm.length === 1
      ? this[__state__].get(item)
      : this[__state__].getIn(itm)
  }

  has(item) {
    let itm = item.split('.')
    return itm.length === 1
      ? this[__state__].has(item)
      : this[__state__].hasIn(itm)
  }

  delete(item) {
    let itm = item.split('.')
    return itm.length === 1
      ? this[__state__].delete(item)
      : this[__state__].deleteIn(itm)
  }

  getCursor(path, onChange = () => {}) {
    return Cursor.from(this[__state__], path, onChange)
  }

  set(field, value, cb = () => {}) {
    const fld = field.split('.')
    let newState = (fld.length === 1)
      ? this[__state__].set(field, value)
      : this[__state__].setIn(fld, value)
    this.setState(newState, cb)
  }

  update(field, cb = () => {}) {
    const fld = field.split('.')
    let newState = (fld.length > 1)
      ? this[__state__].update(field, value)
      : this[__state__].updateIn(fld, value)
    this.setState(newState, cb)
  }

  get lastState() {
    return this[__lastState__]
  }

  get state() {
    return this[__state__]
  }

  _stateDidChange() {
    this._storeDidUpdate()
  }

  isIn(immObj, path) {
    let _v = this[__state__].getIn(path)
    return Immutable.is(_v, immObj)
  }

  _storeDidUpdate() {
    Object.keys(this[__containers__]).forEach(c => {
      this[__containers__][c].forEach(fn => {
        let lastState = this.lastState.getIn([...c.split('.')])
        let newState = this.state.getIn([...c.split('.')])
        if (Immutable.is(lastState, newState)) { return }
        fn(newState, c)
      })
    })
  }

  offStoreDidUpdate(path, fn) {
    let callbacks = this[__containers__][path]

    if (!Array.isArray(callbacks)) { return }

    for (let i = callbacks.length - 1; i >= 0; i -= 1) {
      let cb = callbacks[i]
      if (cb === fn) {
        if (callbacks.length === 1) {
          delete this[__containers__][path]
          break
        }

        callbacks.splice(i, 1)
        break
      }
    }
  }

  onStoreDidUpdate(path, fn) {
    if (!Array.isArray(this[__containers__][path])) {
      this[__containers__][path] = []
    }
    this[__containers__][path].push(fn)
  }

  createContainer(el, vars = {}) {
    return createContainer(this, el, vars)
  }
}

export default Store
