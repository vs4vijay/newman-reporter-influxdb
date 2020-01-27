'use strict';

const querystring = require('querystring');
const axios = require('axios');


class InfluxDBReporter {
  
  constructor(newmanEmitter, reporterOptions, options) {
    this.newmanEmitter = newmanEmitter;
    this.reporterOptions = reporterOptions;
    this.options = options;
    this.id = `${new Date().getTime()}-${Math.random()}`;
    this.current = { index: 0 };
    const events = 'start iteration item script request test assertion console exception done'.split(' ');
    events.forEach((e) => { if (typeof this[e] == 'function') newmanEmitter.on(e, (err, args) => this[e](err, args)) });

    console.log('reporterOptions', reporterOptions);
  }

  start(error, args) {
    if (!this.reporterOptions.influxdbServer) {
      throw new Error('[-] ERROR: Destination address is missing! Add --reporter-influxdb-server <server-address>.');
    }
    if (!this.reporterOptions.influxdbPort) {
      throw new Error('[-] ERROR: Port is missing! Add --reporter-influxdb-port <port-number>.');
    }
    if (!this.reporterOptions.influxdbName) {
      throw new Error('[-] ERROR: Database Name is missing! Add --reporter-influxdb-name <database-name>.');
    }
    if (!this.reporterOptions.influxdbMeasurement) {
      this.reporterOptions.influxdbMeasurement = `api_results-${new Date().getTime()}`;
    }
    // this.stream = new SimpleUdpStream({
    //   destination: this.reporterOptions.influxdbServer,
    //   port: this.reporterOptions.influxdbPort
    // });
    console.log(`Starting: ${this.id}`);
  }

  beforeItem(error, args) {
    this.current = {
      index: (this.current.index + 1),
      name: '',
      data: {},
      failedAssertions: []
    };
  }

  request(error, args) {
    const { cursor, item, request } = args;

    console.log(`[+] Running ${item.name}`);

    const data = {
      collection_name: this.options.collection.name, 
      request_name: item.name,
      url: request.url.toString(),
      method: request.method,
      status: args.response.status,
      code: args.response.code,
      response_time: args.response.responseTime,
      response_size: args.response.responseSize,
      // executed: 'EXECUTED',
      // failed: 'FAILED',
      // skipped: 'SKIPPED'
    };

    this.current.data = data;
    this.current.name = item.name;
  }

  assertion(error, args) {
    const { assertion } = args
    // const result = error ? 'failed' : e.skipped ? 'skipped' : 'executed'

    if(error) {
      this.current.data.failed = `FAILED: ${JSON.stringify(error)}`;
      this.current.failedAssertions.push(assertion);
    } else if(error && error.skipped) {
      this.current.data.skipped = 'FAILED';
    } else {
      this.current.data.executed = 'EXECUTED';
    }
  }

  item(error, args) {
    console.log(`[${this.current.index}] Processing ${this.current.name}`);

    const binaryData = this.buildPayload(this.current.data);
    // console.log('binaryData', binaryData);

    this.sendDataHTTP(binaryData);
  }

  done() {
    console.log(`[+] Finished collection: ${this.options.collection.name} (${this.id}))`);

    // this.stream.write(payload);
    // this.stream.done();

    // this.exports.push({
    //   name: 'newman-reporter-influxdb',
    //   options: reporterOptions
    // });
  }

  /// Private method starts here
  buildInfluxDBUrl(path='write') {
    const url = `http://${this.reporterOptions.influxdbServer}:${this.reporterOptions.influxdbPort}/${path}`;
    const params = {
      db: this.reporterOptions.influxdbName,
      u: this.reporterOptions.influxdbUsername,
      p: this.reporterOptions.influxdbPassword,
    }

    const paramsQuerystring = querystring.stringify(params);

    const connectionUrl = `${url}?${paramsQuerystring}`;
    return connectionUrl;
  }

  async healthCheck() {
    let connectionUrl = this.buildInfluxDBUrl('ping');

    try {
      const data = await axios.get(connectionUrl);
    } catch (error) {
      console.log('[-] ERROR: not able to connect to influxdb', error);
    }
  }

  buildPayload(data) {
    const measurementName = this.reporterOptions.influxdbMeasurement;
    let binaryData = querystring.stringify(data, ',', '=', { encodeURIComponent: str => str.replace(/ /g, '_') });
    binaryData = `${measurementName},${binaryData} value=${data.responseTime}`;
    return binaryData;
  }

  async sendDataHTTP(data) {
    let connectionUrl = this.buildInfluxDBUrl();

    // connectionUrl = 'http://192.168.100.40:8086/write?db=code';
    // connectionUrl = 'http://localhost:8086/write?db=code';
    // connectionUrl = 'http://vijay.requestcatcher.com/';

    try {
      await axios.post(connectionUrl, data);
    } catch (error) {
      console.log('[-] ERROR: while sending data to influxdb', error);
    }
  }
};

module.exports = InfluxDBReporter;