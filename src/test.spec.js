import {assert, describe, it} from 'mocha';
import {connect, disconnect, dispatch, handle, unhandle, reset, updateState, observe} from '../lib/metamatic';

let responses = [];
let value;

describe('metamatic framework', () => {

  beforeEach(() => {
    responses = [];
    reset();
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

  it('updateState should create nested property structure inside state container', () => {
    const MetaStore = {};
    updateState(MetaStore, 'MetaStore:user.addressInfo.emailAddress', 'somebody@trappist');
    MetaStore.user.addressInfo.emailAddress.should.equal('somebody@trappist');
  })

  it('updateState should dispatch event', () => {
    const MetaStore = {};
    const STATE_METASTORE_EMAIL_ADDRESS = 'MetaStore:user.addressInfo.emailAddress';
    let events = [];
    handle(STATE_METASTORE_EMAIL_ADDRESS, (address) => events.push((address)));
    updateState(MetaStore, STATE_METASTORE_EMAIL_ADDRESS, 'somebody@trappist');
    events.length.should.equal(1);
  })



  it('observe: should dispatch states event to listener already at connect', () => {
    const STATE_METASTORE_EMAIL_ADDRESS = 'MetaStore:user.addressInfo.emailAddress';
    const MetaStore = {
      user: {
        addressInfo: {
          emailAddress: 'somebody@trappist'
        }
      }
    };
    let events = [];
    let listener = {};

    observe(MetaStore, STATE_METASTORE_EMAIL_ADDRESS);

    connect(listener, STATE_METASTORE_EMAIL_ADDRESS, (address) => {
      events.push(address)
    });
    events.length.should.equal(1);

  })

  it('updateState should dispatch states event to listener already at connect', () => {
    const STATE_METASTORE_EMAIL_ADDRESS = 'MetaStore:user.addressInfo.emailAddress';
    const MetaStore = {};
    let events = [];
    let listener = {};
    updateState(MetaStore, STATE_METASTORE_EMAIL_ADDRESS, 'somebody@trappist');
    connect(listener, STATE_METASTORE_EMAIL_ADDRESS, (address) => {
      events.push(address)
    });
    events.length.should.equal(1);

  })

});
