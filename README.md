# Cync

Flux simplified with an [Immutable][0] data store that stays insync with your react component.

## Store

Stores are used to maintain a central state and define functions to manipulate that state using [Immutable][0] types.  
If an object is passed in to the Store constructor it will be converted to [Immutable][0] types where possible

```js
class MyStore extends Cync.Store {
  constructor(props) {
    super(props)
  }

  addLike(data) {
    // Shorthand function to update the user and set the new value in the Store state
    this.set('user.likes', data)
  }
  ...
}

// If an object is passed in to the Store constructor it will be converted to Immutable types where possible
export default new MyStore(...)
```

### Built-in fields

#### state

The current state data of the store

#### lastState

The state data of the store before the last state change

### Built-in functions

#### setState(newState, callback)

Similar to React's set state function `setState` will update the Stores state with the new [Immutable][0] value

#### clearState()

Reset the Stores to an empty state

#### get(fieldPath)

Get the value for a given Store fieldPath

#### has(fieldPath)

Check if a value exists for a given Store fieldPath

#### delete(fieldPath)

Delete the key and value for a given Store fieldPath

#### update(fieldPath, callback)

Update the value for a given Store fieldPath

#### onStoreDidUpdate(fieldPath, callback)

Watch a Store fieldPath for changes

#### offStoreDidUpdate(fieldPath, callback)

Remove watcher for Store fieldPath

#### createContainer(ReactComponent, { key: fieldPath, ... })

Creates a wrapper around the given ReactComponent that watches the defined fieldPaths in the Store and passes them in as props to the component using the given key as the prop name 

## Container

Containers are used to automatically pass Store values into your component as they change.

```js
class News extends React.Component {

  handleButtonPress = (evt) => {
    // The store instance is also passed in as a prop
    this.props.store.addLike(...)
  }

  render() {
    // container values are passed in as props
    let { feed, likes, bookmarks } = this.props
    ...
  }
}

// Use your Store instance to create a Cync Container to automatically
// pass props in to your component. When the values are changed in the Store
// the new values are automatically passed into the component
export default Store.createContainer(News, {
  // The key (ex. `likes`) is the name of the prop you want the values to be passed in as
  // The value (ex. 'user.likes') is the Store value you wish to watch
  likes: 'user.likes',
  feed: 'feed',
  bookmarks: 'user.bookmarks',
})
```

## License

MIT

Copyright 2017 BLeve, Inc.

[0]: https://facebook.github.io/immutable-js/ 'Immutable'
