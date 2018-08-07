# The Metamatic State Container 

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is similar to existing main stream state containers such as 'Redux' 
but it is simpler by one order of magnitude both in the way it has been designed and in the amount of code that is required from you to get what you want.  
With Metamatic you can implement a central data management policy in frontend applications fast and painlessly.

When you implement your state container using Metamatic, you can get things done faster because 
you don't need to write endless amounts of repetitive 'spells' to get what you want. It helps you create cleaner and more maintainable code.

You don't need to write endless ugly switch-case structures since Metamatic connects events to their handlers elegantly using hash tables, 
taking internally advantage of JavaScript's associative arrays. With this solution, you don't need to manually connect events to their handlers anymore. 
Metamatic does it automatically, due to its very nature! Yet the silly thing about Metamatic is that its internal implementation is drop-dead simple 
consisting only about one hundred lines of code!

One fundamental difference to 'Redux' is that Metamatic directly binds event handlers to corresponding events already at the very moment
when you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the events, 
then you don't need to to write explicitly clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.

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

## Usage
When you want to dispatch an event somewhere in your app:

```js
import { dispatch } from 'metamatic';

dispatch('MY-EVENT', someObject);
```

Define a listener for your event using **handle** function:

```js
handle('SOME-EVENT', (value) => {
    console.log(value);
    ...
 })
```

To register a component as listener to MetaStore use **connect** function. It is meant to register such components as listeners that have a limited lifetime
such as React components. You can unregister later listeners that have been added with connect function.

If you connect React components that have only one living instance at time, you can pass the React component itself as parameter (this).
But if you connect React comppnents that have many simultaneously living instances, instead pass a unique identifier has parameter.

When connection a React component, preferrably call connect function already in the component's constructor.
Example of connecting single instance React component:

```js
connect(this, CAR_INFO_CHANGE, (newCarInfo) => this.setState({carInfo: newCarInfo});
```
  
This works when there is only one instance of the listener component. Since it currently uses component's class name as ID (component.constructor.name) 
it's only suitable to be used by components that have only one instance at a time. If you have many instances of the same component, 
such as list elements, pass unique id as parameter:

```js  
connect(someUniqueId, CAR_INFO_CHANGE, (newCarInfo) => this.setState({carInfo: newCarInfo});
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
      CAR_MODEL_SELECTION_CHANGE: (selectedCarModel) => this.setState({selectedCarModel})
    });
  }
```

When you have connected a React component to MetaStore, it is important to disconnect the component from MetaStore upon unmounting it.
In React, it's not allowed to set state of an unmounted component. If you don't disconnect a React component from MetaStore upon unmounting the listener
function won't die along with the component and it will erratically try to set state of a "dead" component when it receives an event,  which will cause an error.

Disconnecting a component from MetaStore upon unmounting:

```js
disconnect(this);
```
Or if you connected the component earlier using some unique id:

```js
disconnect(someUniqueId);
```

To call disconnect upon unmmounting a React component:

```js
componentWillUnmount() {
    disconnect(someUniqueId);
}
```

If want to handle Metamatic events from components that don't need to be unmounted, such as static methods and utility functions,
use simply handle functions for listening for Metamatic events:

```js
handle('MY-EVENT', function(item) {
  console.log('I catch the event here..');
  console.log(item);
});

```

## License

Apache 2.0

## Author

Heikki Kupiainen / [metamatic.net](http://www.metamatic.net)

## Background

Metamatic is based on earlier prototype [Synchronous Dispatcher](https://www.npmjs.com/package/synchronous-dispatcher) package
but has improvements that make it more suitable to be used together with ReactJS framework. Also the internal implementation has been upgraded to meet
today's coding standards. If you are interested in Metamatic backgrounds, 
read an article about Metamatic framework's prototype [Synchronous Dispatcher]((http://www.oppikone.fi/blog/introducing-synchronous-dispatcher.html)).

## Read More

Wikipedia article about [hash tables](https://en.wikipedia.org/wiki/Hash_table).
Wikipedia article about [associative arrays](https://en.wikipedia.org/wiki/Associative_array).