const axios = require('axios');
const {API_URL} = require('../config');
const {sequelize} = require('../db/models');
const {expect} = require('chai');

axios.defaults.baseURL = API_URL;

describe('Retrieve For Notification Module Test', function() {
  before(async function() {
    try {
      await sequelize.sync({force: true}); // drop and create User tables.
      // create 2 teachers and with 2 common students
      await axios.post('/register', {
        teacher: 'teacherken@gmail.com',
        students: [
          'non_tagged_student@gmail.com',
          'non_tagged_suspended_student@gmail.com',
          'tagged_student1@gmail.com',
        ],
      });
      await axios.post('/register', {
        teacher: 'teacherjoe@example.com',
        students: [
          'tagged_student2@gmail.com',
          'tagged_suspended_student2@gmail.com',
        ],
      });
      await axios.post('/suspend', {
        student: 'non_tagged_suspended_student@gmail.com',
      });
      await axios.post('/suspend', {
        student: 'tagged_suspended_student2@gmail.com',
      });
    } catch (error) {
      console.error(error);
    }
  });
  describe('Request Body Test', function() {
    describe('Teacher Field Test', function() {
      it('400 Bad Request: Provide undefined value in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: undefined,
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide different data type in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 101,
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide invalid email in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'invalidEmailAddress',
            notification: 'Hello everyone!',
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
      it('400 Bad Request: Provide non-exist email in teacher field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'nonExistEmailAddress@example.com',
            notification: 'Hello everyone!',
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
            .to.equal('Please ensure the provided teacher email is exist.');
        }
      });
    });
    describe('Notification Field Test', function() {
      it('400 Bad Request: Provide undefined value in notification field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'teacherken@gmail.com',
            notification: undefined,
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
              notification: ['Notification is required.'],
            });
        }
      });
      it('400 Bad Request: Provide different data type in notification field.', async function() {
        try {
          await axios.post('/retrievefornotifications', {
            teacher: 'teacherken@gmail.com',
            notification: 101,
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
              notification: ['Notification must be a string.'],
            });
        }
      });
    });
  });
  describe('Retrieve For Notfication Test', function() {
    it('200 Ok: Return students that are registered by the teacher, except suspended student.', async function() {
      try {
        const response = await axios.post('/retrievefornotifications', {
          teacher: 'teacherken@gmail.com',
          notification: 'Hello world!',
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(status).to.equal(200);
        expect(data).to.have.property('recipients').with.lengthOf(2);
      } catch (error) {
        console.error(error);
      }
    });
    it('200 Ok: Return students that are tagged with "@" and registered by the teacher, except suspended student.', async function() {
      try {
        const response = await axios.post('/retrievefornotifications', {
          teacher: 'teacherken@gmail.com',
          notification:
            'Hello students! @tagged_student1@gmail.com @tagged_student2@gmail.com @tagged_suspended_student2@gmail.com',
        });
        expect(response).to.have.property('status');
        expect(response).to.have.property('data');

        const {status, data} = response;
        expect(status).to.equal(200);
        expect(data).to.have.property('recipients').with.lengthOf(3);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
