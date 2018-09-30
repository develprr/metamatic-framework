# The Metamatic State Container 

## Introduction

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is partially similar to existing main stream state containers such as 'Redux' and 'MobX' and many others - but in comparison with most state container frameworks,
it has essential differences that makes it really simple to use. With Metamatic, you can implement a central data management policy in frontend applications quite
fast and painlessly. With Metamatic, you can get things done faster because 
you don't need to write endless amounts of repetitive 'spells' to get what you want. Metamatic helps you create cleaner and more maintainable code.

Metamatic has fundamental differences to some well-known frameworks such as 'Redux' is that Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the events, 
then you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.

Remember that **switch-case** structures are fundamentally only a different syntax for **if else if else if else** concoctions. 

You don't need to write endless ugly switch-case structures since Metamatic connects events to their handlers elegantly using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore. 
Metamatic does it automatically, due to its very nature! Yet the silly thing about Metamatic is that its internal implementation is drop-dead simple 
consisting of only about one hundred lines of code!

One major difference to many difficult state container frameworks is also that you don't really need to "pre-configure" your App to use Metamatic. You don't
need to wrap your application in obscure "Provider" wrappers and you don't need to "inject stores" and other structures to your classes to enable a state
container. Any class, component, object or helper function can be connected to Metamatic features at any point of the project without any need to do major 
refactoring to existing application logic or code structure. You can use Metamatic functions on the fly anywhere your app, any time. 
If your application already uses some other state container framework, you can still introduce Metamatic into your app without removing or changing anything that already exists.

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

One wonderful thing about the Metamatic framework is that a state container as such is a plain object. Therefore implementing a Metamatic state container 
could not be easier. Another wonderful thing is that you modify the state container through direct method invocation, through very basic and plain setter methods.
This makes the code very readable. If any component wants to update a state in the state container, it should be done by
directly invoking a setter method. This approach is opposite to some major state container frameworks that require you to dispatch
events from components in order to update the state container. Such practice does not only turn the code unreadable and unmaintainable but is also
 completely unnecessary and serves no real purpose.

In Metamatic, the flow goes as follows: 

1. States are updated by directly invoking setter (updater) methods of a state container.
2. State container updater method automatically clones the new value object and updates the state container accordingly.
3. After setting a new value to the state container, the Metamatic framework broadcasts the changed state to everywhere in the app.
4. All components that are registered listeners of the dispatched Metamatic event, update their state.

## Important to Remember

Even though updating state container throug direct method invocation,

1. **YOU SHALL NEVER** directly refer to Metamatic state container from outside. You can call updater methods from outside but not directly the actual container.
2. Other components outside the state container shall **NEVER** use getters or direct references to get states from the state container. 
3. Components shall get events from the Metamatic state container only through **connect**, **connectAll** or **handle** functions provided by the framework.

The above mentioned three principles are important to keep in mind because directly referring to Metamatic container states would enable the referrer
components to manipulate the container states without the container being informed. While it's not the end of the world, it's a serious antipattern and strips off the
container's control over its states, which in turn can cause data integrity bugs that are difficult to track.

Read more about these principles in a [blog article on state container strategies](http://www.oppikone.fi/blog/implementing-metamatic-state-container.html).

## Create a State Container

In the Metamatic framework, creating a state container is very easy. The state container is essentially only a very simple plain object. You can name it
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

export const STATE_EMAIL_ADDRESS = 'MetaStore.user.emailAddress';
export const setEmailAddress = (emailAddress) => 
  updateState(MetaStore, STATE_EMAIL_ADDRESS, emailAddress);
```

And register any React component to listen for email address change:

```js
constructor(props) {
  super(props);
  this.state = {};
  connect(this, STATE_EMAIL_ADDRESS, (emailAddress) => this.setState({emailADdress}));
}
```

For most cases, this is all what you need! In most cases, you only need to MetaStore to replicate the data, store it, and broadcast the change
to all parts of the app where that data is being displayed. But if you want to create a custom setter function that does some custom modification to the
objects other than just storing them, you can also write an entirely customized setter function and then exclusively dispatch whatever you wish:

```js
export const EMAIL_ADDRESS_CHANGE = 'EMAIL_ADDRESS_CHANGE';

export const setEmailAddress = (emailAddress) => {
  MetaStore.modifiedEmailAddress = doSomeModifications(emailAddress);
  dispatch(EMAIL_ADDRESS_CHANGE, modifiedEmailAddress);
}
```

## Use updateState Function for Efficient State Manipulation

It's very common that you want MetaStore to only do the basic thing: store and dispatch. Therefore Metamatic provides **updateState** function 
to do this on a whim. The wonderful thing is that you can achieve the essential store-and-broadcast incidence with one line of code:

```js
export const setEmailAddress = (emailAddress) => 
  updateState(MetaStore, 'MetaStore.user.emailAddress', emailAddress);
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
  connect(this, STATE_EMAIL_ADDRESS, (emailAddress) => this.setState({emailAddress}));
}
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
