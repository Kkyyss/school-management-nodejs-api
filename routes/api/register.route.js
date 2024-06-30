const express = require('express');
const router = express.Router();
const {
  Users,
  StudentTeachers,
} = require('../../db/models');
const { registerRequestDTOSchema } = require('../../schema/register.schema');

const findOrCreateTeacher = async(teacher) => {
  const [teacherRawData] = await Users
    .findOrCreate(
      {
        where: {
          email: teacher,
        },
        defaults: {
          role: 'teacher',
        },
      },
    );
  return teacherRawData;
};

const findStudents = async(students) => {
  return Users.findAll({
    where: {
      email: students,
      role: 'student',
    },
    raw: true,
  });
};

const findTeacherStudents = async(teacherId, studentIds) => {
  return StudentTeachers.findAll({
    where: {
      teacherId,
      studentId: studentIds,
    },
    raw: true,
  });
};

router.post('/register', async(req, res, next) => {
  try {
    const { teacher, students } = registerRequestDTOSchema.parse(req.body);

    const teacherData = await findOrCreateTeacher(teacher);

    const studentsToRegister = students.map(student => ({ email: student, role: 'student' }));
    await Users.bulkCreate(studentsToRegister, { ignoreDuplicates: true, raw: true, validate: true });

    const studentRecords = await findStudents(students);
    const studentIds = studentRecords.map(student => student.id);
    const teacherStudentRecords = await findTeacherStudents(
      teacherData.id,
      studentIds,
    );

    // filter out students that already registered to the teacher.
    const registeredStudents = teacherStudentRecords.map(student => student.studentId);
    const registeredStudentsSet = new Set(registeredStudents);
    const unregisteredStudents = [];
    studentIds.forEach(id => {
      if (!registeredStudentsSet.has(id)) {
        unregisteredStudents.push({
          teacherId: teacherData.id,
          studentId: id,
        });
      }
    });

    await StudentTeachers.bulkCreate(unregisteredStudents, { raw: true });

    return res.sendStatus(204); // 204 no content
  } catch (err) {

    next(err);
  }
});

module.exports = router;
