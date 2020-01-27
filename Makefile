

local-install:
	npm uninstall -g newman-reporter-influxdb
	npm pack
	npm install -g newman-reporter-influxdb-*.tgz

bump:
	npm version patch

publish:
	npm publish