# The Metamatic State Container 

## Introduction

The Metamatic framework is a simple and easy-to-use predictable state container for JavaScript apps. 
Metamatic is partially similar to existing main stream state containers such as 'Redux' and 'MobX' and many others - but in comparison with most state container frameworks,
it has essential differences that make it really simple to use. With Metamatic, you can implement a central data management policy in frontend applications quite
fast and painlessly. With Metamatic, you can get things done faster because  you don't need to write endless amounts of repetitive 'spells' to get what you want. 
Metamatic helps you create cleaner and more maintainable code.

### Say Goodbye to Child-Like "if-elses"

Metamatic has fundamental differences to some well-known frameworks such as 'Redux'. Metamatic directly binds event handlers to corresponding events already in the very moment
you define them by calling **handle** or **connect** function. When the handlers are already inherently connected to the event, you don't need to explicitly write clumpy **switch-case** structures to explain the application what action shall be invoked upon which event.
Remember that **switch-case** structures are fundamentally only a different syntax for **if else if else if else** concoctions. 

### Abstract Away State Container Management

Metamatic takes your coding to an entirely new abstraction level. With Metamatic, you can implement your apps without defining
any state containers by yourself at all. This is a strikingly paradigm-shifting approach that makes Metamatic differ from those old school
state container frameworks that expect you to always implement containers by yourself. In Metamatic, you can concentrate solely on updating states 
and just defining which states you want to keep as component's private states and which ones will be dispatched onto the app-wide highway to be dynamically available 
for all other components that need them.

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

### Version 1.4.6 Abstract away data containers with update and store functions 

Metamatic proudly introduces the groundbreaking data store functions **update** and **store**. With these functions, you can forget data stores alltogether
and concentrate on states only. A paradigm shift in deed! Also old *updateState* function has been renamed to **updateStore** and *observe* has been renamed to **observeStore**.

### 1.4.0 observeStore function allows to preconfigure listener states in advance

*connect* and *connectAll* functions now  set the listener's state retrospectively from the state container if such was defined. In a state container it is now possible to use ~~observe~~ **observeStore**  function to mark a state inside store for observation. 
When a state is under observation, it will be automatically fired every time when a listener signs up to listen for it. 

### Version 1.3.4: updateStore function for easily updating container states and broadcasting changes

Since version 1.3.4, you can update a state in the state container and dispatch that state with only one line of code. Write very efficient state-container
aware code with ridiculously few lines of code!
   
### Version 1.2.8: Better way to connect and disconnect objects 
Since version 1.2.8, you can register *any* component by passing *this* reference to **connect** function. The Metamatic Framework now internally injects
a unique ID to each registered component so the user doesn't need tore about IDs.

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
  [LOGIN_STATE_CHANGE]: (loggedIn) => this.setState({loggedIn}),
  [CAR_MODEL_SELECTION_CHANGE]: (selectedCarModel) => this.setState({selectedCarModel})
});
```

Inside a React component's constructor that would look like:

```js
constructor(props) {
    super(props);
    this.state = {loggedIn: true};
    connectAll(this, {
      [LOGIN_STATE_CHANGE]: (loggedIn) => this.setState({loggedIn}),
      [CAR_MODEL_SELECTION_CHANGE]: (selectedCarModel) 
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

# Using Metamatic's Embedded Data Container

When you code with Metamatic the chances are that you don't need to define any data container at all but rather let over this headache over to 
the Metamatic framework. Metamatic knows how to keep containers in pure immutable state and guards their data purity like a lion. When you use Metamatic's 
**update** and **store** functions then Metamatic will take care of the boring job of managing the actual data container. Then you only need to update states
and connect your components to states that they need.

Consider that you want to configure an appwide state, for example an *activeUser* object that shall keep the active user's important data safe in one place
in the app. That is fantastically easy using **store** function. First, you have to define the name of your app state. Let's do it:

```js
export const STATE_ACTIVE_USER = 'STATE_ACTIVE_USER';
```

Then, *store* the state inside the Metamatic's embedded state container:

```js
import {store} from 'metamatic';
 
store(STATE_ACTIVE_USER, {
  username: 'someusername',
  emailAddress: 'some.email@someaddress.com'
});

```

Now Metamatic has stored the the active user's data. Oh and yes, of course you can also load that data from server and store the received JSON:
 
 ```js
 
 store(STATE_ACTIVE_USER, jsonDataFromServer);
 
 ```
 
 When you want this data to be available for some component, yes, in deed React or Vue or Angular or whatever kind of JavaScript component, just bind that component
 to the Metamatic data container throuch connect function. Here is a ReactJS example, connecting a component to a Metamatic state is actually just one line of code:
 
 
```js

import {connect} from 'metamatic';

class UserInfo extends Component {
  
  componentDidMount = () => connect(this, STATE_ACTIVE_USER, (state) => this.setState(state));

}

```

If the state was initially set using *store* function before an event was connected to it, it still works because Metamatic connects listeners to states
retrospectively, which means you can set a state earlier somewhere and once a component is later on connected to that state, it is then cloned into the listener
component at the time when the component is mounted. But don't connect a component to Metamatic inside a constructor because *connect* may immediately 
try to clone a state into container. And that must not be done in the constructor yet because at the time a constructor function is executed component is not yet
mounted and it is a wrong thing to do to set state on a component that isn't yet mounted!

Needless to say, when the state is updated later on, it will then automatically update all connected components. For updating states, you can use both **update**
and **store** functions. The difference between these two functions is that that *store* completely overrides the existing state and *update* only updates it:

 ```js
update(STATE_ACTIVE_USER, {
  emailAddress: 'new-email-address@somedomain.com',
  phone: '1234567'
});

 ``` 

In this example, *update* function just leaves the original *username* attribute in the state intact, defines a new attribute *phone* and overrides *emailAddress*.
If you used *store* here inside of *update*, username would have been deleted from the state because it was not set in the update object. You can also
use *update* function when you define a state first time, the difference is just that *update* merges new data state with the existing one whereas *store*
totally replaces the old data state with the new one. Therefore *store* is useful if you want to entirely remove some attributes from a state.


# Implementing Your Own MetaStore Container

Albeit Most likely *store* and *update* functions are all what you need for state container management, there may still want to be situations that user might
want to do some old-school state container coding and define state containers by themselves. The good news is that Metamatic supports even that kind of approach
as well.

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

export const STATE_EMAIL_ADDRESS = 'MetaStore:user.emailAddress';
export const setEmailAddress = (emailAddress) => 
  updateStore(MetaStore, STATE_EMAIL_ADDRESS, emailAddress);
```

And register any React component to listen for email address change:

```js
constructor(props) {
  super(props);
  this.state = {};
  connect(this, STATE_EMAIL_ADDRESS, (emailAddress) => this.setState({emailAddress}));
}
```

For most cases, this is all what you need! In most cases, you only need MetaStore to replicate the data, store it, and broadcast the change
to all parts of the app where that data is being displayed. But if you want to create a custom setter function that does some custom modification to the
objects other than just storing them, you can also write an entirely customized setter function and then exclusively dispatch whatever you wish:

```js
export const EMAIL_ADDRESS_CHANGE = 'EMAIL_ADDRESS_CHANGE';

export const setEmailAddress = (emailAddress) => {
  MetaStore.modifiedEmailAddress = doSomeModifications(emailAddress);
  dispatch(EMAIL_ADDRESS_CHANGE, modifiedEmailAddress);
}
```

## Use updateStore Function for Efficient State Manipulation

It's very common that you want MetaStore to only do the basic thing: store and dispatch. Therefore Metamatic provides **updateStore** function 
to do this on a whim. The wonderful thing is that you can achieve the essential store-and-broadcast incidence with one line of code:

```js
export const setEmailAddress = (emailAddress) => 
  updateStore(MetaStore, 'MetaStore:user.emailAddress', emailAddress);
```

What *updateStore* does is that it clones the value object, in this case the *emailAddress* (no matter whether it's a primitive type or a complex object),
updates the "emailAddress" property inside *MetaStore* and then dispatches this changed value to all over the app, updating all components that use this property.

The first parameter for *updateStore* function is the actual store that you created earlier. The second parameter is the property locator.
It specifies the target property inside the state container that will be updated. In this case, there is *user* object inside MetaStore, 
having a property *emailAddress* to be updated. 

If that structure does not exist inside the container, no worries, it will be created by *updateStore* on the fly!
After the state update described in the example above, *MetaStore* would contain a structure as follows: 

```js
MetaStore = {
  user: {
    emailAddress: 'somebody@somewhere.com'
  }
}
```

After the property was updated inside the container, it will then be broadcasted to all over the app as a passenger for an event, whose name is, 
perhaps not surprisingly, exactly the same as the property locator, which is in this example 'MetaStore:user.emailAddress'.

It is highly recommended that you parametrize the property locator, for example as follows: 
 

```js

export const STATE_EMAIL_ADDRESS = 'MetaStore:user.emailAddress';
export const setEmailAddress = (emailAddress) => updateStore(MetaStore, STATE_EMAIL_ADDRESS, emailAddress);

```

Parametrizing the event is very practical because you can then more easily implement a state change listener in receiving React components that will update
themselves when the state was changed:

```js
componentDidMount = () => connect(this, STATE_EMAIL_ADDRESS, (emailAddress) => this.setState({emailAddress}));
}
```

## Preconfigure Listener Components With observeStore Function

You may want components to receive their states or part of their states from outside already upon mounting. Let's assume that your state container
holds a list of cars already in a very early phase of the application initialization. Then later you want to create a car selector component that should 
have the car data available already when it's created - not only when it's changed next time. Why not? It makes sense that we should preconfigure
a component's state with right data already early on when the component is being created in the first place - given that the data is already available
in some part of the application by that time, right?

```js

// MetaStore with preconfigured values available:
import {observeStore} from 'metamatic';

const MetaStore = {
  currentUser: {
    carsAvailable: [
        {
          value: 'tesla-model-3',
          label: 'Tesla Model 3'
        },
        {
          value: 'kia-niro-ev',
          label: '2019 Kia Niro EV'
        }
    ]
  }
}

// make a data event to point to values in store:
export const STATE_CARS_AVAILABLE = 'MetaStore:currentUser.carsAvailable';

// make the data observable:
observeStore(MetaStore, STATE_CARS_AVAILABLE);
```

Now, let's make CarSelector receive the available cars preconfigured already when the component is being mounted:

```js
...
import {connect} from 'metamatic';
import {STATE_CARS_AVAILABLE} from '../store/MetaStore';

class CarSelector extends  Component {
                          
  componentDidMount => connect(this, STATE_CARS_AVAILABLE, (carsAvailable) => this.setState({carsAvailable}));
  ...
}
```

What happens here is that since the available cars were defined already earlier in the MetaStore, now when a new CarSelector component instance is created,
the available cars will be copied into its state from the MetaStore already in the constructor. A very convenient way to preconfigure React object's states
upon initialization! Of course, in real world, the available cars list won't be hard-coded inside MetaStore. They will rather be loaded over REST API and then
placed into MetaStore by preferrably using **updateStore** function. Either way, **connect** function will clone that car data into CarSelector's state
immediately when it's available!

 
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
