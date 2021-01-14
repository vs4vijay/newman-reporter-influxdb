'use strict';

const dgram = require('dgram');


class UdpService {

  constructor(context) {
    this.context = context;
    this.socket = dgram.createSocket('udp4');
  }

  async sendData(data) {
    try {
      this.socket.send(data, this.context.port, this.context.address, (error, response) => {
        if(error) {
          console.log('udp error', error);
          throw error;
        }

        console.log('udp response', response);
      });
    } catch (error) {
      console.log('[-] ERROR: while sending data to InfluxDB', error ? this.context.debug : error.message);
    }
  }

  close() {
    this.socket.close();
  }
};

module.exports = UdpService;
