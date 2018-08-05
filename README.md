# The Metamatic Framework 

Metamatic is a predictable state container for JavaScript apps. With Metamatic you can implement central data management in frontend applications.
It is based on earlier [Synchronous Dispatcher](https://www.npmjs.com/package/synchronous-dispatcher) package
but has improvements that make it more suitable to be used together with ReactJS components.

It is similar to 'Redux' but has is superior in terms of simplicity - you need to write far less code. It has a far more advanced architecture -
you don't need to write endless awkward switch-cases since Metamatic takes advantage of hash tables. 
It is also more readable and you can get things faster done. It helps you create clean and maintainable code. Once you start using Metamatic
other more complicated state container solutions will start feeling like garbage. Metamatic is better in every possible way. 
Yet its internal construction is ridiculously drop-dead simple!

Please read more about using Metamatic on [Metamatic blog](http://www.oppikone.fi/blog/introducing-metamate-framework.html)
or check out a [sample Metamatic Car App](https://github.com/develprr/metmatic-car-app) to see Metamatic in action, a reference implementation
on using Metamatic.


## Installation

npm install metamatic

## Usage
When you want to dispatch an event somewhere in your app:

```js
import { dispatch } from 'metamatic';

dispatch('MY-EVENT', someObject);

```

And when you want connect React component's state to the Metamatic event store, add connect to constructor, for example:


```js

connect(this, CAR_DATA_CHANGE, (carData) => this.setState({car: carData));

```

If you want to connect your React component to many Metamatic events simultaneously, 
use connectAll:

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

Remember to disconnect your React component from the Metamatic Store before unmounting:

```js
componentWillUnmount() {
    disconnect(this);
}
```

If want to handle Metamatic events from components that don't need to be unmounted, such as static methods and utility functions,
use simply handle functions for listenint for Metamatic events:

```js
handle('MY-EVENT', function(item) {
  console.log('I catch the event here..');
  console.log(item);
});

```

## License

Apache 2.0

## Author

Heikki Kupiainen / Oppikone

## Read Also

If you are interested in Metamatic backgrounds, read an article about Metamatic framework's prototype [Synchronous Dispatcher]((http://www.oppikone.fi/blog/introducing-synchronous-dispatcher.html)).

