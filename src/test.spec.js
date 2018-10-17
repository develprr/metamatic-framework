import {assert, describe, it} from 'mocha';
import {connect, disconnect, dispatch, handle, unhandle, reset, setState, getStore, updateState, getState, clearState, useMemoryStorage} from '../lib/metamatic';

let responses = [];
let value;

describe('metamatic framework', () => {

  beforeEach(() => {
    responses = [];
    reset();
    useMemoryStorage();
  });

  it('should handle dispatch functions that have matching event ID', () => {

    handle('TEST-EVENT-1', (value) => {
      value.should.equal('HELLO EARTH');
    });

    dispatch('TEST-EVENT-1', 'HELLO EARTH');

  });

  it('should register handler with unique ID', () => {

    connect('ID-0', 'TEST-EVENT-2', (value) => {
      value.should.equal('HELLO ROSS 128b');
    });

    dispatch('TEST-EVENT-2', 'HELLO ROSS 128b');

  });

  it('should remove handler upon unhandle call', () => {
    handle('EARTH-CALLING', (value) => {
      throw new Error('this should not happen after unhandle');
    })
    unhandle('EARTH-CALLING');
    dispatch('EARTH-CALLING', 'Sending out an SOS');
  });

  it('should execute all connect-listeners with matching event ID', () => {

    connect('PROXIMA-CENTAURI-B', 'EARTH-CALLING', (value) => {
      value = 'Proxima Centauri b received call: ' + value;
      responses.push(value);
    });

    connect('TRAPPIST-1-E', 'EARTH-CALLING', (value) => {
      value = 'Trappist 1 e received call: ' + value;
      responses.push(value);
    });

    dispatch('EARTH-CALLING', 'Sending out an SOS');

    responses.length.should.equal(2);
    responses[0].should.equal('Proxima Centauri b received call: Sending out an SOS');
    responses[1].should.equal('Trappist 1 e received call: Sending out an SOS');
  });

  it('should execute all handle-listeners with matching event ID', () => {

     handle('EARTH-CALLING', (value) => {
       value = 'Trappist 1 e received message: ' + value;
       responses.push(value);
     });

     handle('EARTH-CALLING', (value) => {
       value = 'Trappist 1 e replies to message: ' + value;
       responses.push(value);
     })

     dispatch('EARTH-CALLING', 'Sending out an SOS');
     responses.length.should.equal(2);
   });

  it('should handle strings',  () => {
    handle('STRING-EVENT', (value) => {
      value.should.equal('SOME STRING');
    })
    dispatch('STRING-EVENT', 'SOME STRING')
  });

  it('should handle integers', () => {
    handle('INTEGER-EVENT', (value) => {
      parseInt(value).should.equal(3);
    })
    dispatch('INTEGER-EVENT', 3);
  });

  it('should remove component handlers on disconnect', () => {
    let someComponent = {};
    connect(someComponent, 'SOME-EVENT', (value) => {
      value.should.equal('Sending out an SOS');
    });
    dispatch('SOME-EVENT', 'Sending out an SOS');

    //now let's modify the handler to cause an expection
    connect(someComponent, 'SOME-EVENT', (value) => {
      throw new Error('This error should not occur after disconnect');
    });
    disconnect(someComponent);
    dispatch('SOME-EVENT', 'Sending out an SOS');
  });

  it('setState function should set flat value inside embedded store', () => {
    const STATE_EMAIL_ADDRESS = 'STATE_EMAIL_ADDRESS';
    setState(STATE_EMAIL_ADDRESS, 'somebody@trappist');
    getStore()[STATE_EMAIL_ADDRESS].should.equal('somebody@trappist');
  })

  it('setState function should be able to store states with many values', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);
    getStore()[STATE_USER_INFO].emailAddress.should.equal('somebody@trappist');
    getStore()[STATE_USER_INFO].username.should.equal('somebody');
  });

  it('store function clones objects so modifying original state should not change the data inside the store', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);
    dataState.emailAddress = 'afterwards_changed@emailaddress';
    getStore()[STATE_USER_INFO].emailAddress.should.equal('somebody@trappist');
  });

  it('store function completely overrides the previous state in the container and thereby also existing values', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);

    let newStateWithoutUsername = {
      emailAddress: 'somebody@else'
    };

    setState(STATE_USER_INFO, newStateWithoutUsername);

    'somebody'.should.not.equal( getStore()[STATE_USER_INFO].username);
  });

  it('connect function retrospectively receives data state earlier set by store function', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);
    const listener = {};
    connect(listener, STATE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('handle function retrospectively receives data state earlier set by store function', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateState(STATE_USER_INFO, dataState);
    handle(STATE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });


  it('connect function retrospectively receives data state earlier set by update function', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateState(STATE_USER_INFO, dataState);
    const listener = {};
    connect(listener, STATE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('handle function retrospectively receives data state earlier set by update function', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    updateState(STATE_USER_INFO, dataState);
    handle(STATE_USER_INFO, (userInfo) => responses.push(userInfo));
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
  });

  it('update function does not erase old unaffected values inside existing state', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);

    let newState = {
      emailAddress: 'somebody@else'
    };

    const updatedState = updateState(STATE_USER_INFO, newState);

    handle(STATE_USER_INFO, (userInfo) => {
      responses.push(userInfo)
    });
    responses.length.should.equal(1);
    responses[0].username.should.equal('somebody');
    responses[0].emailAddress.should.equal('somebody@else');
  });

  it('obtain function without parameter returns a state previously stored in metamatic state container', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);

    const storedObject = getState(STATE_USER_INFO);
    dataState.username.should.equal(storedObject.username);

  });

  it('getState function returns a clone, not the original object', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);

    const storedObject = getState(STATE_USER_INFO);
    dataState.username = 'changedUsernameInOriginalDataState';
    dataState.username.should.not.equal(storedObject.username);

  });

  it('clearState function should override previously set state with an empty obkect', () => {
    const STATE_USER_INFO = 'STATE_USER_INFO';
    let dataState = {
      username: 'somebody',
      emailAddress: 'somebody@trappist'
    };
    setState(STATE_USER_INFO, dataState);
    clearState(STATE_USER_INFO);
    const storedObject = getState(STATE_USER_INFO);
    dataState.username = 'changedUsernameInOriginalDataState';
    dataState.username.should.not.equal(storedObject.username);

  });
});
