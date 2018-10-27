# The Metamatic State Container 

## Introduction

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is a powerful and simple-to-use state container architecture. Metamatic provides a robust toolset for data communication between components
inside your browser-based UI software. It can be used together with any modern JavaScript UI framework such as Vue, React, Angular and even basic JavaScript apps
without any specific frameworks.

### The Metamatic Concept

The Metamatic framework solves a fundamental problem in frontend software design: When any data is changed anywhere in the application, 
this change must be reliably radiated to all parts of the software that uses that data. For example, your frontend app has many components that display
user's email address. Then the email address is changed for some reason, perhaps by user who updates their account profile details. Or maybe it's updated
when the frontend client reloads user data from the server. In any case, the problem is the same. The data must be updated everywhere where it is needed.
Metamatic provides an elegant next-generation solution to the problem. Metamatic provides a managed state container that keeps a master copy of your data
safely and immutably in a central data storage. When you update any data that you have placed in the Metamatic data storage, Metamatic then automatically
takes care that all changes made to that data are reliably broadcasted to everywhere inside your app.

### Abstract Away State Container Management

Compared with traditional, well known state container frameworks, Metamatic takes your coding to an entirely new abstraction level.
With Metamatic, you can implement your apps without defining any state containers by yourself at all. This is a strikingly paradigm-shifting approach that 
makes Metamatic differ from those old school state container frameworks that expect you to always implement containers by yourself. 

In Metamatic, you can concentrate solely on updating states and just defining which states you want to keep as component's private states and 
which ones will be dispatched onto the app-wide highway to be dynamically available for all other components that need them.

### Say Goodbye to Child-Like "if-elses"

Metamatic has fundamental differences to some well-known frameworks such as 'Redux'. Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the event, you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.
Remember that **switch-case** structures are fundamentally only a different syntax for **if else if else if else** concoctions. 

### Use Hash Tables Like Grown-Ups

You don't need to write endless ugly switch-case structures since Metamatic connects events to their handlers elegantly using hash tables, 
taking internally advantage of JavaScript's` associative arrays. With this solution, you don't need to manually connect events to their handlers anymore. 
Metamatic does it automatically, due to its very nature! Yet the silly thing about Metamatic is that its internal implementation is drop-dead simple 
consisting of only about two hundred lines of code!

### Stop Messing Your App With "Provider" Clutter

One major difference to many difficult state container frameworks is also that you don't really need to "pre-configure" your App to use Metamatic. You don't
need to wrap your application inside obscure "Provider" wrappers and you don't need to "inject stores" and other structures to your classes to enable a state
container. Any class, component, object or helper function can be connected to Metamatic features at any point of the project without any need to do major 
refactoring to existing application logic or code structure. You can use Metamatic functions on the fly anywhere inside your app, any time. 
If your application already uses some other state container framework, you can still introduce Metamatic into your app without removing or changing anything that already exists.

### Robust State-Based Solution Without Props-Hassle

A major innovation within the Metamatic Framework is that it eliminates the props vs. states dilemma that most state container frameworks seem to have.
Metamatic does not care about props at all! For Metamatic, there are only two kinds of states: global states that exist
in the global Metamatic state container (or containers) and local states that exist in the components. The Metamatic Framework is good at cloning global states
into local scopes. Props-centric state container frameworks require you to directly couple components with global states, making your components directly depending
on your application-spesific containers. Such practice makes it impossible to publish your components as reusable NPM packages that can be reused in other
projects. It also turns any UI app into a monolithic solution whose components are directly bound to app's global states through linkage over props. Metamatic
is quite a different solution because it does not mess with props, but rather discreetly clones global states to components' local states. This practice
makes it easier to design components that are more independent and also reusable not only inside one app but also in other apps.

## News

### Version 1.7.0 Use initState function to initialize states

Metamatic version 1.7.0 introduces **initState** function that enables your app to robustly remember all its states even if the browser page is reloaded / refreshed!
Set initial values safely to Metamatic states using *initState* function that only sets those values that don't already exist in the state.
This is useful because using initState function protects values from being overwritten when the browser is refreshed: a page reload causes all initState calls to be re-executed. 
Luckily, *initState* won't touch any existing values at all and so the app will maintain exactly the same state it had before the page reload occurred!

### Version 1.6.9: calling updateState to a non-defined state now possible

Version 1.6.9 makes **updateState** function more usable. It can be now called also on a state that is not yet defined at all. In such case, it just initializes the state like *setState* function.

### Version 1.6.8: Fixed bug in retrieving items from session storage

A bug that prevented retrieving items from session storage has been fixed.

### Version 1.6.5: Functions renamed for more clarity

To improve code readability, *update* function has been renamed to **updateState**, *obtain* function to **getState**,  *store* function to **setState** and *clear*
function to **clearState**. Version 1.6.5 won't be backwards compatible with earlier versions! 

### Version 1.6.3: Support for external nested storages removed

Support for external nested containers has been at least temporarily removed since there are no obvious use cases for such scenarios. 
A critical bug that was present in version 1.6.2 has been fixed.

### Version 1.6.2: Support for localStorage and sessionStorage based persistency strategies added

Metamatic now supports *localStorage* and *sessionStorage* based container persistency strategies. That is particularly useful when creating an app
that must remember its states even after browser page reload. By default, Metamatic now uses localStorage as default persistency strategy. You can change
the persistency type by calling Metamatic's configuration functions **useLocalStorage**, **useSessionStorage** and **useMemoryStorage**.

### Version 1.5.7: Clear any Metamatic state with "clear" function

Metamatic now provides a practical **clear** function that allows clearing any state with leaner code than previously calling *store* with an empty parameter object.

### Version 1.5.5: Obtain safely a clone of any Metamatic state with "obtain" function

Metamatic now provides **obtain** function for safely retrieving any states from the Metamatic state container. This method provides an additional pathway
for implementing supernova-bright logic inside your web app.

### Version 1.4.6: Abstract away data containers with update and store functions 

Metamatic proudly introduces the groundbreaking data store functions **update** and **store**. With these functions, you can forget data stores alltogether
and concentrate on states only. A paradigm shift in deed! Also old *updateState* function has been renamed to **updateStore** and *observe* has been renamed to **observeStore**.

### Version 1.4.0: "observeStore" function allows to preconfigure listener states in advance

*connect* and *connectAll* functions now  set the listener's state retrospectively from the state container if such was defined. In a state container it is now possible to use ~~observe~~ **observeStore**  function to mark a state inside store for observation. 
When a state is under observation, it will be automatically fired every time when a listener signs up to listen for it. 

### Version 1.3.4: "updateStore" function for easily updating container states and broadcasting changes

Since version 1.3.4, you can update a state in the state container and dispatch that state with only one line of code. Write very efficient state-container
aware code with ridiculously few lines of code!
   
### Version 1.2.8: Better way to connect and disconnect objects 

Since version 1.2.8, you can register *any* component by passing *this* reference to **connect** function. The Metamatic Framework now internally injects
a unique ID to each registered component so the user doesn't need to know about IDs.

View all news on Metamatic's [news page](https://develprr.github.io/metamatic-blog/news/)!

## Writings and Samples

Please read more about using Metamatic on [Metamatic blog](https://develprr.github.io/metamatic-blog)
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

## Forget Containers, Define States

In Metamatic, you don't define stores and containers. Instead you define states. In Metamatic, an event and a state practically mean exactly the same thing.
In Metamatic, you define central Metamatic states, "Meta States".  When you update a Metamatic state, this action will automatically cause a similar 
application-wide event that broadcasts the changed state to everywhere in your app where this state is needed. Think about a stone that you drop inside a bucket
full of water. The water splashes into every direction from the bucket. 

A good practice is to create a separate file for each Metamatic state for your app. For instance, when you have a state to handle user info, 
create file **UserInfoState.js**. In UserInfoState.js, define the state as and exported constant so that it can be referred from other components:

```js
export const STATE_USER_INFO = 'STATE_USER_INFO';
```

Creating a function to update user's email address inside UserInfo state:


```js
import { updateState } from 'metamatic';

export const updateEmailAddress = (emailAddress) => 
  updateState(STATE_USER_INFO, { emailAddress });

```

Now you have defined a Metamatic UserInfo state and a function to update user's email inside that state. Every time *updateEmailAddress* function is called 
by any component, it updates the UserInfo state in the automatically managed embedded Metamatic state container and a copy of the changed object is also 
broadcasted to all components that need that data!

When any component wants to update user info, simply import the *updateUserInfo* function from your Metamatic state and call it. For instance

```js
import { updateEmailAddress } from 'path/to/your/UserInfoState.js';

updateEmailAddress(someChangedEmailaddess);

```

Now when you want to sign up any component anywhere inside your app as a listener for changes in UserInfo state, use connect if your listener is an instance of a class:

```js
import { connect } from 'metamatic';
import STATE_USER_INFO from  'path/to/your/UserInfoState.js';

connect(this, STATE_USER_INFO, (state) => doSomethingWithReceivedState(state));

```

If it is a ReactJS component that you want to listen the Metamatic state:

```js

export class SomeReactComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount = () => connect(this, STATE_USER_INFO, (state) => this.setState(state));
}

```

Or if you don't want to completely replace your component's state with the user info state coming from Metamatic container but rather
merge your component's current state with the incoming state, then just use basic spread-operator for merging:


```js
componentDidMount = () => connect(this, STATE_USER_INFO, (state) => this.setState({ ...this.state, ...state }));
```

To examine a complete example of using the Metamatic Framework inside a React app, check the source of code a 
[Metamatic example application](https://github.com/develprr/metamatic-car-app) on Github!

## More About Registering Components to Listen for MetaStore Container

To register a component as listener to Metamatic states use **connect** function. It is meant to register components that have a limited lifetime
such as React components. You can unregister later listeners that have been added with connect function.

When connecting a React component, preferably call connect function already when the component is mounted.
Example of connecting single instance React component:

```js
connect(this, STATE_CAR_INFO, (newCarInfo) => 
  this.setState({price: newCarInfo.price});
```
  
When you pass **this** to connect function, the Metamatic Framework registers your component as a listener for a given type of events (CAR_INFO_BROADCAST in
this example). Metamatic will be able to identify all individual registered components because it internally injects an ID into them. 

If you want to connect your React component to many Metamatic events simultaneously, 
use connectAll:

```js
connectAll(this, {
  [STATE_ACCESS]: (state) => this.setState({ ...this.state, ...{ loggedIn: state.loggedIn }),
  [STATE_CAR_MODEL]: (state) => this.setState({ ...this.state, ...state } )
});
```

The connector above would, when receiving a Metamatic ACCESS state, just take *loggedIn* property from the incoming state and merge it with component's
current state and when revceing a CAR_MODEL state, completely merge all properties from that state with compoent's current local state.

Inside a React component, the connect call should be placed inside componentDidMount life cycle phase:

```js
componentDidMount = () =>  connectAll(this, {
  [STATE_ACCESS]: (state) => this.setState({ ...this.state, ...{ loggedIn: state.loggedIn }),
  [STATE_CAR_MODEL]: (state) => this.setState({ ...this.state, ...state } )
});
 
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

# Using Metamatic's Embedded Data Container

When you code with Metamatic the chances are that you don't need to define any data container at all but rather let this headache over to 
the Metamatic framework. Metamatic knows how to keep containers in pure immutable state and guards their data purity like a lion. When you use Metamatic's 
**updateState** and **setState** functions then Metamatic will take care of the boring job of managing the actual data container. Then you only need to update states
and connect your components to states that they need.

Consider that you want to configure an app-wide state, for example an *activeUser* object that shall keep the active user's important data safe in one place
in the app. That is fantastically easy using **setState** function. First, you have to define the name of your app state. Let's do it:

```js
export const STATE_ACTIVE_USER = 'STATE_ACTIVE_USER';
```

Then, use *setState* to set the state inside the Metamatic's embedded state container:

```js
import {setState} from 'metamatic';
 
setState(STATE_ACTIVE_USER, {
  username: 'someusername',
  emailAddress: 'some.email@someaddress.com'
});

```

Now Metamatic has stored the the active user's data. Oh and yes, of course you can also load that data from server and store the received JSON:
 
 ```js
 
 setState(STATE_ACTIVE_USER, jsonDataFromServer);
 
 ```
 
 When you want this data to be available for some component, yes, in deed React or Vue or Angular or whatever kind of JavaScript component, just bind that component
 to the Metamatic data container through *connect* function. Here is a ReactJS example, connecting a component to a Metamatic state is actually just one line of code:
 
 
```js

import {connect} from 'metamatic';

class UserInfo extends Component {
  
  componentDidMount = () => 
    connect(this, STATE_ACTIVE_USER, (state) => this.setState(state));

}

```

If the state was initially set using *setState* function before a listener was connected to it, it still works because Metamatic connects listeners to states
retrospectively, which means you can set a state earlier somewhere and once a component is later on connected to that state, it is then cloned into the listener
component at the time when the component is mounted. But don't connect a component to Metamatic inside a constructor because *connect* may immediately 
try to clone a container's state into component's state. And that shall not be done in the constructor yet because at the time a constructor function is executed component is not yet
mounted and in ReactJS, it is a wrong thing to do to set state on a component that isn't yet mounted!

Needless to say, when a Metamatic state is updated later on, the framework will then automatically update all connected components. For updating states, 
you can use both **updateState** and **setState** functions. The difference between these two functions is that that *setState* completely overrides 
the existing state and *update* only updates it:

 ```js
updateState(STATE_ACTIVE_USER, {
  emailAddress: 'new-email-address@somedomain.com',
  phone: '1234567'
});

 ``` 

In this example, *updateState* function just leaves the original *username* attribute in the state intact, defines a new attribute *phone* and overrides *emailAddress*.
But if you used *setState* here instead of *updateState*, username would have been deleted from the state because it was not set in the update object. You can also
use *updatetate* function when you define a state first time, the difference is just that *update* merges a new data state with the existing one whereas *setState*
totally replaces the old data state with the new one. Therefore *setState* is useful if you want to entirely remove some attributes from a state.

## Additional Reading

### Enjoy Metamatic Dispatcher as Standalone Feature

Even though Metamatic abstracts away the pain of thinking about broadcasting or radiating events, you can still enjoy Metamatic's event-dispatcher
mechanism as a standalone feature. Read more about the topic in a [blog article](https://develprr.github.io/metamatic-blog/metamatic/2018/10/15/metamatic-dispatcher-as-standalone-feature.html)!

### Implementing Your Own MetaStore Container

Albeit *setState* and *updateState* functions are most likely all what you need for state container management, there may still be situations that user wants
to do some old-school state container coding and define state containers by themselves. The good news is that Metamatic supports even that as well.
And even then, it still beats most established state container frameworks in the elegance how it is done! While implementing custom Metamatic state containers 
is a rather rare use, you can still read about the topic on the new [Metamatic Blog](https://develprr.github.io/metamatic-blog/metamatic/2018/10/10/implementing-custom-state-containers.html)!


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
