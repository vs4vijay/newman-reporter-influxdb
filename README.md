# newman-reporter-influxdb

## Running

Specify `-r influxdb` option while running the collection

```bash
newman run <collection-url> -r influxdb \
  --reporter-influxdb-server <server-ip> \
  --reporter-influxdb-port <server-port> \
  --reporter-influxdb-name <database-name> \
  --reporter-influxdb-measurement <measurement-name>
```

Example:

```
newman run https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv -r influxdb \
--reporter-influxdb-server localhost \
--reporter-influxdb-port 8086 \
--reporter-influxdb-name newman_reports \
--reporter-influxdb-measurement api_results
```

Arguments:

**Argument** | **Remarks**
--- | --- 
--reporter-influxdb-server | IP Address or Host of InfluxDB
--reporter-influxdb-port | Port no. (Usually `8086`)
--reporter-influxdb-name | Database name
--reporter-influxdb-measurement | Measurement Point name (If not provided, then reporter will create measurement with prefix `newman_results-<timestamp>`)
--reporter-influxdb-username (*Optional*) | Username created for InfluxDB (e.g. `newman_user`)
--reporter-influxdb-password (*Optional*) | Password of the user (e.g. `p@ssw0rd`)

---

## To Do

- [x] Convert to ES6 based version
- [ ] Folder Structure
- [x] Username and Password support
- [ ] Include UDP Reporter as well
- [ ] Add batch operation
- [ ] ESLint
- [ ] CI/CD with Github Actions
- [ ] HealthCheck to InfluxDB

---

### Development Notes

```

npm publish --access public

```