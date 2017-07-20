
import React, { Component } from 'react'

export default function createContainer(store, el, fields = {}) {
  // var names
  let vars = Object.keys(fields)
  // path names
  let paths = []

  // create map of path => var
  let ptv = {}
  vars.forEach(p => {
    // add to path name array
    paths.push(fields[p])

    ptv[fields[p]] = p
  })

  class Container extends Component {
    static navigationOptions = el.navigationOptions

    constructor(props) {
      super(props)
      let state = {}
      vars.forEach(v => {
        state[v] = store.get(fields[v])
      })
      this.state = state
    }

    componentDidMount() {
      paths.forEach(p => {
        store.onStoreDidUpdate(p, this.handleStoreDidUpdate)
      })
    }

    componentWillUnMount() {
      paths.forEach(p => {
        store.offStoreDidUpdate(p, this.handleStoreDidUpdate)
      })
    }

    handleStoreDidUpdate = (data, path) => {
      this.setState({ [ptv[path]]: data })
    }

    render() { return React.createElement(el, { ...this.state, ...this.props, store }) }
  }

  Object.keys(el).forEach(k => {
    if (k === 'state') { return }
    Container[k] = el[k]
  })

  return Container
}
