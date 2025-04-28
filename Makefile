PROJECT=datepicker
NODE_BIN=./node_modules/.bin
SRC=index.js
CSS= \
	node_modules/@pirxpilot/tip/tip.css \
	node_modules/@pirxpilot/calendar/lib/calendar.css \
	build/aurora-calendar.css \
	node_modules/popup-picker/picker.css

all: check compile

check: lint

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.css: $(CSS) | node_modules build
	cat $^ > $@

build/build.js: $(SRC) | node_modules build
	$(NODE_BIN)/esbuild \
		--bundle \
		--define:DEBUG="true" \
		--global-name=$(PROJECT) \
		--outfile=$@ \
		index.js

$(CSS): | node_modules

node_modules: package.json
	yarn
	touch $@

lint: | node_modules
	$(NODE_BIN)/biome ci

format: | node_modules
	$(NODE_BIN)/biome check --fix

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

build/aurora-calendar.css:
	curl -o $@ \
		https://raw.githubusercontent.com/component/aurora-calendar/master/aurora-calendar.css

.PHONY: clean format lint check all compile
