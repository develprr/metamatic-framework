/*
  The Metamatitc Framework
  Author: Heikki Kupiainen
  License: Apache 2.0
 */

let eventDictionary = {};
let listenerDictionary = {};
let idCounter = 0;

const createAction = (listenerId, eventId, handler, actionId) => ({
  id: actionId || listenerId + '-' + eventId,
  eventId: eventId,
  listenerId: listenerId,
  handler: handler
})

const addActionToEventDictionary = (action) => {
  const actionMap = getActionMapByEvent(action.eventId);
  actionMap[action.id] = action;
};

const addActionToListenerDictionary = (action) => {
  const actionMap = getActionMapByListener(action.listenerId);
  actionMap[action.id] = action;
};

const getActionMapByListener = (listenerId) => {
  const actionMap = listenerDictionary[listenerId] || {};
  listenerDictionary[listenerId] = actionMap;
  return actionMap;
};

const getActionMapByEvent = (eventId) => {
  const actionMap = eventDictionary[eventId] || {};
  eventDictionary[eventId] = actionMap;
  return actionMap;
}

const getActionsByListener = (listenerId) =>
  Object.values(getActionMapByListener(listenerId));

const getActionsByEvent = (eventId) =>
  Object.values(getActionMapByEvent(eventId));

const removeActionsByListener = (listenerId) =>
  removeActions(getActionsByListener(listenerId));

const removeActions = (actions) => actions.map(removeAction);

const removeAction = (action) => {
  removeActionFromEventDictionary(action);
  removeActionFromListenerDictionary(action);
}

const removeActionFromEventDictionary = (action) => {
  const map = getActionsByEvent(action);
  delete map[action.id];
};

const removeActionFromListenerDictionary = (action) => {
  const map = getActionsByListener(action);
  delete map[action.id];
};

const attach = (listenerId, eventId, handler, customId) => {
  const action = createAction(listenerId, eventId, handler, customId);
  addActionToEventDictionary(action);
  addActionToListenerDictionary(action);
};

const getId = (component) => component.constructor.name === 'String' ? component : component.constructor.name;

const generateId = () => {
  idCounter += 1;
  return idCounter.toString();
};

const clone = (object) => JSON.parse(JSON.stringify(object));
/*
 Bind listeners to events using handle function:

 handle('SOME-EVENT', (value) => {
    console.log(value);
    ...
 })
 */
export const handle = (eventId, handler) => attach('DEFAULT', eventId, handler, generateId());

/*
  WHen you want to kill an event, meaning that you don't want any handler to listen for it any more, call unhandle function:

  unhandle('SOME-EVENT');

 */

export const unhandle = (eventId) => removeActions(getActionsByEvent(eventId));

/*
  Register a component to MetaStore with connect function. This is similar to handle but it should be used to register such components as listeners that have a limited lifetime
  such as React components. You can unregister later listeners that have been added with connect function.

  If you connect React components that have only one living instance at time, you can pass the React component itself as parameter (this).
  But if you connect React comppnents that have many simultaneously living instances, instead pass a unique identifier has parameter.

  When connection a React component, preferrably call connect function already in the component's constructor.
  Example of connecting single instance React component:

  connect(this, CAR_INFO_CHANGE, (newCarInfo) => this.setState({carInfo: newCarInfo});

  This works when there is only one instance of the listener component. Since it currently uses component's class name as ID (component.constructor.name)
  it's only suitable to be used by components that have only one instance at a time. If you have many instances of the same component,
  such as list elements, pass unique id as parameter, The unique ID must be a String:

  connect(someUniqueId, CAR_INFO_CHANGE, (newCarInfo) => this.setState({carInfo: newCarInfo});
 */
export const connect = (componentOrId, eventId, handler) => attach(getId(componentOrId), eventId, handler);

/*
  If you want to connect a component to listen more than one event from MetaStore, you can use connectAll function instead of repeating many times connect
  call:

  connectAll(this, {
    LOGIN_STATE_CHANGE: (loggedIn) => this.setState({loggedIn}),
    CAR_MODEL_SELECTION_CHANGE: (selectedCarModel) => this.setState({selectedCarModel})
   });
*/
export const connectAll = (componentOrId, handlerMap) => {
  const listenerId = getId(componentOrId);
  for (let eventId in handlerMap) {
    let handler = handlerMap[eventId];
    attach(listenerId, eventId, handler);
  }
};

/*
  When you have connected a React component to MetaStore, it is important to disconnect the component from MetaStore upon unmounting it.
  It's not allowed to set state of an unmounted component. I f you don't disconnect a React component from MetaStore upon unmounting, the listener
  function won't die along with the compnent and it will erratically try to set state of a "dead" component, which will cause an error.

  Disconnecting a component from MetaStore upon unmounting:

  disconnect(this);

  Or if you connected the component before using some unique id:

  disconnect(someUniqueId);

 */

export const disconnect = (componentOrId) => removeActions(getActionsByListener(getId(componentOrId)));

/*
  Dispatch metamatic events everywhere in your app. Pass an eventId and a passenger object to the dispatcher. The event id must be a string
  and the passenger object to be passed alongside the event can be any kind of object or primary type:

  dispatch('SOME-EVENT', anyObject);

  Or if you have defined the event in a constant:

  dispatch('SOME-EVENT', anyObject);
 */
export const dispatch = (eventId, passenger) =>  getActionsByEvent(eventId).map((action) => action.handler(clone(passenger)));

/*
  Clear all events and listeners with reset function. Mainly needed only for tests and debugging
 */

export const reset = () => {
  eventDictionary = {};
  listenerDictionary = {};
  idCounter = 0;
};

/*
  get clone of event dictionary . Mainly needed only for debugging by author
 */
export const getEventDictionary = () => ({...eventDictionary});

/*
  get clone of listener dictionary . Mainly needed only for debugging by author
 */
export const getListenerDictionary = () => ({...listenerDictionary});