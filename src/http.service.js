'use strict';

const querystring = require('querystring');
const axios = require('axios');


class HttpService {

  constructor(context) {
    this.context = context;
  }

  _buildInfluxDBUrl(path='write') {
    const url = `http://${this.context.server}:${this.context.port}/${path}`;
    const params = {
      db: this.context.name,
      u: this.context.username,
      p: this.context.password,
    };

    const paramsQuerystring = querystring.stringify(params);

    const connectionUrl = `${url}?${paramsQuerystring}`;
    return connectionUrl;
  }

  async healthCheck() {
    let connectionUrl = this._buildInfluxDBUrl('ping');

    try {
      const data = await axios.get(connectionUrl);
    } catch (error) {
      console.log('[-] ERROR: not able to connect to influxdb', error);
    }
  }

  async sendData(data) {
    let connectionUrl = this._buildInfluxDBUrl();

    try {
      await axios.post(connectionUrl, data);
    } catch (error) {
      console.log('[-] ERROR: while sending data to influxdb', error);
    }
  }

  close() {
    
  }

};

module.exports = HttpService;