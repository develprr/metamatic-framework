import {assert, describe, it} from 'mocha';
import {dispatch, handle} from '../lib/metamatic';

describe('dispatch function', () => {
  it('should be caught with matching handler', () => {

    handle('TEST-EVENT', (value) => {
      value.should.equal('HELLO WORLD');
    });

    dispatch('TEST-EVENT', 'HELLO WORLD');

  });
});
