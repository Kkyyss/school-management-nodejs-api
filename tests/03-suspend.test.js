const axios = require('axios');
const {API_URL} = require('../config');
const {sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = API_URL;

describe('Suspend Student Module Test', function() {
  before(async function() {
    try {
      await sequelize.sync({force: true}); // drop and create User tables.
      // create 2 teachers and with 2 common students
      await axios.post('/register', {
        teacher: 'teacherken@gmail.com',
        students: [
          'commonstudent1@gmail.com',
          'commonstudent2@gmail.com',
          'student_only_under_teacher_ken@gmail.com',
        ],
      });
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('Http 400 Bad Request: Provide undefined value in student field.', async function() {
        try {
          await axios.post('/suspend', {
            student: undefined,
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
              student: ['Student email is required.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide different data type in teacher field.', async function() {
        try {
          await axios.post('/suspend', {
            student: 101,
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
              student: ['Student email must be a string.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          await axios.post('/suspend', {
            student: 'invalidEmailAddress',
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
              student: ['Student email is invalid.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide non-exist email in teacher field.', async function() {
        try {
          await axios.post('/suspend', {
            student: 'nonExistEmail@example.com',
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
            .to.equal('Please ensure the provided student email is exist.');
        }
      });
    });
  });
  describe('Suspend Student Test', function() {
    it('Http 204 No Content: Return common students from specific teacher', async function() {
      try {
        const response = await axios.post('/suspend', {
          student: 'commonstudent1@gmail.com',
        });
        expect(response).to.have.property('status');
        expect(response.status).to.equal(204);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
