# The Metamatic State Container 

## Introduction

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is similar to existing main stream state containers such as 'Redux' 
but it is simpler by one order of magnitude both in the way it is designed and in the amount of code that is required from you to get what you want.  

With Metamatic you can implement a central data management policy in frontend applications fast and painlessly. When you implement your state container using Metamatic, you can get things done faster because 
you don't need to write endless amounts of repetitive 'spells' to get what you want. It helps you create cleaner and more maintainable code.

You don't need to write endless ugly switch-case structures since Metamatic connects events to their handlers elegantly using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore. 
Metamatic does it automatically, due to its very nature! Yet the silly thing about Metamatic is that its internal implementation is drop-dead simple 
consisting of only about one hundred lines of code!

One fundamental difference to 'Redux' is that Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the events, 
then you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.

Remember that **switch-case** structures are fundamentally only a different syntax for **if else if else if else** concoctions. 

## News
   
Since version 1.2.8, you can register *any* component by passing **this** to **connect** function. The Metamatic Framework now internally injects
a unique ID to each registered component so the user doesn't need to care about IDs.

## Writings and Samples

Please read more about using Metamatic on [Metamatic blog](http://www.oppikone.fi/blog/introducing-metamate-framework.html)
or check out a [sample Metamatic Car App](https://github.com/develprr/metamatic-car-app) to see Metamatic in action, a reference implementation
on using Metamatic. 

## Source Code

The Metamatic is available as [installable package at Npmjs.com](https://www.npmjs.com/package/metamatic).  
You can also explore the [Metamatic source code at GitHub](https://github.com/develprr/metamatic-framework). 
Or visit the official Metamatic home page at [www.metamatic.net](http://www.metamatic.net).

## Install Metamatic

Type:

```js
npm install metamatic
```

# Usage


## Dispatching and Handling Events

When you want to **dispatch** an event somewhere in your app:

```js
import { dispatch } from 'metamatic';

dispatch('MY-EVENT', someObject);
```

Define a listener for your event using **handle** function:

```js
import { handle } from 'metamatic';

handle('SOME-EVENT', (value) => {
    console.log(value);
    ...
 })
```

## Dispatcher Is a Teleporter

You may have seen in some other state container frameworks that you must clone the object using a spread operator ( {...someObject} ) always when it is received by the 'reducer' function. In Metamatic, this is not the case. When you dispatch an object with **dispatch** function, the object
is always being automatically cloned. *Dispatch* behaves like a fax machine. The object that lands to the handler function looks like the original one, smells and tastes like the original one, but it's still only a copy! The reason why the object was cloned on the way is to prevent **spooky action at a distance**, meaning that if cloning was not done and the original copy was passed to the handler instead, it would mean that when the sender component then later modifies the object, the corresponding object reference would also be modified
accordingly in the state container. That's something we don't want because the very idea of a central state container is that its objects can't be secretly changed from outside.
If it was possible to uncontrollably modify them from outside then the state container would not be able to detect a change and broadcast the change event across the application!

## Registering Components to Listen for MetaStore Container

To register a component as listener to MetaStore use **connect** function. It is meant to register components that have a limited lifetime
such as React components. You can unregister later listeners that have been added with connect function.

When connecting a React component, preferably call connect function already in the component's constructor.
Example of connecting single instance React component:

```js
connect(this, CAR_INFO_BROADCAST, (newCarInfo) => 
  this.setState({carInfo: newCarInfo});
```
  
When you pass **this** to connect function, the Metamatic Framework registers your component as a listener for a given type of events (CAR_INFO_BROADCAST in
this example). Metamatic will be able to identify all individual registered components because it internally injects an ID into them. 

If you want to connect your React component to many Metamatic events simultaneously, 
use connectAll:

```js
connectAll(this, {
  LOGIN_STATE_CHANGE: (loggedIn) => this.setState({loggedIn}),
  CAR_MODEL_SELECTION_CHANGE: (selectedCarModel) => this.setState({selectedCarModel})
});
```

Inside a React component's constructor that would look like:

```js
constructor(props) {
    super(props);
    this.state = {loggedIn: true};
    connectAll(this, {
      LOGIN_STATE_CHANGE: (loggedIn) => this.setState({loggedIn}),
      CAR_MODEL_SELECTION_CHANGE: (selectedCarModel) 
        => this.setState({selectedCarModel})
    });
  }
```

When you have connected a React component to MetaStore, it is important to **disconnect** the component from MetaStore upon unmounting it.
In React, it's not allowed to set state of an unmounted component. If you don't disconnect a React component from MetaStore upon unmounting, the listener
function won't die along with the component but it will instead be "kicking a dead body" when it receives an event. And that will cause an error.

## Disconnecting Components from MetaStore 

Disconnecting a component from MetaStore upon unmounting:

```js
disconnect(this);
```

To call disconnect inside **componentWillUnmount** React life cycle function:

```js
componentWillUnmount() {
    disconnect(this);
}
```

or maybe even more elegantly, using arrow notation: 

```js
componentWillUnmount = () => disconnect(this);
```

But when you want to handle Metamatic events inside components that don't need to be unmounted or any static methods and utility functions,
simply use handle functions for registering handlers for Metamatic events:

```js
handle('MY-EVENT', (item) => {
  console.log('I catch the event here..');
  console.log(item);
});
```

Cancelling handlers can be done via **unhandle** call. Then all listeners of an event will be removed:
```js
unhandle('MY-EVENT');
```


# Implementing the MetaStore Container

There are two major strategies to implement a state container, which are the **Two-Way-Events** strategy and the **One-Way-Events** strategy.
The *Two-Way-Events* strategy means that the central data container (MetaStore) communicates with the rest of the software only through events. 
In Two-Way-Events strategy, the state container uses events for both sending and receiving data. It listens for events for receiving data and
dispatches events for sending data. But in *One-Way-Events* strategy instead, events are used only for broadcasting. The State Container does not 
listen for events to receive data. The data is placed inside the container directly through setter or update method invocations from outside. Please 
read more about these state container strategies on a [blog article](http://www.oppikone.fi/blog/implementing-metamatic-state-container.html).

## Create the MetaStore

There are two ways to implement a metamatic state container, the MetaStore.

### First, Implement the Core
Create MetaStore.js file. In that file, type:

```js
const metaStore = {};
```

You can also name it as you wish, I just call it *MetaStore* for convenience!

## Enabling MetaStore to Receive And Broadcast Changes 

### With One-Way-Events Strategy...

Let's say that you want MetaStore to centrally hold some piece of data, let's say email address, and when the email address changes, to
broadcast the change:

```js
export const EMAIL_ADDRESS_CHANGE = 'EMAIL_ADDRESS_CHANGE';

export const setEmailAddress = (changedEmailAddress) => {
  metaStore.emailAddress = changedEmailAddress;
  dispatch(EMAIL_ADDRESS_CHANGE, emailAddress)
}
```

That's all what you need!

### With Two-Way-Events Strategy...

The Two-Way-Events strategy is not recommendable for most cases because of the loss of followability, but it's supported by Metamatic anyway. 
If you want to add interceptors such as logging to upstream events, *Two-Way-Events* may in deed be the desirable strategy:

```js
export const EMAIL_ADDRESS_UPDATE = 'EMAIL_ADDRESS_UPDATE';
export const EMAIL_ADDRESS_BROADCAST = 'EMAIL_ADDRESS_BROADCAST';

const metaStore = {}

const initMetaStore = () => {
  
    handle(EMAIL_ADDRESS_UPDATE, (changedEmailAddress) => {
      metaStore.emailAddress = changedEmailAddress;
      dispatch(EMAIL_ADDRESS_BROADCAST, emailAddress);    
    })

}

```

## License 

Apache 2.0

## Author 

Heikki Kupiainen / [metamatic.net](http://www.metamatic.net)

## Background

Metamatic is based on earlier prototype [Synchronous Dispatcher](https://www.npmjs.com/package/synchronous-dispatcher) package
but has improvements that make it more suitable to be used together with ReactJS framework. Also the internal implementation has been upgraded to meet
today's coding standards. If you are interested in Metamatic backgrounds, 
read an article about Metamatic framework's prototype [Synchronous Dispatcher](http://www.oppikone.fi/blog/introducing-synchronous-dispatcher.html).

## Read More

* Wikipedia article about [hash tables](https://en.wikipedia.org/wiki/Hash_table).
* Wikipedia article about [associative arrays](https://en.wikipedia.org/wiki/Associative_array).
