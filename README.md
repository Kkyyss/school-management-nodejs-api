# Shool-Management-API

## Hosted APIs (Heroku)
**Base URL:** [https://dev-school-management-api-9a99865009bf.herokuapp.com/api](https://dev-school-management-api-9a99865009bf.herokuapp.com/api)

## API URL Design
`{base_url}/api/{service}`

## Local Setup
**Base URL:** [http://localhost:5001](http://localhost:5001)
1. use ssh `git clone git@github.com:Kkyyss/school-admin-api.git` or
use https `git clone https://github.com/Kkyyss/school-admin-api.git`
2. `npm install`
3. `npm start` (development mode by default)

## Test (Mocha)
**Run all test cases:**
1. `make test-dev` ---- hosted APIs
2. `make test-local` ---- local APIs

**Run test through specific file:**
1. `make path=./tests/{filename.test.js} test-dev-file` ---- hosted APIs
2. `make path=./tests/{filename.test.js} test-local-file` ---- local APIs

## Others
* `make database-reset` ---- database migration
