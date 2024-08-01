const assert = require('assert');
const InfluxDBReporter = require('../src/influxdb-reporter');

describe('InfluxDBReporter', function() {
  let reporter;
  let newmanEmitter;
  let reporterOptions;
  let options;

  beforeEach(function() {
    newmanEmitter = {
      on: function(event, callback) {
        // Mock implementation of newmanEmitter.on
      }
    };
    reporterOptions = {
      influxdbServer: 'localhost',
      influxdbPort: 8086,
      influxdbName: 'test_db',
      influxdbMeasurement: 'test_measurement'
    };
    options = {
      collection: {
        name: 'Test Collection'
      }
    };
    reporter = new InfluxDBReporter(newmanEmitter, reporterOptions, options);
  });

  describe('start', function() {
    it('should initialize context and service', function() {
      reporter.start();
      assert.strictEqual(reporter.context.server, 'localhost');
      assert.strictEqual(reporter.context.port, 8086);
      assert.strictEqual(reporter.context.name, 'test_db');
      assert.strictEqual(reporter.context.measurement, 'test_measurement');
    });
  });

  describe('beforeItem', function() {
    it('should update currentItem and list', function() {
      reporter.beforeItem();
      assert.strictEqual(reporter.context.currentItem.index, 1);
      assert.strictEqual(reporter.context.list.length, 1);
    });
  });

  describe('request', function() {
    it('should update currentItem data', function() {
      const args = {
        cursor: {},
        item: { name: 'Test Item' },
        request: { url: { toString: () => 'http://example.com' }, method: 'GET' },
        response: { status: 'OK', code: 200, responseTime: 100, responseSize: 1000 }
      };
      reporter.request(null, args);
      assert.strictEqual(reporter.context.currentItem.data.request_name, 'Test Item');
      assert.strictEqual(reporter.context.currentItem.data.url, 'http://example.com');
      assert.strictEqual(reporter.context.currentItem.data.method, 'GET');
      assert.strictEqual(reporter.context.currentItem.data.status, 'OK');
      assert.strictEqual(reporter.context.currentItem.data.code, 200);
      assert.strictEqual(reporter.context.currentItem.data.response_time, 100);
      assert.strictEqual(reporter.context.currentItem.data.response_size, 1000);
    });
  });

  describe('assertion', function() {
    it('should update currentItem data for failed assertion', function() {
      const error = { test: 'Test Assertion', name: 'AssertionError', message: 'Test failed' };
      reporter.assertion(error);
      assert.strictEqual(reporter.context.currentItem.data.test_status, 'FAIL');
      assert.strictEqual(reporter.context.currentItem.data.failed.length, 1);
    });

    it('should update currentItem data for skipped assertion', function() {
      const args = { skipped: true, assertion: 'Test Assertion' };
      reporter.assertion(null, args);
      assert.strictEqual(reporter.context.currentItem.data.test_status, 'SKIP');
      assert.strictEqual(reporter.context.currentItem.data.skipped.length, 1);
    });
  });

  describe('item', function() {
    it('should send data to service', function() {
      reporter.service = {
        sendData: function(data) {
          assert.ok(data.includes('test_measurement'));
        }
      };
      reporter.item();
    });
  });

  describe('done', function() {
    it('should disconnect service', function() {
      reporter.service = {
        disconnect: function() {
          assert.ok(true);
        }
      };
      reporter.done();
    });
  });
});
