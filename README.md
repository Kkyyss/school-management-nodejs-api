# Shool-Management-API

## Hosted APIs (Heroku)
**Base URL:** [https://dev-school-management-api-9a99865009bf.herokuapp.com/api](https://dev-school-management-api-9a99865009bf.herokuapp.com/api)

## API URL Design
`{base_url}/api/{service}`

## Local Setup
1. download repository, either use ssh `git clone git@github.com:Kkyyss/school-management-nodejs-api` or
use https `git clone https://github.com/Kkyyss/school-management-nodejs-api`

2. **In the project root directory:**
    1. run command `npm install` to install app dependencies.
    2. (optional) modify `.env` file for the database connection, default is dev env.
    3. run command `make database-reset` to setup database tables
    4. start the app locally with command `npm run start:local`
    5. The local API server will be available at [http://localhost:5001](http://localhost:5001).

## Unit Test (Mocha)
**Notes**: For local environment testing, please ensure that the app is already running locally.

**Run all test cases from the project root directory:**
1. to test dev env: `make test-dev`
2. to test local env: `make test-local`

**Run test through specific file:**
1. to test dev env on specific test file `make path=./tests/{filename.test.js}`
2. to teat local env on specific test fiel `make path=./tests/{filename.test.js}`

## Others
* to reset database, run command `make database-reset`
