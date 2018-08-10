# The Metamatic State Container 

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is similar to existing main stream state containers such as 'Redux' 
but it is simpler by one order of magnitude both in the way it is designed and in the amount of code that is required from you to get what you want.  

With Metamatic you can implement a central data management policy in frontend applications fast and painlessly. When you implement your state container using Metamatic, you can get things done faster because 
you don't need to write endless amounts of repetitive 'spells' to get what you want. It helps you create cleaner and more maintainable code.

You don't need to write endless ugly switch-case structures since Metamatic connects events to their handlers elegantly using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore. 
Metamatic does it automatically, due to its very nature! Yet the silly thing about Metamatic is that its internal implementation is drop-dead simple 
consisting only about one hundred lines of code!

One fundamental difference to 'Redux' is that Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the events, 
then you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.

Remember that **switch-case** structures are fundamentally only a different syntax for **if else if else if else** concoctions. 

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

You may have seen in some other state container frameworks that you must also clone the object using a spread operator ( {...someObject} ) always when it is received by the 'reducer' function. In Metamatic, this is not the case. When you dispatch an object with **dispatch** function, the object
is always being automatically cloned. *Dispatch* behaves like a fax machine. The object that lands to the handler function looks like the original one, smells and tastes like the original one, but it's still only a copy! The reason why the object was cloned on the way is to prevent **spooky action at a distance**, meaning that if cloning was not done and the original copy was passed to the handler instead, it would mean that when the sender component then later modifies the object, the corresponding object reference would also be modified
accordingly in the state container. That's something we don't want because the idea of a central state container is that its objects can't be secretly changed from outside.
If it was possible to uncontrollably to modify them from outside then the state container would not be able to detect a change and broadcast the change event across the application!

## Registering Components to Listen for MetaStore Container

To register a component as listener to MetaStore use **connect** function. It is meant to register components that have a limited lifetime
such as React components. You can unregister later listeners that have been added with connect function.

If you connect React components that have only one living instance at time, you can pass the React component itself as parameter (**this**).
But if you connect React components that have many simultaneously living instances, instead pass a unique identifier as parameter.

When connecting a React component, preferrably call connect function already in the component's constructor.
Example of connecting single instance React component:

```js
connect(this, CAR_INFO_CHANGE, (newCarInfo) => 
  this.setState({carInfo: newCarInfo});
```
  
But **this** as constructor parameter works only when there is only one instance of the listener component since it uses component's class name as ID (component.constructor.name).
This limitation is caused by JavaScript's inherent feature that objects don't have IDs by default.

If you have many instances of the same component, such as list elements, define a unique id explicitly in the component and pass it as parameter:

```js  
connect(someUniqueId, CAR_INFO_CHANGE, (newCarInfo) => 
  this.setState({carInfo: newCarInfo});
```  

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
Or if you connected the component earlier using some unique id:

```js
disconnect(someUniqueId);
```

To call disconnect inside **componentWillUnmount** React life cycle function:

```js
componentWillUnmount() {
    disconnect(someUniqueId);
}
```

But when you want to handle Metamatic events inside components that don't need to be unmounted or any static methods and utility functions,
simply use handle functions for registering handlers for Metamatic events:

```js
handle('MY-EVENT', function(item) {
  console.log('I catch the event here..');
  console.log(item);
});
```

Cancelling handlers can be done via **unhandle** call. Then all listeners of an event will be removed:
```js
unhandle('MY-EVENT');
```

## Implementing the MetaStore Container

There are two major strategies to implement a state container, which are the **Two-Way-Events** strategy and the **One-Way-Events** strategy.
The *Two-Way-Events* strategy means that the central data container (MetaStore) communicates with the rest of the software only through events. 
In Two-Way-Events strategy, the state container uses events for both sending and receiving data. It listens for events for receiving data and
dispatches events for sending data. But in *One-Way-Events* strategy instead, events are used only for broadcasting. The State Container does not 
listen for events to receive data. The data is placed inside the container directly through setter or update method invocations from outside.

### The Two-Way-Events State Container Strategy

In the Two-Way strategy, the events flow in two directions. They flow downstream, from the state container downward to the UI components.
And they flow upstream, from components upward back to the container. Downstream flow happens when the state container fires an event. 
The event is being handled down the stream in the UI components that listen for the events from the State
container. And when they flow upstream, from the UI components back to the state container, when a UI component dispatches an event back to the State Container.

With Metamatic, both *Two-Way-Events* strategy and *One-Way-Events* strategy are available. *One-Way-Events* strategy enables you to write more straightforward
code because it will be easier to track the program flow upstream back to container from the components but *Two-Way-Events* will make it possible
to add interceptors to upstream data flow.

### Why Direct Invocation is Natural

The main way to connect two components to each other should always be primarily through direct function invocations. 
Direct invocations are in most cases the superior way of sending data from one component to another component. The
reason for this is that it is just simpler. If you use a proper IDE, you can easily navigate to the actual implementation of the callable function just by 
clicking on the function call itself and the IDE will bring you to the function definition. When your component wants to send data to another component, 
directly invoking functions of that other component is by definition the obvious way to go. You know exactly to whom you are sending data because 
you directly call a function of that recipient component.

### Why Events are Bad for Readability

The very idea of the event-based communication scheme is by nature exactly the opposite to the direct invocation variant. When a component fires an event,
it does not know what party listens for that event. If you look into the piece of code that fires an event you can't tell where that event is being handled
and what are the components that will process it - if any. When you want to know what happens and where when an event was fired, you must
first navigate to the place where the event was defined and then explicitly search for places where the event is being listened for. This adds more 
steps to the coding work. For this reason it is  inherently more difficult to follow the logic of an application that overly relies on event-based communication.

### Why the State Container Must Broadcast Events

Despite the problems there are some important use cases that justify using events. Communication through event dispatching is a better solution in a very
special invocation scenario. Such scenario is the **one-to-many** communication case. In such case, there is one single place in the application, a state container, 
that holds the "master copy" of data. When this data changes, the central state container then must broadcast this change to all places where needed.
Let's say, the central state contains user email info. When the user's email address is changed, this change must radiate to all components of the app
that display the email address. So all components that display the email address in a way just mirror the original data. Then the problem of data incońsistencies
can be eliminated. The practical solution to implement such broadcast mechanism is to fire a change event from the state container
when the email was changed. The state container, when it triggers an event containing the changed data, does not know and does not need to know which components 
will catch this event. Those components for whom the data in question is relevant just need to "subscribe" themselves to receive that event when an update occurs.
 
If this kind of **one-to-many** notification logic had to be implemented without events, rather using direct invocation, it would mean that every time you 
add a component that shall display the data, you would need to explicitly update the central state container and add a new method call,
such as **yetAnotherComponent.setEmailAddress(newAddress)*. Not only would it make coding slow and error-prone because of the need to constantly update the 
state container methods when the components change, but it would also require the state container to have direct references to almost all components of the app.
That would make the state container a big monster, eventually rendering the application quite unmaintainable. 

For this reason, it is quite justified that the state container uses event dispatching as the strategy to broadcast events all around when something changes.

### Why State Container Should Not Listen For Events

When the case is, however, that a component must notify the state container about data change, *we do not* have a **one-to-many** scenario. We have rather
a **many-to-one** or at least **one-to-one** communication case. The idea of a central state container is in deed that there is just a single source of truth. 
Therefore it's not advisable to implement a state container that has a **two-way-events** communication scenario. There is absolutely no need to make the
communication FROM components TO the container to use events. The better and cleaner way to implement the upstream flow, from components to the
container, is simply through direct method invocation. All components that want to notify the container about a change will just need to directly invoke 
the container's change function.

# Creating the MetaStore

## Implement the Core
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
export const EMAIL_ADDRESS_CHANGE = 'EMAIL_ADDRESS_CHANGE';

const metaStore = {}

const initMetaStore = () => {
  
    handle(EMAIL_ADDRESS_UPDATE, (changedEmailAddress) => {
      metaStore.emailAddress = changedEmailAddress;
      dispatch(EMAIL_ADDRESS_CHANGE, emailAddress);    
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
