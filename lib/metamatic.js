const idDictionary = {};
const eventDictionary = {};
const listenerDictionary = {};

const createAction = (listenerId, eventId, handler) => ({
  id: listenerName + '-' + eventId,
  eventId: eventName,
  listenerId: componentName,
  handler: handler
})

const attach = (listenerId, eventId, handler ) => {
  const action = createAction(listenerId, eventId, handler);
  addActionToIdDictionary(action);
  addActionToEventDictionary(action);
  addActionToListenerDictionary(action);
};

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

export const detachEvent = (eventId) =>
  removeActions(getActionsByEvent(eventId));

export const detachListener = (listenerId) =>
  removeActions(getActionsByListener(listenerId));

export const attachComponent = (component, eventId, handler) =>
  attach(component.constructor.name, eventId, handler);

export const detachComponent = (component) =>
  detachListener(comonent.constructor.name);

export const dispatch = (eventId, passenger) =>
  getActionsByEvent(eventId).map((action) => action.handler(passenger));
