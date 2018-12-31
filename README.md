# The Metamatic State Manager

A state management library for JavaScript-based web-apps.

## Chapters
* [Introduction](#introduction)
  - [The Metamatic Concept](#the-metamatic-concept)
  - [Persistent States](#persistent-states)
  - [Say Goodbye to Switch-Cases](#say-goodbye-to-manual-switch-cases)
  - [Clean Solution without Provider Clutter](#clean-solution-without-provider-clutter)
  - [Robust States-Based Solution](#robust-state-based-solution-without-props-hassle)
* [Source Code and Examples](#source-code-and-examples)
  - [Sources](#sources)
  - [Examples](#examples)
  - [Blog](#blog) 
* [Getting Started](#getting-started)
  - [Installing Metamatic](#installing-metamatic)
  - [Selecting Persistency Strategy](#selecting-persistency-strategy)
* [Stores](#stores)
  - [Define Your Stores as Constants](#define-your-stores-as-constants)
  - [Initializing Stores](#initializing-stores)
  - [Retrieving Data from Stores](#retrieving-data-from-stores)
  - [Updating Stores](#updating-stores)
  - [Rewriting and Clearing Stores](#rewriting-and-clearing-stores)
* [Events](#events)
  - [Implementing Event Listeners](#implementing-event-listeners)
  - [Broadcasting Events](#broadcasting-events)
  - [Parameterless Events](#parameterless-events)
  - [The System Event CONNECT](#the-system-event-connect)
* [The Metamatic Router](#the-metamatic-router)
* [Miscellaneous](#miscellaneous)
  - [Licence](#licence)
  - [Author & Copyright](#author-and-copyright)
  - [Background](#background)
  - [Read More](#read-more)

## Introduction  

The Metamatic framework is a simple and clutter-free state manager for JavaScript apps and for developers who want to get
things done. Metamatic provides a robust toolset for data communication between components
inside your browser-based UI software. It can be used together with any modern JavaScript UI framework such as Vue, React, Angular and even basic JavaScript apps
without any specific frameworks.

<div align="center" style="width:100%;background-color:green;nargin:auto">
    <img width="208px" alt="water"
      src="https://develprr.github.io/metamatic-blog/assets/pexels-photo-416520.jpeg" />
</div>

### The Metamatic Concept

The Metamatic framework solves a fundamental problem in frontend software design: when any data is changed anywhere in the application, 
this change must be reliably radiated to all parts of the software that uses that data. For example, your frontend app has many components that display
user's order history. When that data changes it should be consistently updated in all parts of the app.

When you think about Metamatic, think about throwing an ice cube into a glass full of water.

* Think about the glass. It is the Metamatic data store, the state container.
* Think about the water. It is the data that splashes into every direction from the glass.
* Think about the ice cube. It is the direct function invocation you call to update the Metamatic data container.

Metamatic provides an easy way to manage your data stores and states inside them. In Metamatic, the data flows typically as follows:

1. A component updates the Metamatic store by directly invoking an updater function that is defined in a store utility file. 
2. The store updater function in the store utility file updates the store and fires an update event containing a copy of the store itself.
3. The component/components connected to the store receive the event from the Metamatic store.
4. The connected components update their state from the event and the component refreshes itself.

* The data maintains its integrity since updating the master copy in the central Metamatic data store radiates the change to every place where needed!
* The data store always fires only copies of itself, therefore there's no way to sneakily mutate the master copy.
* Events are almost the same as stores since updating a data store fires an event with the same name as the store itself. A copy of the store is the passenger of the event.

*[<- Back to contents](#chapters)*

### Persistent States

Being tired of web portals that forget their state or get strangely messed when the browser is refreshed? Metamatic solves this problem by offering
various out-of-the-box persistency modes, *localStorage*, *sessionStorage* and *memoryStorage*. Meaning, the web site remains exactly in the same state
as it was before you refreshed the browser.

*[<- Back to contents](#chapters)*

### Say Goodbye to Manual Switch-Cases

Metamatic has fundamental differences to some well-known state manager frameworks. Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handleEvent** or **connectToStore** function. When the listener functions inside components are already inherently connected to their data source, 
you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event. 
Simplistic and clean code prevents the application from turning into buggy bubble gum that is too expensive to maintain.

Metamatic frees you from the need to manually write switch-case structures since it connects states to their listeners silently using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore.

*[<- Back to contents](#chapters)*

### Clean Solution without Provider Clutter

One major difference to verbose state manager frameworks is that you don't really need to "pre-configure" your app to use Metamatic. You don't
need to wrap your application inside obscure "Provider" wrappers and you don't need to "inject stores" and other structures to your classes to enable a state
container. Any class, component, object or helper function can be connected to Metamatic features at any point of the project without any need to do major 
refactoring to existing application logic or code structure. You can use Metamatic functions on the fly anywhere inside your app, any time. 
If your application already uses some other state container framework, you can still introduce Metamatic into your app without removing or changing anything that already exists.

*[<- Back to contents](#chapters)*

### Robust State-Based Solution Without Props-Hassle

A major innovation within the Metamatic Framework is that it eliminates the props vs. states dilemma that most state container frameworks seem to have. 
In Metamatic framework, your components are not directly connected to states inside global stores. Instead, Metamatic effectively copies global states
into component's local states. This gives you more freedom to decide which states you want to keep as component's local states and which ones you want to connect
to Metamatic global states. In Metamatic, the root states are called **stores**. Stores can have nested properties, which are all understood as nested **states**.
You can connect any component to listen to entire stores as well as just one nested state deep inside a store.

*[<- Back to contents](#chapters)*

## Source Code and Examples

### Sources
The Metamatic is available as [installable package at Npmjs.com](https://www.npmjs.com/package/metamatic).  
You can also explore the [Metamatic source code at GitHub](https://github.com/develprr/metamatic-framework). 
Or visit the official Metamatic home page at [www.metamatic.net](http://www.metamatic.net).

*[<- Back to contents](#chapters)*

### Examples

Check out the source code of [Metamatic Car App demo](https://github.com/develprr/metamatic-car-app) for a practical example of the Metamatic framework in action,
and the actual deployment of the [demo live](https://metamatic-car-app.herokuapp.com/)! 

Also checkout the [Metamatic Router Demo](https://github.com/develprr/metamatic-router-demo) which also demonstrates the Metamatic Router feature.

*[<- Back to contents](#chapters)*

### Blog

Check out [the Metamatic blog](https://develprr.github.io/metamatic-blog) for articles about using the framework!

*[<- Back to contents](#chapters)*

## Getting Started

### Installing Metamatic
To install Metamatic in your project, type:

```js
npm i --save metamatic
```

### Selecting Persistency Strategy

In your app's starting point, for instance Main.js or App.js file, configure Metamatic to use any of the three available persistency modes calling

**useLocalStorage()**, **useSessionStorage()** or **useMemoryStorage()**

from which localStorage is set on by default.

*[<- Back to contents](#chapters)*

## Stores

### Define Your Stores as Constants

A good practice is to write constants for all your stores in the app. Using constants limits the risk of mistyping names:

```js
export const STORE_USER_INFO = 'STORE_USER_INFO';
export const STORE_CAR_OPTIONS = 'STORE_CAR_OPTIONS';
```

A good place to define store constants is inside your store utility files that update those stores anyway.

*[<- Back to contents](#chapters)*

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
  ],
  address: {
    streetAddress: 'Some street 1'
  }
});
```

*[<- Back to contents](#chapters)*

### Retrieving Data from Stores

When you want to retrieve an entire store from the Metamatic state manager, just simply use **getStore** function:

```js
import {getStore} from 'metamatic';

const userStore = getStore(STORE_USER_DATA);
```

But you may just need one particular state inside a store. For retrieving a nested state inside a store, use **getState** function:

```js
import {getState} from 'metamatic';

const streetAddress = getState(STORE_USER_DATA, 'address.streetAddress');
```
But as in Metamatic, a root state being called store and that store in turn being just a simple associative array, you can actually invoke *getState* without a second parameter.
In such case, Metamatic will return the root state, the store:

```js
import {getState} from 'metamatic';

const userDataStore = getState(STORE_USER_DATA);
```

Remember that getters always return a copy of the store. You can safely modify the received object without mutating the master copy inside the store!

*[<- Back to contents](#chapters)*

### Updating Stores

When updating stores with **updateStore** or **updateStores** function, the states inside an existing store or stores are merged with the new incoming object.
Those values that are not defined in updater object will remain untouched in the Metamatic store.

```js
import {updateStore} from 'metamatic';

updateStore(STORE_USER_INFO, {
  username: 'Some new userName'
});
```
The example above will overwrite or set 'username' state but lets streetAddress remain as is. updateStore returns the new combined object:

```js
const mergedObject = updateStore(STORE_USER_INFO, {
  username: 'Some new userName'
});
```

To update many stores simultaneously:

```js
import {updateStores} from 'metamatic';

updateStores({
   [STORE_USER_INFO]: {
     address:  {
      streetAddress: 'Jon Doe Street 3',
      city: {
        zipCode: '00100',
        name: 'Helsinki'
      }  
     }
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

You might want to update just a single state inside a store. For that, use **setState** function:

```js
import {setState} from 'metamatic';

setState(STORE_USER_INFO, 'address.city.name', 'Malasiqui');
```

*[<- Back to contents](#chapters)*

### Rewriting and Clearing Stores

Functions **setStore** and **setStores** work similarly to *updateStore* and *updateStores* except they completely overwrite the store or stores with the new one.
**clearStore** empties a store. Function **existsStore** can be used if a store exists.
 
*[<- Back to contents](#chapters)*

### Connecting React Components to Stores

Connecting a React component to listen for an entire store can be done with **connectToStore** and **connectToStores**. In ReactJS, 
use **componentDidMount** life cycle callback to connect your component to Metamatic stores, for example:

```js
export class SomeReactComponent extends Component {
  
  constructor(props) {
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
componentDidMount = () => connectToStore(this, STORE_CAR_INFO, 
  (carInfo) => this.setState({
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

Also remember here that all states and stores received this way are only clones of the master copy that resides protected inside the Metamatic state manager,
thus modifying them locally won't mutate the master copy in the Metamatic store.

*[<- Back to contents](#chapters)*

### Disconnecting Components from Metamatic Stores 

Disconnecting a component from MetaStore upon unmounting:

```js
disconnectFromStores(this);
```

To call disconnect inside **componentWillUnmount** React life cycle function:
```js
componentWillUnmount = () => disconnectFromStores(this);
```

*[<- Back to contents](#chapters)*

## Events

Even though events are typically connected to stores the way that updating a store causes Metamatic to broadcast (or dispatch or radiate) a similarly named event 
as the store itself, there are situations that you want to fire a standalone event without updating any store. 
You may also want to implement a standalone event listener that handles events but does not necessarily update any store.

*[<- Back to contents](#chapters)*

### Implementing Event Listeners
 
When you want to handle Metamatic events inside components that don't need to be unmounted or any static methods and utility functions,
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

*[<- Back to contents](#chapters)*

### Broadcasting Events

Similarly, broadcast an event into app-wide bit-space to be processed with all event handlers, use **broadcastEvent** function:

```js
import {broadcastEvent} from 'metamatic';

const someObject = {something: 'here'}

broadcastEvent('SOME-EVENT', someObject);
```
*broadcastEvent* will dispatch a clone of the data sent as a parameter, therefore the receiver can't directly modify the source version.

### Parameterless Events

*broadcastEvent* function does not need a parameter. It is correct to broadcast events without a passenger:

```js
broadcastEvent('SOME-EVENT');
```

The example above will just pass a null value as parameter. Accordingly, you can implement a handler without parameter: 

```js
handleEvent('SOME-EVENT', () => {
  console.log('I process the event here..');
});
```

*[<- Back to contents](#chapters)*

### The System Event CONNECT 

A very useful thing to know about Metamatic is that every time a component is connected to a store or state, Metamatic automatically fires
a system event to inform anybody who listens that a component has been connected to a store or a state.

Consider that you connect a React component to a store such as:

```js
componentDidMount = () => connectToStore(this, 
  STORE_USER_INFO, 
  (incomingStore) => this.setState({
    ...this.state, 
    userData: incomingStore.userData
  })
);
```

In the code snippet above, you want to connect your component to a Metamatic store with name *STORE_USER_INFO*, and when the store is updated, 
it will be dispatched to this component. From the incoming store, *userData* state will be taken and put into this component's local state.

Now, what will happen if the user data is not available in the store? Absolutely nothing! But that is possibly a situation that you don't want.
Therefore it is possible to make a store to listen for component connecting events and program them to act upon them.

When the component was connected to STORE_USER_INFO, Metamatic hiddenly fired a CONNECT system event, which has syntax *CONNECT/YOUR_STORE_NAME* - 
that would be in this example "CONNECT/STORE_USER_INFO".

This is very helpful because you can add a piece of code to the user info store to handle such connect event:

```js
const CONNECT_USER_INFO = 'CONNECT/' + STORE_USER_INFO;

handleEvent(CONNECT_USER_INFO, (listener) => optionallyLoadUserData());  //you can have empty params () if you don't need the listener - actually you should not need it.
```

The handler above is invoked every time when a component is connected to STORE_USER_INFO store.

The implementation for optionallyLoadUserData would check if the store already contains the user data and if not, then load it:

```js
import {containsState, updateStore} from 'metamatic';

const optionallyLoadUserData = () => 
  !containsState(STORE_USER_INFO, 'userData') && loadUserData(response => 
  updateStore(STORE_USER_INFO, {
    'userData': response.data
  })
); 
```

The code example checks if the metamatic STORE_USER_INFO contains state *userData*. If not, it invokes *loadUserData* function that actually 
loads the data from server - and finally updates the store, setting userData state that was received. *updateState* will cause the listener component 
actually to receive the user data in question. Function *loadUserData* can be implemented using any available Ajax library.

Read more about using CONNECT feature [here!](https://develprr.github.io/metamatic-blog/metamatic/2018/12/11/url-based-application-states-with-metamatic-connect-event.html)

*[<- Back to contents](#chapters)*

## The Metamatic Router

The Metamatic Router is a standalone router component that is implemented on top of the core Metamatic library.

When you use Metamatic you can use any router library available around the Internet. But some of those solutions require you to wrap
your app's root component inside some "Routing Provider" tags before you can implement routing. This can be seen as an anti-pattern since visual JSX
component declarations become messed with programmatic components. And some router libraries will need have the downside that when you want to programmaticllyy
soft-direct your app to a certain sub-URL you may need to wrap your redirecting component inside some obscure wrapper again, possibly breaking your code's 
otherwise sleek and clean syntax. 

For this reason, Metamatic provides a simple out-of-the-box routing feature. It may be a viable alternative to some external routing libraries. This depends of course
on your use case. You can use Metamatic together with any other router library or you can also try out the Metamatic Router library.

The Metamatic Router is implemented in a separate package since Metamatic version 2.5.1. The Metamatic Router can be installed either alongside the Metamatic framework or
as a standalone version. It can be also used as a routing solution with any other React app or other kind of a JavaScript app that 
does not use Metamatic state manager for application state control.

Check out the [installable Metamatic Router package on npmjs.com](https://www.npmjs.com/package/@metamatic.net/metamatic-router) 
or study the [source code on GitHub](https://github.com/develprr/metamatic-router).

## Miscellaneous

### Licence 

Apache 2.0
d
### Author and Copyright
r[Heikki Kupiainen](https://www.linkedin.com/in/heikki-kupiainen-oppikone) / [metamatic.net](http://www.metamatic.net)

### Background

Metamatic is based on earlier prototype [Synchronous Dispatcher](https://www.npmjs.com/package/synchronous-dispatcher) package
but has many more improvements and is more suitable to be used together with ReactJS framework.

### Read More

* Wikipedia article about [hash tables](https://en.wikipedia.org/wiki/Hash_table).
* Wikipedia article about [associative arrays](https://en.wikipedia.org/wiki/Associative_array).

*[<- Back to contents](#chapters)*
