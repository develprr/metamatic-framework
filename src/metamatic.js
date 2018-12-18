/*
The Metamatic Framework
Author: Heikki Kupiainen / Metamatic.net
License: Apache 2.0
*/

import {getNestedObject} from '@metamatic.net/meta-object';

let stateValueMap = {};
let stateProcessorMap = {};

let storeListenerMap = {};
let metamaticId = 0;

// storage manager
const LOCAL_STORAGE = 'LOCAL_STORAGE';
const SESSION_STORAGE = 'SESSION_STORAGE';
const MEMORY_STORAGE = 'MEMORY_STORAGE';

let defaultStore = {};

const getPrimaryStorage = () => typeof localStorage !== 'undefined' ? localStorage : {
  setItem: (key, value) => saveStoreToMemoryStorage(key, value),
  getItem: key => loadStoreFromMemoryStorage(key)
};

const setStorageType = (storageType) => getPrimaryStorage().setItem('_METAMATIC_STORAGE_TYPE', storageType);

const getStorageType = () => getPrimaryStorage().getItem('_METAMATIC_STORAGE_TYPE') || LOCAL_STORAGE;

export const useLocalStorage = () => setStorageType(LOCAL_STORAGE);

export const useSessionStorage = () => setStorageType(SESSION_STORAGE);

export const useMemoryStorage = () => setStorageType(MEMORY_STORAGE);

const saveStore = (storeName, store) => getSaveStoreFunction()(storeName, store);

const loadStore = (storeName) => getLoadObjectFunction()(storeName);

const saveStoreToLocalStorage = (storeName, store) => localStorage.setItem(storeName, JSON.stringify(store));

const saveStoreToSessionStorage = (storeName, store) => sessionStorage.setItem(storeName, JSON.stringify(store));

const saveStoreToMemoryStorage = (storeName, store) => defaultStore[storeName] = duplicateContainer(store);

const getSaveStoreFunction = () => ({
  [LOCAL_STORAGE]: saveStoreToLocalStorage,
  [SESSION_STORAGE]: saveStoreToSessionStorage,
  [MEMORY_STORAGE]: saveStoreToMemoryStorage
}[getStorageType()]);

const loadStoreFromLocalStorage = (storeName) => jsonToObject(localStorage.getItem(storeName));

const loadStoreFromSessionStorage = (storeName) => jsonToObject(sessionStorage.getItem(storeName));

const loadStoreFromMemoryStorage = (storeName) => safelyDuplicateContainer(defaultStore[storeName]);

const getLoadObjectFunction = () => ({
  [LOCAL_STORAGE]: loadStoreFromLocalStorage,
  [SESSION_STORAGE]: loadStoreFromSessionStorage,
  [MEMORY_STORAGE]: loadStoreFromMemoryStorage
})[getStorageType()];

const existsStore = (storeName) => existsItem(loadStore(storeName));

export const getNestedState = (storeName, statePath) => {
  const item = loadStore(storeName);
  return getNestedObject(item, statePath);
};

const getContainerData = (container, pathArray) => {
  if (pathArray.length === 0) {
    return container;
  }
  let nextProp = pathArray.shift();
  const innerContainer = container[nextProp];
  return innerContainer ? getContainerData(innerContainer, pathArray) : null;
};

// conversion

const jsonToObject = (json) => {
  if (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
}

export const instantiateContainer = (containerJson) => {
  if (!containerJson) {
    return null;
  }
  try {
    return JSON.parse(containerJson);
  } catch (e) {
    return null;
  }
};

export const duplicateContainer = (item) => {
  try {
    return JSON.parse(JSON.stringify(item));
  } catch (e) {
    return item;
  }
};

const equalContainers = (container1, container2) => JSON.stringify(container1) === JSON.stringify(container2);

export const safelyDuplicateContainer = (container) => container ? duplicateContainer(container) : null;

export const existsItem = (variable) => !(typeof variable === 'undefined' || variable === null);

const isContainer = (item) => item && (typeof item === 'object' || item instanceof Array);

export const ensureContainer = (item) => item ? isContainer(item) ? item : {_content: item} : {};

export const getContentOrCloneContainer = (item) => item ? safelyDuplicateContainer(item['_content'] || item) : null;

//stores

export const setStores = (storesMap) => Object.keys(storesMap).map(key => setStore(key, storesMap[key]));

export const updateStore = (storeName, storeUpdate) => {
  let targetStore = loadStore(storeName) || {};
  storeUpdate = ensureContainer(storeUpdate);
  targetStore = Object.assign(targetStore, storeUpdate);
  saveStore(storeName, targetStore);
  broadcastEvent(storeName, targetStore);
  return safelyDuplicateContainer(targetStore);
}

const initListStore = (storeName, newStore) => {
  if (existsStore(storeName)) {
    const existingStore = loadStore(storeName);
    broadcastEvent(storeName, existingStore);
    return existingStore;
  }
  saveStore(storeName, newStore);
  broadcastEvent(storeName, newStore);
  return safelyDuplicateContainer(newStore);
};

const initMapStore = (storeName, newStore) => {
  let targetItem = loadStore(storeName) || {};
  newStore = ensureContainer(newStore);
  Object.keys(newStore).forEach(key => !targetItem.hasOwnProperty(key) && (targetItem[key] = newStore[key]));
  saveStore(storeName, targetItem);
  broadcastEvent(storeName, targetItem);
  return safelyDuplicateContainer(targetItem);
};

export const initStore = (storeName, newStore) => Array.isArray(newStore) ? initListStore(storeName, newStore) : initMapStore(storeName, newStore);

export const initStores = (storesMap) => Object.keys(storesMap).map(storeName => initStore(storeName, storesMap[storeName]));

export const containsState = (storeName, property) => (loadStore(storeName) || {})[property];

export const getStore = (storeName) => {
  const store = loadStore(storeName);
  return store['_content'] || store;
}

export const getState = (storeName, stateName) => stateName ? getNestedState(storeName, stateName) : getStore(storeName);

export const setState = (storeName, statePath, state) => {
  const store = getStore(storeName) || {};
  const objectNames = statePath.split('.');
  let targetProperty = objectNames.pop();
  let targetObject = store;
  objectNames.forEach((objectName) => {
    if (!targetObject[objectName]) {
      targetObject[objectName] = {};
    }
    targetObject = targetObject[objectName];
  })
  targetObject[targetProperty] = state;
  setStore(storeName, store);
  return state;
}

const ensureMetamaticId = (component) => component._metamaticId || (component => {
  metamaticId += 1;
  component._metamaticId = metamaticId.toString();
  return component._metamaticId;
})(component);

export const connectToStores = (component, processorByStoreNameMap) =>
    Object.keys(processorByStoreNameMap).map(storeName => connectToStore(component, storeName, processorByStoreNameMap[storeName]));

// a simple function to couple a listener with matching event
export const connectToStore = (listener, storeName, processorFunction) => {
  const metamaticId = ensureMetamaticId(listener);
  storeListenerMap[storeName] = storeListenerMap[storeName] || {};
  storeListenerMap[storeName][metamaticId.toString()] = processorFunction;
  const store = loadStore(storeName);
  if (store) {
    processorFunction(getContentOrCloneContainer(store));
  }

  if (storeName.indexOf('CONNECT/') !== 0) {
    const connectorName = 'CONNECT/' + storeName;
    broadcastEvent(connectorName, listener);
  }
}

// use handleEvent to connect anonymous listeners that don't need to be unmounted thus disconnected
export const handleEvent = (eventName, targetFunction) => connectToStore({}, eventName, targetFunction);

//add handlers to multiple events with a single method call
export const handleEvents = (eventMap) =>
    Object.keys(eventMap).map(key => handleEvent(key, eventMap[key]));

//use to disconnect react components upon unmounting
export const disconnectFromStores = (listenerComponent) => {
  removeListenerFromStores(listenerComponent);
  removeListenerFromStates(listenerComponent);
}

const removeListenerFromStores = (listener) => Object.keys(storeListenerMap).forEach(eventName => removeListenerFromStore(eventName, listener));

const removeListenerFromStates = (listener) => {
  const metamaticId = listener._metamaticId;
  Object.keys(stateProcessorMap).forEach(key => {
    if (key.split(':')[0] === metamaticId) {
      delete stateProcessorMap[key];
      delete stateValueMap[key];
    }
  });
}

const removeListenerFromStore = (storeName, listener) => {
  const metamaticId = listener._metamaticId;
  const listenerMap = storeListenerMap[storeName];
  if (!listenerMap) {
    return;
  }
  delete listenerMap[metamaticId.toString()];
}

export const setStore = (storeName, newStore) => {
  newStore = ensureContainer(newStore);
  saveStore(storeName, newStore);
  broadcastEvent(storeName, newStore);
  return safelyDuplicateContainer(newStore);
};

export const clearStore = (storeName) => setStore(storeName, {});

export const clearStates = (storeName) => {
  const store = loadStore(storeName);
  Object.keys(store).forEach(key => store[key] = null);
  return setStore(storeName, store);
}

export const broadcastEvent = (eventName, item) => {
  Object.values(storeListenerMap[eventName] || {}).forEach((listener) => listener(getContentOrCloneContainer(item)));
  invokeStateProcessorsInStore(eventName);
}

export const connectToStates = (listener, storeName, stateProcessorMap) => {
  Object.keys(stateProcessorMap).forEach(stateName => {
    const processor = stateProcessorMap[stateName];
    attachToState(listener, storeName, stateName, processor);
  });
  if (storeName.indexOf('CONNECT/') !== 0) {
    const stateConnectorName = 'CONNECT/' + storeName;
    broadcastEvent(stateConnectorName, listener);
  }
}

const attachToState = (listener, storeName, stateName, processor) => {
  const metamaticId = ensureMetamaticId(listener);
  const currentValue = getNestedState(storeName, stateName);
  const processorPath = metamaticId + ':' + storeName + ':' + stateName;
  stateValueMap[processorPath] = currentValue;
  stateProcessorMap[processorPath] = processor;
  if (currentValue) {
    processor(currentValue);
  }
  if (storeName.indexOf('CONNECT/') !== 0) {
    const stateConnectorName = 'CONNECT/' + storeName + ':' + stateName;
    broadcastEvent(stateConnectorName, listener);
  }
}

export const connectToState = (listener, storeName, stateName, processor) => {
  attachToState(listener, storeName, stateName, processor);
  if (storeName.indexOf('CONNECT/') !== 0) {
    const storeConnectorName = 'CONNECT/' + storeName;
    broadcastEvent(storeConnectorName, listener);
  }
};

const getNestedItemByProcessorPath = (processorPath) => {
  const storeName = extractStoreName(processorPath);
  const nestedStateName = extractStateName(processorPath);
  return getNestedState(storeName, nestedStateName);
};

const extractStoreName = (processorPath) => processorPath.split(':')[1];

const extractStateName = (processorPath) => processorPath.split(':')[2];

const invokeHandler = (processorPath) => {
  const processor = stateProcessorMap[processorPath];
  const originalValue = stateValueMap[processorPath];
  const itemValue = getNestedItemByProcessorPath(processorPath);
  if (equalContainers(originalValue, itemValue)) {
    return;
  }
  processor(getContentOrCloneContainer(itemValue));
  stateValueMap[processorPath] = itemValue;
  return itemValue;
};

const invokeStateProcessorsInStore = (storeName) => {
  const processorPaths = Object.keys(stateProcessorMap).filter(key => key.includes(':' + storeName + ':'));
  processorPaths.forEach(invokeHandler);
};

//reset Metamatic state manager.
export const resetMetamatic = () => {
  stateValueMap = {};
  stateProcessorMap = {};
  storeListenerMap = {};
  metamaticId = 0;
}


