const idDictionary = {};
const eventDictionary = {};
const listenerDictionary = {};

const createAction = (listenerId, eventId, handler) => ({
  id: listenerName + '-' + eventId,
  eventId: eventName,
  listenerId: componentName,
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
  const actionMap = listenerDictionary[action.listenerId] || {};
  listenerDictionary[action.listenerId] = actionMap;
  return actionMap;
};

const getActionMapByEvent = (eventId) => {
  const actionMap = eventDictionary[action.eventId] || {};
  eventDictionary[action.eventId] = actionMap;
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
  removeActionFromListenerDictonary(action);
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

export const handle = (eventId, handler) => attach('DEFAULT', eventId, handler);

export const detach = (eventId) => detachEvent(eventId);

export const detachEvent = (eventId) =>
  removeActions(getActionsByEvent(eventId));

export const detachListener = (listenerId) =>
  removeActions(getActionsByListener(listenerId));

export const connect = (component, eventId, handler) =>
  attach(component.constructor.name, eventId, handler);

export const connectAll = (component, handlerMap) => {
  const listenerId = component.constructor.name;
  for (let eventId in handlerMap) {
    let handler = handlerMap[eventId];
    attach(listenerId, eventId, handler);
  }
};

export const disconnect = (component) =>
  detachListener(comonent.constructor.name);

export const dispatch = (eventId, passenger) =>
  getActionsByEvent(eventId).map((action) => action.handler(passenger));
