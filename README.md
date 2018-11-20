# The Metamatic State Manager 2.0 

## Introduction

The Metamatic framework is a simple and clutter-free state manager for JavaScript apps for developers who want to get
things actually done instead of just talking. Metamatic provides a robust toolset for data communication between components
inside your browser-based UI software. It can be used together with any modern JavaScript UI framework such as Vue, React, Angular and even basic JavaScript apps
without any specific frameworks.

### The Metamatic Concept

The Metamatic framework solves a fundamental problem in frontend software design: When any data is changed anywhere in the application, 
this change must be reliably radiated to all parts of the software that uses that data. For example, your frontend app has many components that display
user's order history. When that data changes it should be consistently updated in all parts of the app.

Metamatic provides an easy way to manage your data stores and states inside them.

### Persistent States

Being tired of web portals that forget their state or get strangely messed when the browser is refreshed? Metamatic solves this problem by offering
various out-of-the-box persistency modes, *localStorage*, *sessionStorage* and *memoryStorage*. Meaning, the web site remains exactly in the same state
as it was before you refreshed the browser.

### Say Goodbye to Manual *Switch-Cases*

Metamatic has fundamental differences to some well-known state manager frameworks. Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handleEvent** or **connectToStore** function. When the listener functions inside components are already inherently connected to their data source, 
you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event. 
Simplistic and clean code prevents the application from turning into buggy bubble gum that is too expensive to maintain.

Metamatic frees you from the need to manually write switch-case structures since it connects states to their listeners silently using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore.

### Clean Solution without "Provider" Clutter

One major difference to verbose state manager frameworks is that you don't really need to "pre-configure" your app to use Metamatic. You don't
need to wrap your application inside obscure "Provider" wrappers and you don't need to "inject stores" and other structures to your classes to enable a state
container. Any class, component, object or helper function can be connected to Metamatic features at any point of the project without any need to do major 
refactoring to existing application logic or code structure. You can use Metamatic functions on the fly anywhere inside your app, any time. 
If your application already uses some other state container framework, you can still introduce Metamatic into your app without removing or changing anything that already exists.

### Robust State-Based Solution Without Props-Hassle

A major innovation within the Metamatic Framework is that it eliminates the props vs. states dilemma that most state container frameworks seem to have. 
In Metamatic, the root states are called **stores**. Stores can have nested properties, which are all understood as nested **states**.
You can connect any component to listen to entire stores as well as just one nested state deep inside a store.

## News

### Version 2.0 is out!

Metamatic Version 2.0 is now out. Metamatic 2.0.0 differs fundamentally from previous versions. The newest Metamatic framework implementation is based
on real-world use cases when implementing a complex business frontend.

## Source Code

The Metamatic is available as [installable package at Npmjs.com](https://www.npmjs.com/package/metamatic).  
You can also explore the [Metamatic source code at GitHub](https://github.com/develprr/metamatic-framework). 
Or visit the official Metamatic home page at [www.metamatic.net](http://www.metamatic.net).

## Installing Metamatic

Type:

```js
npm i --save metamatic
```
## Managing Stores

### Select Persistency Strategy

In your app's starting point, for instance Main.js file, configure Metamatic to use any of the three available persistency modes calling

**useLocalStorage()**, **useSessionStorage()** or **useMemoryStorage()**

from which localStorage is set on by default.

### Define Your Stores as Constants

A good practice is to write constants for all your stores in the app. Using constants limits the risk of mistyping names:

```js
export const STORE_USER_INFO = 'STORE_USER_INFO';
export const STORE_CAR_OPTIONS = 'STORE_CAR_OPTIONS';
```

A good place to define store constants is inside your store utility files (equivalent of 'reducers') that update those stores anyway.

### Initializing Stores

Initializing a one Metamatic store can be done with **initStore** function. *initStore* is practical because it won't overwrite any existing states inside a store 
if the store already exists
```js
import {initStore} from 'metamatic';

initStore(STORE_USER_INFO, {
  username: 'Some new userName'
});
```

Initializing many Metamatic stores simultaneously with **initStores**:

```js
import {initStores} from 'metamatic';

initStores({
  [STORE_USER_INFO]: {
    username: 'Some new userName'
  },
  [STORE_CAR_OPTIONS]: {
    options: [
        {
          key: 'tesla',
          label: 'Tesla'
        },
        {
           key: 'toyota',
           label: 'Toyota'
        }
    ]
  }
});
```

Or if you don't want too many stores, set many states under one store:
```js
initStore(STORE_USER_DATA, {
  username: 'Jon Doe',
  carOptions: [
    {
      key: 'tesla',
      label: 'Tesla'
    },
    {
       key: 'toyota',
       label: 'Toyota'
    }
  ]
});
```

### Updating Stores

When updating stores with **updateStore** or **updateStores** function, the states inside an existing store or stores are merged with the new incoming object.
Those values that are not defined in updater object will remain untouched in the Metamatic store.

```js

import {updateStore} from 'metamatic';

updateStore(STORE_USER_INFO, {
  streetAddress: 'Some new userName'
});
```
The example above will overwrite or set 'streetAddress' state but lets username remain as is. updateStore returns the new combined object:

```js
const mergedObject = updateStore(STORE_USER_INFO, {
  streetAddress: 'Some new userName'
});
```

To update many stores simultaneously:

```js

import {updateStores} from 'metamatic';

updateStores({
   [STORE_USER_INFO]: {
     streetAddress: 'Jon Doe Street 3'
   },
   [STORE_CAR_OPTIONS]: {
     options: [
         {
           key: 'tesla',
           label: 'Tesla',
           active: true
         },
         {
            key: 'toyota',
            label: 'Toyota'
         }
     ]
   }
 })
```

## Rewriting and Clearing Stores

Functions **setStore** and **setStores** work similarly to *updateStore* and *updateStores* except they completely overwrite the store or stores with the new one.
**clearStore** empties a store. Function **existsStore** can be used if a store exists.
 

## Connecting React Components to Stores

Connecting a React component to listen for an entire store can be done with **connectToStore** and **connectToStores**. In ReactJS, 
use **componentDidMount** life cycle callback to connect your component to Metamatic stores, for example:

```js
export class SomeReactComponent extends Component {
  
  constructor(props
  ) {
    super(props);
    this.state = {};
  }
  
  componentDidMount = () => connectToStores(this, {
      [STORE_USER_INFO]: (userInfo) => this.setState({
        ...this.state,
        userInfo
      }),
      [STORE_CAR_INFO]: (carInfo) => this.setState({
        ...this.state,
        myCarInfo: carInfo
      })
    });
}
```

The example above merges two entire stores with React component's existing state, *STORE_USER_INFO* as local nested state *userInfo* and *STORE_CAR_INFO*
as nested state *myCarInfo*.

To only connect to one store: 

```js
componentDidMount = () => connectToStore(this, STORE_CAR_INFO, (carInfo) => this.setState({
  ...this.state,
  myCarInfo: carInfo
});

```

There is a caveat, however! Every time either *STORE_USER_INFO* or *STORE_CAR_INFO* states are changed it will cause the component to be re-rendered even 
if there was nothing relevant in those stores for this given component. In such case, you don't want unnecessary component updates to happen. 
For this, use **connectToStates** to rather connect the listener component to a particular nested substate or substates inside a store:

```js

componentDidMount = () => connectToStates(this, STORE_USER_INFO, {
   'address.streetAddress': (streetAddress) => this.setState({
      ...this.state,
      streetAddress
    }),
   'orderHistory.latestOrder': (latestOrder) => this.setState({
        ...this.state,
        latestOrder
    })}
)

```
In the example above, component is connected to two different nested states inside *STORE_USER_INFO*. Only a change in a nested state *streetAdress*  inside *address* state
and *latestOrder* change in *orderHistory* state will cause the component to update through its *setState* native function call.

## Disconnecting Components from Metamatic Stores 

Disconnecting a component from MetaStore upon unmounting:

```js
disconnectFromStores(this);
```

To call disconnect inside **componentWillUnmount** React life cycle function:

```js
componentWillUnmount = () => disconnectFromStores(this);
```

## Basic Event Handling with Metamatic

But when you want to handle Metamatic events inside components that don't need to be unmounted or any static methods and utility functions,
simply use **handleEvent** and **handleEvents** functions for registering handlers for Metamatic events:

```js

import {handleEvent} from 'metamatic';

handleEvent('MY-EVENT', (item) => {
  console.log('I process the event here..');
  console.log(item);
});
```

and many events:

```js

import {handleEvents} from 'metamatic';

handleEvents({
  'MY-EVENT': (item) => {
    console.log('I process the event here..');
    console.log(item);
  },
  
  'OTHER-EVENT': (item) => {
      console.log('I process another one here..');
      console.log(item);
    },

});
```

Similarly, broadcast an event into app-wide bit-space to be processed with all event handlers, use **broadcastEvent** function:

```js
import {broadcastEvent} from 'metamatic';

broadcastEvent('SOME-EVENT', {something: 'here'});
```


## License 

Apache 2.0

## Author 

[Heikki Kupiainen](https://www.linkedin.com/in/heikki-kupiainen-oppikone) / [metamatic.net](http://www.metamatic.net)

## Background

Metamatic is based on earlier prototype [Synchronous Dispatcher](https://www.npmjs.com/package/synchronous-dispatcher) package
but has improvements that make it more suitable to be used together with ReactJS framework. Also the internal implementation has been upgraded to meet
today's coding standards. If you are interested in Metamatic backgrounds, 
read an article about Metamatic framework's prototype [Synchronous Dispatcher](http://www.oppikone.fi/blog/introducing-synchronous-dispatcher.html).

## Read More

* Wikipedia article about [hash tables](https://en.wikipedia.org/wiki/Hash_table).
* Wikipedia article about [associative arrays](https://en.wikipedia.org/wiki/Associative_array).
