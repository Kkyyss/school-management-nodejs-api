database-reset:
	npx sequelize-cli db:migrate:undo:all
	npx sequelize-cli db:migrate

database-clean:
	npx sequelize-cli db:seed:undo:all

database-seed:
	npx sequelize-cli db:seed:all

test-local:
	npm run test:local

test-dev:
	npm run test:dev

test-local-file:
	./node_modules/.bin/env-cmd -e test,local npx mocha --no-timeouts $(path)
