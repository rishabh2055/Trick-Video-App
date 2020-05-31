import models from './index';

module.exports = (sequelize, DataTypes) => {
  const DoctorDepartments = sequelize.define('doctorDepartments', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: '"ID"'
    },
    uid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: '"DoctorUID"'
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"Name"'
    },
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: '"CreatedOn'
    },
    updatedOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: '"UpdatedOn'
    }
  }, {
    table: '"DoctorDepartments"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  return DoctorDepartments;
};
