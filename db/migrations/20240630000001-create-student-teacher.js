
module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('StudentTeachers', {
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'teacherId',
        },
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'studentId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  ),
  down: (queryInterface, Sequelize) => (
    queryInterface.dropTable('StudentTeachers')
  ),
};
