const express = require('express');
const router = express.Router();
const {
  Users,
  Sequelize,
  StudentTeachers,
} = require('../../db/models');
const {
  commonStudentsRequestDTOSchema,
} = require('../../schema/commonstudents.schema');

const findTeachers = async(teacherList) => {
  return Users.findAll({
    attributes: ['id'],
    where: {
      email: teacherList,
    },
    raw: true,
  });
};

const findCommonStudents = async(teacherIds) => {
  return StudentTeachers.findAll({
    attributes: [Sequelize.fn('COUNT', Sequelize.col('teacherId'))],
    where: {
      teacherId: {
        [Sequelize.Op.in]: teacherIds,
      },
    },
    include: [
      {
        model: Users,
        as: 'students',
        attributes: ['email'],
        required: true,
        raw: true,
      },
    ],
    group: 'students.id',
    having: Sequelize.where(
      Sequelize.fn(
        'COUNT',
        Sequelize.col('teacherId')), '>=', teacherIds.length),
  });
};


router.get('/commonstudents', async(req, res, next) => {
  try {
    const { teacher: teacherList } = commonStudentsRequestDTOSchema.parse(req.query); // extract data from query.
    // Retrieve the teahcer ids.
    const teacherIds = await findTeachers(teacherList);
    // Integrity checking
    if (teacherIds.length !== teacherList.length) {
      return res
        .status(400)
        .json({
          message: 'Please ensure the provided teacher email(s) are exist.' });
    }

    const restructTeacherIds = teacherIds.map(teacher => teacher.id);
    const commonStudents = await findCommonStudents(restructTeacherIds);

    return res.status(200).json({
      students: commonStudents.map(student => student.students.email),
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
