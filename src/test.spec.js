import {assert, describe, it} from 'mocha';
import {connect, dispatch, handle, reset, getEventDictionary, getListenerDictionary} from '../lib/metamatic';

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

});
