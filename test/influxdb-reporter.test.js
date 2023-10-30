const InfluxDBReporter = require("../src/influxdb-reporter");
const HttpService = require("../src/http.service");
const UdpService = require("../src/udp.service");

jest.mock("../src/http.service");
jest.mock("../src/udp.service");

describe("InfluxDBReporter", () => {
  let reporter;

  beforeEach(() => {
    reporter = new InfluxDBReporter();
  });

  describe("start", () => {
    it("sets up the context correctly", () => {
      const config = { /* some configuration */ };
      reporter.start(config);
      expect(reporter.context).toEqual(config);
    });

    it("throws an error when required parameters are missing", () => {
      const config = { /* missing required parameters */ };
      expect(() => reporter.start(config)).toThrow();
    });
  });

  describe("beforeItem", () => {
    it("updates the context correctly", () => {
      const item = { /* some item */ };
      reporter.beforeItem(null, { item });
      expect(reporter.context.currentItem).toBe(item);
    });
  });

  describe("request", () => {
    it("updates the current item's data correctly", () => {
      const args = { /* some args */ };
      reporter.request(null, args);
      expect(reporter.context.currentItem.data).toEqual(args);
    });
  });

  describe("exception", () => {
    it("does not throw any errors when called", () => {
      expect(() => reporter.exception()).not.toThrow();
    });
  });

  describe("assertion", () => {
    it("updates the assertion count correctly", () => {
      reporter.assertion(null, {});
      expect(reporter.context.currentItem.data.assertions).toBe(1);
    });

    it("handles failed and skipped assertions correctly", () => {
      const error = { /* some error */ };
      reporter.assertion(error, { skipped: false });
      expect(reporter.context.currentItem.data.failed_count).toBe(1);
      expect(reporter.context.currentItem.data.skipped_count).toBe(0);

      reporter.assertion(null, { skipped: true });
      expect(reporter.context.currentItem.data.failed_count).toBe(1);
      expect(reporter.context.currentItem.data.skipped_count).toBe(1);
    });
  });

  describe("item", () => {
    it("sends data to the service correctly", () => {
      const sendData = jest.spyOn(reporter.service, "sendData");
      reporter.item();
      expect(sendData).toHaveBeenCalled();
    });
  });

  describe("done", () => {
    it("disconnects the service correctly", () => {
      const disconnect = jest.spyOn(reporter.service, "disconnect");
      reporter.done();
      expect(disconnect).toHaveBeenCalled();
    });
  });
});

  beforeEach(() => {
    reporter = new InfluxDBReporter();
  });

  describe("start", () => {
    it("sets up the context correctly", () => {
      const config = {
        /* some configuration */
      };
      reporter.start(config);
      expect(reporter.context).toEqual(config);
    });

    it("throws an error when required parameters are missing", () => {
      const config = {
        /* missing required parameters */
      };
      expect(() => reporter.start(config)).toThrow();
    });
  });

  describe("beforeItem", () => {
    it("updates the context correctly", () => {
      const item = {
        /* some item */
      };
      reporter.beforeItem(null, { item });
      expect(reporter.context.currentItem).toBe(item);
    });
  });

  describe("request", () => {
    it("updates the current item's data correctly", () => {
      const args = {
        /* some args */
      };
      reporter.request(null, args);
      expect(reporter.context.currentItem.data).toEqual(args);
    });
  });

  describe("exception", () => {
    it("does not throw any errors when called", () => {
      expect(() => reporter.exception()).not.toThrow();
    });
  });

  describe("assertion", () => {
    it("updates the assertion count correctly", () => {
      reporter.assertion(null, {});
      expect(reporter.context.currentItem.data.assertions).toBe(1);
    });

    it("handles failed and skipped assertions correctly", () => {
      const error = {
        /* some error */
      };
      reporter.assertion(error, { skipped: false });
      expect(reporter.context.currentItem.data.failed_count).toBe(1);
      expect(reporter.context.currentItem.data.skipped_count).toBe(0);

      reporter.assertion(null, { skipped: true });
      expect(reporter.context.currentItem.data.failed_count).toBe(1);
      expect(reporter.context.currentItem.data.skipped_count).toBe(1);
    });
  });

  describe("item", () => {
    it("sends data to the service correctly", () => {
      const sendData = jest.spyOn(reporter.service, "sendData");
      reporter.item();
      expect(sendData).toHaveBeenCalled();
    });
  });

  describe("done", () => {
    it("disconnects the service correctly", () => {
      const disconnect = jest.spyOn(reporter.service, "disconnect");
      reporter.done();
      expect(disconnect).toHaveBeenCalled();
    });
  });
});
