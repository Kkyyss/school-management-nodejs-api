const axios = require('axios');
const {API_URL} = require('../config');
const {sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = API_URL;

describe('Register Module Test', function() {
  before(async function() {
    try {
      await sequelize.sync({force: true}); // drop and create User tables.
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('Http 400 Bad Request: Provide undefined value in teacher field.', async function() {
        try {
          await axios.post('/register', {
            teacher: undefined,
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              teacher: ['Teacher email is required.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide different data type in teacher field.', async function() {
        try {
          await axios.post('/register', {
            teacher: 101,
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              teacher: ['Teacher email must be a string.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          await axios.post('/register', {
            teacher: 'notAnEmailAddress',
            students: ['studentjon@example.com', 'studenthon@example.com'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              teacher: ['Teacher email is invalid.'],
            });
        }
      });
    });
    describe('Students Field Test', function() {
      it('Http 400 Bad Request: Provide undefined value in students field.', async function() {
        try {
          await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: undefined,
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              students: ['Student email is required.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide different data type in students field.', async function() {
        try {
          await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: 'studenthon@example.com',
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              students: ['This field must be an array.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide invalid email in students field.', async function() {
        try {
          await axios.post('/register', {
            teacher: 'teacherken@gmail.com',
            students: ['notAnEmailAddress'],
          });
        } catch (error) {
          expect(error).to.have.property('response');

          const {response} = error;
          expect(response).to.have.property('status');
          expect(response).to.have.property('data');

          const {status, data} = response;
          expect(status).to.equal(400);
          expect(data)
            .to.have.property('message')
            .deep.equal({
              students: ['Student email is invalid.'],
            });
        }
      });
    });
  });
  describe('Registration Test', function() {
    it('Http 204 No Content: Register and students if not exist, and students are registered by the teacher.', async function() {
      try {
        const response = await axios.post('/register', {
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@example.com', 'studenthon@example.com'],
        });
        expect(response).to.have.property('status');
        expect(response.status).to.equal(204);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
