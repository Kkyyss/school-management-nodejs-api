const express = require('express');
const router = express.Router();
const { Users } = require('../../db/models');
const { suspendRequestDTOSchema } = require('../../schema/suspend.shema');

const findStudent = async(student) => {
  return Users.findOne({
    attributes: ['id'],
    where: {
      email: student,
      role: 'student',
    },
    raw: true,
  });
};

const suspendStuent = async(studentId) => {
  return Users.update({
    status: 'suspend',
  }, {
    where: {
      id: studentId,
    },
  });
};

router.post('/suspend', async(req, res, next) => {
  try {
    const { student } = suspendRequestDTOSchema.parse(req.body);
    // Integrity checking
    const studentRawData = await findStudent(student);
    if (!studentRawData) {
      return res.status(400).json({ message: 'Please ensure the provided student email is exist.' });
    }
    // Suspend student
    await suspendStuent(studentRawData.id);

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
