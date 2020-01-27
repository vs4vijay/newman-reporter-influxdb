

local-install:
	npm uninstall -g newman-reporter-influxdb
	npm pack
	npm install -g newman-reporter-influxdb-*.tgz

publish:
	npm publish