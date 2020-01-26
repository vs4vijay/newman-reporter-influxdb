# newman-reporter-influxdb

---

## Running

```bash
`newman run <collection-url> -r csv --reporter-influxdb-server <server-ip> --reporter-influxdb-port <server-port> --reporter-influxdb-name <database-name> --reporter-influxdb-measurement <measurement-name>`
```

Example:

`newman run https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv -r csv --reporter-influxdb-server localhost --reporter-influxdb-port 8086 --reporter-influxdb-name api_results`

Optional Arguments:

**Argument** | **Remarks**
--- | --- 
--reporter-influxdb-username | newman_user
--reporter-influxdb-password | p@ssw0rd

---

### Development Notes

- [x] Convert to ES6 based version
- [ ] Folder Structure
- [x] Username and Password support
- [ ] Include UDP Reporter as well
- [ ] Add batch operation
- [ ] ESLint
- [ ] CI/CD with Github Actions
- [ ] HealthCheck to InfluxDB