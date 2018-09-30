# The Metamatic State Container 

## Introduction

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is similar to existing main stream state containers such as 'Redux' and 'MobX' and many others but when compared with most state container frameworks,
it is simpler by one order of magnitude both in the way it is designed and in the amount of code that is required from you to get what you want.  

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

### Version 1.3.4: updateState function for easily updating container states and broadcasting changes

Since version 1.3.4, you can update a state in the state container and dispatch that state with only one line of code. Write very efficient state-container
aware code with ridiculously few lines of code!
   
### Version 1.2.8: Better way to connect and disconnect objects 
Since version 1.2.8, you can register *any* component by passing *this* reference to **connect** function. The Metamatic Framework now internally injects
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

## Dispatcher Clones Objects

You may have seen in some other state container frameworks that you must clone the object using a spread operator ( {...someObject} ) always when it is received by the 'reducer' function. In Metamatic, this is not the case. When you dispatch an object with **dispatch** function, the object
is always being automatically cloned. It is a very useful and important feature that objects are cloned when they are dispatched.  If the objects were not
cloned when dispatched into the bit space, that cause the listeners to receive a reference to the original object instead of a clone. That would be 
very bad because modifiying the received object inside a listener component would secretly change the original object in the state container, thus making
the state container essentially useless. The very idea of a central state container is that 
its objects can't be changed from outside. If it was possible to uncontrollably modify them from outside then the state container would not be able to detect a change and broadcast the change event across the application!

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

## Create a State Container

Creating a state container is very easy in the Metamatic framework. The state container is essentially only a very simple plain object. You can name it
as you wish, for instance AppState, AppContainer, MainStore etc. In this example, I'll name the state container as *MetaStore*. To create a MetaStore, create 
*MetaStore.js* file  Of course the file can have any name you wish. In that file, define the state container object as a plain object:

```js
const MetaStore = {};
```

As already mentioned, you really can name it as you wish, I just call it *MetaStore* for convenience!

## Enabling MetaStore to Receive And Broadcast Changes 

Let's say that you want MetaStore to centrally hold some piece of data, let's say email address, and when the email address changes, to
broadcast the change:

```js
export const EMAIL_ADDRESS_CHANGE = 'EMAIL_ADDRESS_CHANGE';

export const setEmailAddress = (emailAddress) => {
  MetaStore.emailAddress = emailAddress;
  dispatch(EMAIL_ADDRESS_CHANGE, emailAddress)
}
```

That's all what you need!

## Use updateState Function for Efficient State Manipulation

The above mentioned scenario where you want to do exactly two things to a state container is very common. Therefore Metamatic provides the **updateState** function 
to do this on a whim. When you really start coding some serious apps with professional-scale state management strategy, 
you'll find that a vast majority of things that you want to do with a central state container is:

1. Change a value inside the state container
2. Broadcast the changed value to all components that need it.

And along the way, you also want to have the target value or object cloned to avoid mess!

The wonderful thing is that you can achieve all this with a one line of code in the Metamatic Framework:

```js
export const setEmailAddress = (emailAddress) => updateState(MetaStore, 'MetaStore.user.emailAddress', emailAddress);
```

What *updateState* does is that it clones the value object, in this case the *emailAddress* (no matter whether it's a primitive type or a complex object),
updates the "emailAddress" property inside *MetaStore* and then dispatches this changed value to all over the app, updating all components that use this property.

The first parameter for *updateState* function is the actual store that you created earlier. The second parameter is the property locator.
It specifies the target property inside the state container that will be updated. In this case, there is *user* object inside MetaStore, 
having a property *emailAddress* to be updated. 

If that structure does not exist inside the container, no worries, it will be created by *updateState* on the fly!

After the property was updated inside the containber, it will then be broadcasted to all over the app as a passenger for an event, whose name is, 
perhaps not surprisingly, exactly the same as the property locator, which is in this example 'MetaStore.user.emailAddress'.

It is highly recommended that you parametrize the property locator, for example as follows: 

```js

export const STATE_EMAIL_ADDRESS = 'MetaStore.user.emailAddress';
export const setEmailAddress = (emailAddress) => updateState(MetaStore, STATE_EMAIL_ADDRESS, emailAddress);

```

parametrizing the event is very practical because you can then more easily implement a state change listener in receiving React components that will update
themselves when the state was changed:

```js
constructor(props) {
  super(props);
  this.state = {};
  connect(this, STATE_EMAIL_ADDRESS, (emailAddress) => this.setState({emailADdress}));
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
