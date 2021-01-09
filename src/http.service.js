'use strict';

const querystring = require('querystring');
const axios = require('axios');


class HttpService {

  constructor(context) {
    this.context = context;
    const axiosOptions = {
      baseURL: `http://${this.context.server}:${this.context.port}`
    };

    if(this.context.version == 2) {
      // For InfluxDB version 2.x
      axiosOptions.auth = {
        username: this.context.username,
        password: this.context.password,
      }
    }

    this.client = axios.create(axiosOptions);

    if(this.context.version == 2) {
      this.signIn();
    }
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

  async signIn() {
    console.log('[+] Signing In to InfluxDB');
    try {
      const res = await this.client.post('/api/v2/signin');
      this.client.defaults.headers.common['cookie'] = res.headers['set-cookie'];
    } catch (error) {
      console.log('[-] ERROR: while signing in to InfluxDB', error);
    }
  }

  async signOut() {
    console.log('[+] Signing Out from InfluxDB');
    try {
      await this.client.post('/api/v2/signout');
    } catch (error) {
      console.log('[-] ERROR: while signing out to InfluxDB', error);
    }
  }

  async healthCheck() {
    let connectionUrl = this._buildInfluxDBUrl('ping');

    try {
      const data = await axios.get(connectionUrl);
    } catch (error) {
      console.log('[-] ERROR: not able to connect to InfluxDB', error);
    }
  }

  async sendData(data) {
    let url;

    if(this.context.version == 1) {
      const params = {
        db: this.context.name,
        u: this.context.username,
        p: this.context.password,
      };
      const paramsQuerystring = querystring.stringify(params);
      url = `/write?${paramsQuerystring}`;
    } else {
      // For InfluxDB version 2
      const params = {
        bucket: this.context.name,
        org: this.context.org,
      };
      const paramsQuerystring = querystring.stringify(params);
      url = `/api/v2/write?${paramsQuerystring}`;
    }

    try {
      await this.client.post(url, data);
    } catch (error) {
      console.log('[-] ERROR: while sending data to InfluxDB', error);
    }
  }

  disconnect() {
    if(this.context.version == 2) {
      this.signOut();
    }
  }

};

module.exports = HttpService;