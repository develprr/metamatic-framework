/*
The Metamatic Framework
Author: Heikki Kupiainen / Metamatic.net
License: Apache 2.0
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _metamaticNetMetaObject = require('@metamatic.net/meta-object');

var stateValueMap = {};
var stateProcessorMap = {};

var storeListenerMap = {};
var metamaticId = 0;

// storage manager
var LOCAL_STORAGE = 'LOCAL_STORAGE';
var SESSION_STORAGE = 'SESSION_STORAGE';
var MEMORY_STORAGE = 'MEMORY_STORAGE';

var defaultStore = {};

var getPrimaryStorage = function getPrimaryStorage() {
  return typeof localStorage !== 'undefined' ? localStorage : {
    setItem: function setItem(key, value) {
      return saveStoreToMemoryStorage(key, value);
    },
    getItem: function getItem(key) {
      return loadStoreFromMemoryStorage(key);
    }
  };
};

var setStorageType = function setStorageType(storageType) {
  return getPrimaryStorage().setItem('_METAMATIC_STORAGE_TYPE', storageType);
};

var getStorageType = function getStorageType() {
  return getPrimaryStorage().getItem('_METAMATIC_STORAGE_TYPE') || LOCAL_STORAGE;
};

var useLocalStorage = function useLocalStorage() {
  return setStorageType(LOCAL_STORAGE);
};

exports.useLocalStorage = useLocalStorage;
var useSessionStorage = function useSessionStorage() {
  return setStorageType(SESSION_STORAGE);
};

exports.useSessionStorage = useSessionStorage;
var useMemoryStorage = function useMemoryStorage() {
  return setStorageType(MEMORY_STORAGE);
};

exports.useMemoryStorage = useMemoryStorage;
var saveStore = function saveStore(storeName, store) {
  return getSaveStoreFunction()(storeName, store);
};

var loadStore = function loadStore(storeName) {
  return getLoadObjectFunction()(storeName);
};

var saveStoreToLocalStorage = function saveStoreToLocalStorage(storeName, store) {
  return localStorage.setItem(storeName, JSON.stringify(store));
};

var saveStoreToSessionStorage = function saveStoreToSessionStorage(storeName, store) {
  return sessionStorage.setItem(storeName, JSON.stringify(store));
};

var saveStoreToMemoryStorage = function saveStoreToMemoryStorage(storeName, store) {
  return defaultStore[storeName] = duplicateContainer(store);
};

var getSaveStoreFunction = function getSaveStoreFunction() {
  var _LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType;

  return (_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType = {}, _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType, LOCAL_STORAGE, saveStoreToLocalStorage), _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType, SESSION_STORAGE, saveStoreToSessionStorage), _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType, MEMORY_STORAGE, saveStoreToMemoryStorage), _LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType)[getStorageType()];
};

var loadStoreFromLocalStorage = function loadStoreFromLocalStorage(storeName) {
  return jsonToObject(localStorage.getItem(storeName));
};

var loadStoreFromSessionStorage = function loadStoreFromSessionStorage(storeName) {
  return jsonToObject(sessionStorage.getItem(storeName));
};

var loadStoreFromMemoryStorage = function loadStoreFromMemoryStorage(storeName) {
  return safelyDuplicateContainer(defaultStore[storeName]);
};

var getLoadObjectFunction = function getLoadObjectFunction() {
  var _LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2;

  return (_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2 = {}, _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2, LOCAL_STORAGE, loadStoreFromLocalStorage), _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2, SESSION_STORAGE, loadStoreFromSessionStorage), _defineProperty(_LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2, MEMORY_STORAGE, loadStoreFromMemoryStorage), _LOCAL_STORAGE$SESSION_STORAGE$MEMORY_STORAGE$getStorageType2)[getStorageType()];
};

var existsStore = function existsStore(storeName) {
  return existsItem(loadStore(storeName));
};

var getNestedState = function getNestedState(storeName, statePath) {
  var item = loadStore(storeName);
  return (0, _metamaticNetMetaObject.getNestedObject)(item, statePath);
};

exports.getNestedState = getNestedState;
var getContainerData = function getContainerData(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var container = _x,
        pathArray = _x2;
    _again = false;

    if (pathArray.length === 0) {
      return container;
    }
    var nextProp = pathArray.shift();
    var innerContainer = container[nextProp];
    if (innerContainer) {
      _x = innerContainer;
      _x2 = pathArray;
      _again = true;
      nextProp = innerContainer = undefined;
      continue _function;
    } else {
      return null;
    }
  }
};

// conversion

var jsonToObject = function jsonToObject(json) {
  if (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
};

var instantiateContainer = function instantiateContainer(containerJson) {
  if (!containerJson) {
    return null;
  }
  try {
    return JSON.parse(containerJson);
  } catch (e) {
    return null;
  }
};

exports.instantiateContainer = instantiateContainer;
var duplicateContainer = function duplicateContainer(item) {
  try {
    return JSON.parse(JSON.stringify(item));
  } catch (e) {
    return item;
  }
};

exports.duplicateContainer = duplicateContainer;
var equalContainers = function equalContainers(container1, container2) {
  return JSON.stringify(container1) === JSON.stringify(container2);
};

var safelyDuplicateContainer = function safelyDuplicateContainer(container) {
  return container ? duplicateContainer(container) : null;
};

exports.safelyDuplicateContainer = safelyDuplicateContainer;
var existsItem = function existsItem(variable) {
  return !(typeof variable === 'undefined' || variable === null);
};

exports.existsItem = existsItem;
var isContainer = function isContainer(item) {
  return item && (typeof item === 'object' || item instanceof Array);
};

var ensureContainer = function ensureContainer(item) {
  return item ? isContainer(item) ? item : { _content: item } : {};
};

exports.ensureContainer = ensureContainer;
var getContentOrCloneContainer = function getContentOrCloneContainer(item) {
  return item ? safelyDuplicateContainer(item['_content'] || item) : null;
};

exports.getContentOrCloneContainer = getContentOrCloneContainer;
//stores

var setStores = function setStores(storesMap) {
  return Object.keys(storesMap).map(function (key) {
    return setStore(key, storesMap[key]);
  });
};

exports.setStores = setStores;
var updateStore = function updateStore(storeName, storeUpdate) {
  var targetStore = loadStore(storeName) || {};
  storeUpdate = ensureContainer(storeUpdate);
  targetStore = Object.assign(targetStore, storeUpdate);
  saveStore(storeName, targetStore);
  broadcastEvent(storeName, targetStore);
  return safelyDuplicateContainer(targetStore);
};

exports.updateStore = updateStore;
var initListStore = function initListStore(storeName, newStore) {
  if (existsStore(storeName)) {
    var existingStore = loadStore(storeName);
    broadcastEvent(storeName, existingStore);
    return existingStore;
  }
  saveStore(storeName, newStore);
  broadcastEvent(storeName, newStore);
  return safelyDuplicateContainer(newStore);
};

var initMapStore = function initMapStore(storeName, newStore) {
  var targetItem = loadStore(storeName) || {};
  newStore = ensureContainer(newStore);
  Object.keys(newStore).forEach(function (key) {
    return !targetItem.hasOwnProperty(key) && (targetItem[key] = newStore[key]);
  });
  saveStore(storeName, targetItem);
  broadcastEvent(storeName, targetItem);
  return safelyDuplicateContainer(targetItem);
};

var initStore = function initStore(storeName, newStore) {
  return Array.isArray(newStore) ? initListStore(storeName, newStore) : initMapStore(storeName, newStore);
};

exports.initStore = initStore;
var initStores = function initStores(storesMap) {
  return Object.keys(storesMap).map(function (storeName) {
    return initStore(storeName, storesMap[storeName]);
  });
};

exports.initStores = initStores;
var containsState = function containsState(storeName, property) {
  return (loadStore(storeName) || {})[property];
};

exports.containsState = containsState;
var getStore = function getStore(storeName) {
  var store = loadStore(storeName);
  return store['_content'] || store;
};

exports.getStore = getStore;
var getState = function getState(storeName, stateName) {
  return stateName ? getNestedState(storeName, stateName) : getStore(storeName);
};

exports.getState = getState;
var setState = function setState(storeName, statePath, state) {
  var store = getStore(storeName) || {};
  var objectNames = statePath.split('.');
  var targetProperty = objectNames.pop();
  var targetObject = store;
  objectNames.forEach(function (objectName) {
    if (!targetObject[objectName]) {
      targetObject[objectName] = {};
    }
    targetObject = targetObject[objectName];
  });
  targetObject[targetProperty] = state;
  setStore(storeName, store);
  return state;
};

exports.setState = setState;
var ensureMetamaticId = function ensureMetamaticId(component) {
  return component._metamaticId || (function (component) {
    metamaticId += 1;
    component._metamaticId = metamaticId.toString();
    return component._metamaticId;
  })(component);
};

var connectToStores = function connectToStores(component, processorByStoreNameMap) {
  return Object.keys(processorByStoreNameMap).map(function (storeName) {
    return connectToStore(component, storeName, processorByStoreNameMap[storeName]);
  });
};

exports.connectToStores = connectToStores;
// a simple function to couple a listener with matching event
var connectToStore = function connectToStore(listener, storeName, processorFunction) {
  var metamaticId = ensureMetamaticId(listener);
  storeListenerMap[storeName] = storeListenerMap[storeName] || {};
  storeListenerMap[storeName][metamaticId.toString()] = processorFunction;
  var store = loadStore(storeName);
  if (store) {
    processorFunction(getContentOrCloneContainer(store));
  }

  if (storeName.indexOf('CONNECT/') !== 0) {
    var connectorName = 'CONNECT/' + storeName;
    broadcastEvent(connectorName, listener);
  }
};

exports.connectToStore = connectToStore;
// use handleEvent to connect anonymous listeners that don't need to be unmounted thus disconnected
var handleEvent = function handleEvent(eventName, targetFunction) {
  return connectToStore({}, eventName, targetFunction);
};

exports.handleEvent = handleEvent;
//add handlers to multiple events with a single method call
var handleEvents = function handleEvents(eventMap) {
  return Object.keys(eventMap).map(function (key) {
    return handleEvent(key, eventMap[key]);
  });
};

exports.handleEvents = handleEvents;
//use to disconnect react components upon unmounting
var disconnectFromStores = function disconnectFromStores(listenerComponent) {
  removeListenerFromStores(listenerComponent);
  removeListenerFromStates(listenerComponent);
};

exports.disconnectFromStores = disconnectFromStores;
var removeListenerFromStores = function removeListenerFromStores(listener) {
  return Object.keys(storeListenerMap).forEach(function (eventName) {
    return removeListenerFromStore(eventName, listener);
  });
};

var removeListenerFromStates = function removeListenerFromStates(listener) {
  var metamaticId = listener._metamaticId;
  Object.keys(stateProcessorMap).forEach(function (key) {
    if (key.split(':')[0] === metamaticId) {
      delete stateProcessorMap[key];
      delete stateValueMap[key];
    }
  });
};

var removeListenerFromStore = function removeListenerFromStore(storeName, listener) {
  var metamaticId = listener._metamaticId;
  var listenerMap = storeListenerMap[storeName];
  if (!listenerMap) {
    return;
  }
  delete listenerMap[metamaticId.toString()];
};

var setStore = function setStore(storeName, newStore) {
  newStore = ensureContainer(newStore);
  saveStore(storeName, newStore);
  broadcastEvent(storeName, newStore);
  return safelyDuplicateContainer(newStore);
};

exports.setStore = setStore;
var clearStore = function clearStore(storeName) {
  return setStore(storeName, {});
};

exports.clearStore = clearStore;
var clearStates = function clearStates(storeName) {
  var store = loadStore(storeName);
  Object.keys(store).forEach(function (key) {
    return store[key] = null;
  });
  return setStore(storeName, store);
};

exports.clearStates = clearStates;
var broadcastEvent = function broadcastEvent(eventName, item) {
  Object.values(storeListenerMap[eventName] || {}).forEach(function (listener) {
    return listener(getContentOrCloneContainer(item));
  });
  invokeStateProcessorsInStore(eventName);
};

exports.broadcastEvent = broadcastEvent;
var connectToStates = function connectToStates(listener, storeName, stateProcessorMap) {
  Object.keys(stateProcessorMap).forEach(function (stateName) {
    var processor = stateProcessorMap[stateName];
    attachToState(listener, storeName, stateName, processor);
  });
  if (storeName.indexOf('CONNECT/') !== 0) {
    var stateConnectorName = 'CONNECT/' + storeName;
    broadcastEvent(stateConnectorName, listener);
  }
};

exports.connectToStates = connectToStates;
var attachToState = function attachToState(listener, storeName, stateName, processor) {
  var metamaticId = ensureMetamaticId(listener);
  var currentValue = getNestedState(storeName, stateName);
  var processorPath = metamaticId + ':' + storeName + ':' + stateName;
  stateValueMap[processorPath] = currentValue;
  stateProcessorMap[processorPath] = processor;
  if (currentValue) {
    processor(currentValue);
  }
  if (storeName.indexOf('CONNECT/') !== 0) {
    var stateConnectorName = 'CONNECT/' + storeName + ':' + stateName;
    broadcastEvent(stateConnectorName, listener);
  }
};

var connectToState = function connectToState(listener, storeName, stateName, processor) {
  attachToState(listener, storeName, stateName, processor);
  if (storeName.indexOf('CONNECT/') !== 0) {
    var storeConnectorName = 'CONNECT/' + storeName;
    broadcastEvent(storeConnectorName, listener);
  }
};

exports.connectToState = connectToState;
var getNestedItemByProcessorPath = function getNestedItemByProcessorPath(processorPath) {
  var storeName = extractStoreName(processorPath);
  var nestedStateName = extractStateName(processorPath);
  return getNestedState(storeName, nestedStateName);
};

var extractStoreName = function extractStoreName(processorPath) {
  return processorPath.split(':')[1];
};

var extractStateName = function extractStateName(processorPath) {
  return processorPath.split(':')[2];
};

var invokeHandler = function invokeHandler(processorPath) {
  var processor = stateProcessorMap[processorPath];
  var originalValue = stateValueMap[processorPath];
  var itemValue = getNestedItemByProcessorPath(processorPath);
  if (equalContainers(originalValue, itemValue)) {
    return;
  }
  processor(getContentOrCloneContainer(itemValue));
  stateValueMap[processorPath] = itemValue;
  return itemValue;
};

var invokeStateProcessorsInStore = function invokeStateProcessorsInStore(storeName) {
  var processorPaths = Object.keys(stateProcessorMap).filter(function (key) {
    return key.includes(':' + storeName + ':');
  });
  processorPaths.forEach(invokeHandler);
};

//reset Metamatic state manager.
var resetMetamatic = function resetMetamatic() {
  stateValueMap = {};
  stateProcessorMap = {};
  storeListenerMap = {};
  metamaticId = 0;
};
exports.resetMetamatic = resetMetamatic;
//# sourceMappingURL=metamatic.js.map
