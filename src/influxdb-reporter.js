'use strict';

const querystring = require('querystring');

const HttpService = require('./http.service');
const UdpService = require('./udp.service');


class InfluxDBReporter {
  
  constructor(newmanEmitter, reporterOptions, options) {
    this.newmanEmitter = newmanEmitter;
    this.reporterOptions = reporterOptions;
    this.options = options;
    this.context = {
      id: `${new Date().getTime()}-${Math.random()}`,
      currentItem: { index: 0 },
      assertions: {
        total: 0,
        failed: [],
        skipped: []
      },
      list: [],
      debug: this.reporterOptions.debug
    };
    const events = 'start iteration beforeItem item script request test assertion console exception done'.split(' ');
    events.forEach((e) => { if (typeof this[e] == 'function') newmanEmitter.on(e, (err, args) => this[e](err, args)) });

    if (this.context.debug) {
      console.log('[+] Reporter Options', reporterOptions);
    }
  }

  start(error, args) {
    this.context.server = this.reporterOptions.influxdbServer || this.reporterOptions.server;
    this.context.port = this.reporterOptions.influxdbPort || this.reporterOptions.port;
    this.context.version = this.reporterOptions.influxdbVersion || this.reporterOptions.version || 1;
    this.context.org = this.reporterOptions.influxdbOrg || this.reporterOptions.org;
    this.context.name = this.reporterOptions.influxdbName || this.reporterOptions.name;
    this.context.measurement = this.reporterOptions.influxdbMeasurement || this.reporterOptions.measurement;
    this.context.username = this.reporterOptions.influxdbUsername || this.reporterOptions.username;
    this.context.password = this.reporterOptions.influxdbPassword || this.reporterOptions.password;
    this.context.mode = this.reporterOptions.influxdbMode || this.reporterOptions.mode;

    if (!this.context.server) {
      throw new Error('[-] ERROR: InfluxDB Server Address is missing! Add --reporter-influxdb-server <server-address>.');
    }
    if (!this.context.port) {
      throw new Error('[-] ERROR: InfluxDB Server Port is missing! Add --reporter-influxdb-port <port-number>.');
    }
    if(this.context.version == 2) {
      if (!this.context.org) {
        throw new Error('[-] ERROR: InfluxDB v2.x Org is missing! Add --reporter-influxdb-org <org-name>.');
      }
    }
    if (!this.context.name) {
      throw new Error('[-] ERROR: InfluxDB Database/Bucket Name is missing! Add --reporter-influxdb-name <database-name>.');
    }
    if (!this.context.measurement) {
      // this.context.measurement = `api_results_${new Date().getTime()}`;
      throw new Error('[-] ERROR: InfluxDB Measurement Name is missing! Add --reporter-influxdb-measurement <measurement-name>.');
    }
    if (!this.context.mode) {
      this.context.mode = 'http';
    }
    console.log(`[+] Starting collection: ${this.options.collection.name} ${this.context.id}`);

    const DataService = this.context.mode === 'udp' ? UdpService : HttpService;
    this.service = new DataService(this.context);
  }

  beforeItem(error, args) {
    // console.log('beforeItem');
    // console.log('beforeItem error', error);
    // console.log('beforeItem args', args);

    this.context.list.push(this.context.currentItem);

    this.context.currentItem = {
      index: (this.context.currentItem.index + 1),
      name: '',
      data: {}
    };
  }

  request(error, args) {
    const { cursor, item, request } = args;

    console.log(`[${this.context.currentItem.index}] Running ${item.name}`);

    const data = {
      collection_name: this.options.collection.name, 
      request_name: item.name,
      url: request.url.toString(),
      method: request.method,
      status: args.response.status,
      code: args.response.code,
      response_time: args.response.responseTime,
      response_size: args.response.responseSize,
      test_status: 'PASS',
      assertions: 0,
      failed_count: 0,
      skipped_count: 0,
      failed: [],
      skipped: []
    };

    this.context.currentItem.data = data;
    this.context.currentItem.name = item.name;
  }

  exception(error, args) {
    // TODO: 
  }

  assertion(error, args) {
    this.context.currentItem.data.assertions++;

    if(error) {
      this.context.currentItem.data.test_status = 'FAIL';

      var failMessage = `${error.test} | ${error.name}`;
      if (this.context.debug) {
        failMessage += `: ${error.message}`;
      }
      this.context.currentItem.data.failed.push(failMessage);
      this.context.currentItem.data.failed_count++;
      if (this.context.debug) {
        this.context.assertions.failed.push(failMessage);
      }
    } else if(args.skipped) {
      if(this.context.currentItem.data.test_status !== 'FAIL') {
        this.context.currentItem.data.test_status = 'SKIP';
      }

      const skipMessage = args.assertion;
      this.context.currentItem.data.skipped.push(args.assertion);
      this.context.currentItem.data.skipped_count++;
      if (this.context.debug) {
        this.context.assertions.skipped.push(skipMessage); 
      }
    }
  }

  item(error, args) {
    const binaryData = this.buildPayload(this.context.currentItem.data);
    this.service.sendData(binaryData);
  }

  done() {
    this.service.disconnect();
    console.log(`[+] Finished collection: ${this.options.collection.name} (${this.context.id})`);
  }

  /// Private method starts here

  buildPayload(data) {
    const measurementName = this.context.measurement;

    if(data.failed.length) {
      data.failed = data.failed.join(',');
    } else {
      delete data.failed;
    }

    if(data.skipped.length) {
      data.skipped = data.skipped.join(',');
    } else {
      delete data.skipped;
    }

    let binaryData = querystring.stringify(data, ',', '=', { encodeURIComponent: this._encodeURIComponent });
    binaryData = `${measurementName},${binaryData} value=${data.response_time}\n`;
    return binaryData;
  }

  _encodeURIComponent(str) {
    return str.replace(/ /g, '\\ ')
              .replace(/,/g, '\\,')
              .replace(/=/g, '\\=');
  }
};

module.exports = InfluxDBReporter;
