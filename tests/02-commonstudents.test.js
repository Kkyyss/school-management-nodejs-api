const axios = require('axios');
const {API_URL} = require('../config');
const {sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = API_URL;

describe('Common Students Module Test', function() {
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
      await axios.post('/register', {
        teacher: 'teacherjoe@example.com',
        students: ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'],
      });
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('Http 400 Bad Request: Provide undefined value in teacher field.', async function() {
        try {
          await axios.get('/commonstudents', {
            params: {
              teacher: undefined,
            },
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
              teacher: ['This field is required.'],
            });
        }
      });
      it('Http 400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          await axios.get('/commonstudents', {
            params: {
              teacher: ['invalidEmailAddress', 'validEmail@example.com'],
            },
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
      it('Http 400 Bad Request: Provide non-exist email in teacher field.', async function() {
        try {
          await axios.get('/commonstudents', {
            params: {
              teacher: ['nonExistEmail@example.com', 'teacherken@gmail.com'],
            },
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
            .to.equal('Please ensure the provided teacher email(s) are exist.');
        }
      });
    });
  });
  describe('Common Students Test', function() {
    it('Http 200 Ok: Return common students from specific teacher', async function() {
      try {
        const response = await axios.get('/commonstudents', {
          params: {
            teacher: 'teacherken@gmail.com',
          },
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(status).to.equal(200);
        expect(data).to.have.property('students').with.lengthOf(3);
      } catch (error) {
        console.error(error);
      }
    });
    it('Http 200 Ok: Return common students from two teachers', async function() {
      try {
        const response = await axios.get('/commonstudents', {
          params: {
            teacher: ['teacherken@gmail.com', 'teacherjoe@example.com'],
          },
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(status).to.equal(200);
        expect(data).to.have.property('students').with.lengthOf(2);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
