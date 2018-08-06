/*
  The Metamatic Framework
  Author: Heikki Kupiainen
  License: Apache 2.0
 */

const idDictionary = {};
const eventDictionary = {};
const listenerDictionary = {};

const createAction = (listenerId, eventId, handler) => ({
  id: listenerId + '-' + eventId,
  eventId: eventId,
  listenerId: listenerId,
  handler: handler
})

const addActionToIdDictionary = (action) => {
  idDictionary[action.id] = action;
};

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
  removeActionFromIdDictionary(action);
  removeActionFromEventDictionary(action);
  removeActionFromListenerDictionary(action);
}

const removeActionFromIdDictionary = (action) => delete idDictionary[action.id];

const removeActionFromEventDictionary = (action) => {
  const map = getActionsByEvent(action);
  delete map[action.id];
};

const removeActionFromListenerDictionary = (action) => {
  const map = getActionsByListener(action);
  delete map[action.id];
};

export const attach = (listenerId, eventId, handler ) => {
  const action = createAction(listenerId, eventId, handler);
  addActionToIdDictionary(action);
  addActionToEventDictionary(action);
  addActionToListenerDictionary(action);
};

const getId = (component) => component.constructor.name === 'String' ? component : component.constructor.name;

export const handle = (eventId, handler) => attach('DEFAULT', eventId, handler);

export const detach = (eventId) => detachEvent(eventId);

export const detachEvent = (eventId) =>
  removeActions(getActionsByEvent(eventId));

export const detachListener = (listenerId) =>
  removeActions(getActionsByListener(listenerId));

/*
  Register a component to MetaStore with connect function. Use connect function to register such components as listeners that have a limited lifetime
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
  call.
 */

export const connectAll = (componentOrId, handlerMap) => {
  const listenerId = getId(componentOrId);
  for (let eventId in handlerMap) {
    let handler = handlerMap[eventId];
    attach(listenerId, eventId, handler);
  }
};

export const disconnect = (component) =>
  detachListener(component.constructor.name);

export const dispatch = (eventId, passenger) =>
  getActionsByEvent(eventId).map((action) => action.handler(passenger));
