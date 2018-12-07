import {assert, describe, it} from 'mocha';
import {
  broadcastEvent,
  clearStore,
  connectToStore,
  disconnectFromStores,
  getState,
  getStore,
  handleEvent,
  initStore,
  resetMetamatic,
  setState,
  setStore,
  updateStore,
  useMemoryStorage
} from '../lib/metamatic';

let responses = [];
let value;
let listenerComponent = {};

describe('metamatic framework', () => {

  beforeEach(() => {
    responses = [];
    resetMetamatic();
    useMemoryStorage();
  });

  it('should handle events that have matching event ID', () => {

    handleEvent('TEST-EVENT-1', (value) => {
      value.should.equal('HELLO EARTH');
    });

    broadcastEvent('TEST-EVENT-1', 'HELLO EARTH');
  });

  it('should execute all handle-listeners with matching event ID', () => {

     handleEvent('EARTH-CALLING', (value) => {
       value = 'Trappist 1 e received message: ' + value;
       responses.push(value);
     });

    handleEvent('EARTH-CALLING', (value) => {
       value = 'Trappist 1 e replies to message: ' + value;
       responses.push(value);
     })

     broadcastEvent('EARTH-CALLING', 'Sending out an SOS');
     responses.length.should.equal(2);
   });

  it('should handle strings',  () => {
    handleEvent('STRING-EVENT', (value) => {
      value.should.equal('SOME STRING');
    })
    broadcastEvent('STRING-EVENT', 'SOME STRING')
  });

  it('should handle integers', () => {
    handleEvent('INTEGER-EVENT', (value) => {
      parseInt(value).should.equal(3);
    })
    broadcastEvent('INTEGER-EVENT', 3);
  });

  it('should remove component handlers on disconnect', () => {
    let someComponent = {};
    connectToStore(someComponent, 'SOME_SIMPLE_STORE', (value) => {
      value.should.equal('Sending out an SOS');
    });
    setStore('SOME_SIMPLE_STORE', 'Sending out an SOS');

    //now let's modify the handler to cause an expection
    disconnectFromStores(someComponent);
    broadcastEvent('SOME-EVENT', 'Sending out an SOS');
  });

  it('setStore function should be able to save also primary values, such as strings, as stores, not only json objects', () => {
    const STORE_EMAIL_ADDESS = 'STORE_EMAIL_ADDESS';
    setStore(STORE_EMAIL_ADDESS, 'somebody@trappist');
    getStore(STORE_EMAIL_ADDESS).should.equal('somebody@trappist');
  })

  it('setStore function should be able to persist stores with many states', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataStore);
    getStore(STORE_USER_INFO).emailAddress.should.equal('somebody@trappist');
    getStore(STORE_USER_INFO).username.should.equal('somebody');
  });

  it('setStore function clones objects so modifying original state should not change the data inside the store', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataState = {
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataState);
    dataState.emailAddress = 'afterwards_changed@emailaddress';
    getStore(STORE_USER_INFO).emailAddress.should.equal('somebody@trappist');
  });

  it('setStore function completely overrides the previous state in the container and thereby also existing values', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist',

    };
    setStore(STORE_USER_INFO, dataStore);

    let newStateWithoutUsername = {
      emailAddress: 'somebody@else'
    };

    setStore(STORE_USER_INFO, newStateWithoutUsername);

    'somebody'.should.not.equal( getStore(STORE_USER_INFO).username);
  });

  it('connectToStore function retrospectively receives data state earlier set by store function', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataStore);
    const listener = {};
    connectToStore(listener, STORE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('handleEvent function retrospectively receives data state earlier set by store function', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateStore(STORE_USER_INFO, dataState);
    handleEvent(STORE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('connectToStore function retrospectively receives data store earlier set by update function', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateStore(STORE_USER_INFO, dataStore);
    const listener = {};
    connectToStore(listener, STORE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('handleEvent function retrospectively receives data state earlier set by update function', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateStore(STORE_USER_INFO, dataStore);
    handleEvent(STORE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('update function does not erase old unaffected values inside existing store', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataStore);

    let storeUpdate = {
      emailAddress: 'somebody@else'
    };

    const updatedStore = updateStore(STORE_USER_INFO, storeUpdate);

    handleEvent(STORE_USER_INFO, (userInfo) => {
      responses.push(userInfo)
    });
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
    responses[0].emailAddress.should.equal('somebody@else');
  });

  it('getStore function without parameter returns a store previously stored in metamatic state manager', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataStore);

    const storedObject = getStore(STORE_USER_INFO);
    dataStore.username.should.equal(storedObject.username);
  });

  it('getStore function returns a clone, not the original object', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataStore = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataStore);

    const storedObject = getStore(STORE_USER_INFO);
    dataStore.username = 'changedUsernameInOriginalDataState';
    dataStore.username.should.not.equal(storedObject.username);

  });

  it('clearStore function should override previously set store with an empty object', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setStore(STORE_USER_INFO, dataState);
    clearStore(STORE_USER_INFO);
    const storedObject = getStore(STORE_USER_INFO);
    dataState.username = 'changedUsernameInOriginalDataState';
    dataState.username.should.not.equal(storedObject.username);
  });

  it('initStore function should set values similarly to setStore if the values are not defined before', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';

    initStore(STORE_USER_INFO, {
      loggedIn: false
    });

    const state = getStore(STORE_USER_INFO);

    state.loggedIn.should.equal(false);

  });

  it('initStore function should set only values in a store that were not defined before and not change already existing values', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    initStore(STORE_USER_INFO, {
      loggedIn: false
    });

    setStore(STORE_USER_INFO, {
      loggedIn: true
    });

    initStore(STORE_USER_INFO, {
      loggedIn: false
    });

    const store = getStore(STORE_USER_INFO);

    store.loggedIn.should.equal(true);
  });

  it('setState should update nested state inside store', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    const deepObject = {
      user: {
        username: 'jondoe',
        kids: ['tim', 'kim', 'jim'],
        address: {
          streetAddress: 'Somestreet 1'
        }
      }
    }
    initStore(STORE_USER_INFO, deepObject);
    setState(STORE_USER_INFO, 'user.address.streetAddress', 'Otherstreet 2');
    let nestedState = getState(STORE_USER_INFO, 'user.username');
    nestedState.should.equal('jondoe');
    nestedState =  getState(STORE_USER_INFO, 'user.address.streetAddress');
    nestedState.should.equal('Otherstreet 2');
  });

  it('connectToStore function should cause a corresponding CONNECT event', ()=> {
    const SOME_STORE = 'SOME_STORE';
    const CONNECT_SOME_STORE = 'CONNECT/SOME_STORE';
    const listener = { name: 'someListener' };
    const receivedEvents = [];
    handleEvent(CONNECT_SOME_STORE, (listener) => {
      receivedEvents.push(listener)
    })

    connectToStore(listener,  SOME_STORE, (store) => {
        //connecting to store
    });

    receivedEvents.length.should.equal(1);
  })

  it('connectToStore function should cause a corresponding CONNECT event', ()=> {
    const SOME_STORE = 'SOME_STORE';
    const CONNECT_SOME_STORE = 'CONNECT/SOME_STORE';
    const listener = { name: 'someListener' };
    const receivedEvents = [];
    handleEvent(CONNECT_SOME_STORE, (listener) => {
      receivedEvents.push(listener)
    })

    connectToStore(listener,  SOME_STORE, (store) => {
      //connecting to store
    });

    receivedEvents.length.should.equal(1);
  })

  it('invoking store to load missing data for connected component', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    const CONNECT_USER_INFO = `CONNECT/${STORE_USER_INFO}`;

    //mimicking a React-style component with setState function.
    const listenerComponent = {
      state: {},
      setState:  function (state) { this.state = state }
    };

    const loadUserData = () => {
      //load userData with ajax and then update store with that data
      updateStore(STORE_USER_INFO, {
        userData: {
          name: 'Jon Doe'
        }
      })
    };

    handleEvent(CONNECT_USER_INFO, () => {
      loadUserData()
    });

    connectToStore(listenerComponent, STORE_USER_INFO, (store) => listenerComponent.setState({...listenerComponent.state, ...store.userData}));
    listenerComponent.state.name.should.equal('Jon Doe');
  });

  it('connecting to multiple states inside one store', () => {
    const STORE_USER_INFO = 'STORE_USER_INFO';
    const listenerComponent = {
      state: {},
      setState:  function (state) { this.state = state }
    };
  });

});
