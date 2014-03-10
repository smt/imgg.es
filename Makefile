REPORTER = spec

test-bdd: 
	@./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui bdd \
		test/*.js

test: test-bdd

.PHONY: test
