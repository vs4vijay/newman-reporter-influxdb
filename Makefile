PROJECT = "newman-reporter-influxdb"

.PHONY: local-install 

local-install:
	npm uninstall -g ${PROJECT}
	npm pack
	npm install -g ${PROJECT}-*.tgz

test:
	newman run https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv -r influxdb \
					--reporter-influxdb-server localhost \
					--reporter-influxdb-port 8086 \
					--reporter-influxdb-name vijay

test-udp:
	newman run https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv -r influxdb \
					--reporter-influxdb-server localhost \
					--reporter-influxdb-port 8086 \
					--reporter-influxdb-name vijay \
					--reporter-influxdb-mode udp

bump:
	npm version patch -m "Bumped to version %s"

publish:
	npm publish