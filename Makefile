install:
	npm ci

gendiff:
	node bin/gendiff.js __fixtures__/file1.json __fixtures__/file2.json

lint:
	npm run lint

test-jest:
	npm run test

test-coverage:
	npm test -- --coverage --coverageProvider=v8