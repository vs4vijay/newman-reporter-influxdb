# newman-reporter-influxdb

InfluxDB reporter for [Newman](https://github.com/postmanlabs/newman) that sends the test results information to InfluxDB which can be used from Grafana to build dashboard.

<a href="https://www.npmjs.com/package/newman-reporter-influxdb">
  <img alt="npm version" src="https://img.shields.io/npm/v/newman-reporter-influxdb.svg">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/newman-reporter-influxdb.svg">
  <img alt="code license" src="https://img.shields.io/github/license/vs4vijay/newman-reporter-influxdb">
  <img alt="npm publish" src="https://github.com/vs4vijay/newman-reporter-influxdb/workflows/npm publish/badge.svg">
</a>

## Getting Started

1. Install `newman`
2. Install `newman-reporter-influxdb`
3. Install InfluxDB (Get the server address, port, database name, etc)

### Prerequisites

1. `node` and `npm`
2. `newman` - `npm install -g newman`
3. [InfluxDB](https://github.com/influxdata/influxdb)

---

## Installation

```console
npm install -g newman-reporter-influxdb
```

> Installation should be done globally if newman is installed globally, otherwise install without `-g` option

---

## Usage

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

#### Options:

**Option** | **Remarks**
--- | --- 
`--reporter-influxdb-server` | IP Address or Host of InfluxDB
`--reporter-influxdb-port` | Port no. (Usually `8086`)
`--reporter-influxdb-name` | Database name
`--reporter-influxdb-measurement` | Measurement Point name (If not provided, then reporter will create measurement with prefix `newman_results-<timestamp>`)
`--reporter-influxdb-username` (*Optional*) | Username created for InfluxDB (e.g. `newman_user`)
`--reporter-influxdb-password` (*Optional*) | Password of the user (e.g. `p@ssw0rd`)
`--reporter-influxdb-mode` | Transmission Mode `http`, `udp` (default: `http`)

---

## Compatibility

**newman-reporter-influxdb** | **InfluxDB**
--- | ---
v1.0.0+ | v1.7

#### Notes:
- This reporter currently uses InfluxDB HTTP APIs to send data

---

## To Do

- [x] Convert to ES6 based version
- [x] Folder Structure
- [x] Username and Password support
- [x] Include UDP Reporter as well
- [ ] Add batch operation
- [ ] ESLint / StandardJS
- [x] CI/CD with Github Actions
- [ ] HealthCheck to InfluxDB

---

## Development

- `npm pack`
- `npm i -g newman-reporter-<name>.<version>.tgz`

---

### Development Notes

```

npm publish --access public

- name: npm publish
        run: |
          LATEST=`npm view . version`
          CURRENT=`cat package.json | jq -r .version`
          if [ "$LATEST" != "$CURRENT" ]
          then
            npm ci
            npm publish
          fi

{
    "scripts": {
        "postpublish" : "PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && git tag $PACKAGE_VERSION && git push --tags"
    }
}

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo $PACKAGE_VERSION

https://img.shields.io/npm/v/newman-reporter-influxdb.svg

<a href="https://www.npmjs.com/package/newman-reporter-influxdb"><img src="https://img.shields.io/npm/v/newman-reporter-influxdb.svg" alt="npm version"></a>
<a href="https://www.npmjs.com/package/newman-reporter-influxdb"><img src="https://img.shields.io/npm/dm/newman-reporter-influxdb.svg" alt="npm downloads"></a>

<img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/vs4vijay/newman-reporter-influxdb/total">



https://github.com/influxdata/influxdb/blob/1.7/services/udp/README.md
https://docs.influxdata.com/influxdb/v1.7/supported_protocols/udp/


[udp]
  enabled = true
  bind-address = ":8086"
  database = "newman_reports_udp"
  batch-size = 1000
  batch-timeout = “1s”


To write, just send newline separated line protocol over UDP.  Can send one point at a time (not very performant) or send batches.

$ echo "newman_results value=1" > /dev/udp/localhost/8086
$ echo "select * from newman_results" | influx -database newman_reports_udp
Connected to http://localhost:8086 version 1.7
InfluxDB shell 0.9
name: newman_results
---------
time                value
2020-26-06T11:25:15.321527811Z    1

```