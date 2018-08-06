import {assert, describe, it} from 'mocha';
import {connect, dispatch, handle} from '../lib/metamatic';

describe('dispatch function', () => {
  it('should be caught with matching handler', () => {

    handle('TEST-EVENT-1', (value) => {
      value.should.equal('HELLO EARTH');
    });

    dispatch('TEST-EVENT-1', 'HELLO EARTH');

  });
});

describe('connect function', () => {
  it('should register handler with unique ID', () => {

    connect('ID-0', 'TEST-EVENT-2', (value) => {
      value.should.equal('HELLO ROSS 128b');
    });

    dispatch('TEST-EVENT-2', 'HELLO ROSS 128b');

  });
})

describe('connect function', () => {
  it('should handle one event in many places according to their ID', () => {

    const responses = [];
    let value;

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
})