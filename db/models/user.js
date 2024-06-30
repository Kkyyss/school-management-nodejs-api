
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('Users', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email.',
        },
        notEmpty: {
          msg: 'Email cannot be empty.',
        },
        notNull: {
          msg: 'Please enter your email.',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('teacher', 'student'),
      allowNull: false,
      defaultValue: 'student',
    },
    status: {
      type: DataTypes.ENUM('suspend', 'activate'),
      allowNull: false,
      defaultValue: 'activate',
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email', 'role', 'status'],
      },
    ],
  });

  User.associate = function(models) {
    User.belongsToMany(models.Users, {
      through: models.StudentTeachers,
      as: 'teacherStudents',
      foreignKey: 'teacherId',
    });
    User.belongsToMany(models.Users, {
      through: models.StudentTeachers,
      as: 'studentTeachers',
      foreignKey: 'studentId',
    });
  };
  return User;
};
