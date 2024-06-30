const express = require('express');
const router = express.Router();
const {
  Users,
  StudentTeachers,
  Sequelize,
} = require('../../db/models');
const {
  retrieveForNotificationsRequestDTOSchema,
} = require('../../schema/retrievefornotifications.schema');

const findTeacher = async(teacher) => {
  return Users.findOne({
    where: {
      email: teacher,
      role: 'teacher',
    },
    raw: true,
  });
};

const findNonSuspendStudents = async(studentEmails) => {
  return Users.findAll({
    where: {
      email: studentEmails,
      role: 'student',
      status: {
        [Sequelize.Op.ne]: 'suspend',
      },
    },
    raw: true,
  });
};

const findTeacherNonSuspendStudents = async(teacherId) => {
  return StudentTeachers.findAll({
    attributes: [],
    where: {
      teacherId,
    },
    include: [
      {
        model: Users,
        as: 'students',
        required: true,
        where: {
          status: {
            [Sequelize.Op.ne]: 'suspend',
          },
        },
        raw: true,
      },
    ],
  });
};

router.post('/retrievefornotifications', async(req, res, next) => {
  try {
    const { teacher, notification: studentEmails } = retrieveForNotificationsRequestDTOSchema.parse(req.body);
    // Integrity checking: teacher
    const teacherRawData = await findTeacher(teacher);
    if (!teacherRawData) {
      return res.status(400).json({ message: 'Please ensure the provided teacher email is exist.' });
    }
    const studentsData = await findNonSuspendStudents(studentEmails);
    const notificationStudentEmails = studentsData.map(student => student.email);
    const teacherStudentsData = await findTeacherNonSuspendStudents(teacherRawData.id);
    const teacherStudentEmails = teacherStudentsData.map(teacher => teacher.students.email);

    const receivedStudentSet = new Set([...notificationStudentEmails, ...teacherStudentEmails]);

    return res
      .status(200)
      .json({
        recipients: Array.from(receivedStudentSet),
      });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
