'use strict';

var _mocha = require('mocha');

var _libMetamatic = require('../lib/metamatic');

var responses = [];
var value = undefined;

(0, _mocha.describe)('metamatic framework', function () {

  beforeEach(function () {
    responses = [];
    (0, _libMetamatic.reset)();
  });

  (0, _mocha.it)('should handle dispatch functions that have matching event ID', function () {

    (0, _libMetamatic.handle)('TEST-EVENT-1', function (value) {
      value.should.equal('HELLO EARTH');
    });

    (0, _libMetamatic.dispatch)('TEST-EVENT-1', 'HELLO EARTH');
  });

  (0, _mocha.it)('should register handler with unique ID', function () {

    (0, _libMetamatic.connect)('ID-0', 'TEST-EVENT-2', function (value) {
      value.should.equal('HELLO ROSS 128b');
    });

    (0, _libMetamatic.dispatch)('TEST-EVENT-2', 'HELLO ROSS 128b');
  });

  (0, _mocha.it)('should execute all connect-listeners with matching event ID', function () {

    (0, _libMetamatic.connect)('PROXIMA-CENTAURI-B', 'EARTH-CALLING', function (value) {
      value = 'Proxima Centauri b received call: ' + value;
      responses.push(value);
    });

    (0, _libMetamatic.connect)('TRAPPIST-1-E', 'EARTH-CALLING', function (value) {
      value = 'Trappist 1 e received call: ' + value;
      responses.push(value);
    });

    (0, _libMetamatic.dispatch)('EARTH-CALLING', 'Sending out an SOS');

    responses.length.should.equal(2);
    responses[0].should.equal('Proxima Centauri b received call: Sending out an SOS');
    responses[1].should.equal('Trappist 1 e received call: Sending out an SOS');
  });

  (0, _mocha.it)('should execute all handle-listeners with matching event ID', function () {

    (0, _libMetamatic.handle)('EARTH-CALLING', function (value) {
      value = 'Trappist 1 e received message: ' + value;
      responses.push(value);
    });

    (0, _libMetamatic.handle)('EARTH-CALLING', function (value) {
      value = 'Trappist 1 e replies to message: ' + value;
      responses.push(value);
    });

    (0, _libMetamatic.dispatch)('EARTH-CALLING', 'Sending out an SOS');
    responses.length.should.equal(2);
  });
});
//# sourceMappingURL=test.spec.js.map
