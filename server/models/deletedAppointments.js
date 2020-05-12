import models from './index';

module.exports = (sequelize, DataTypes) => {
  const DeletedAppointments = sequelize.define('deletedAppointments', {
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
      field: '"DeleteAppointmentUID"'
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"DoctorID"'
    },
    fromDate : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"FromDate"'
    },
    fromTime : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"FromTime"'
    },
    toDate : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"ToDate"'
    },
    toTime : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"ToTime"'
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
    table: '"DeletedAppointments"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  DeletedAppointments.associate = (models) => {
    DeletedAppointments.belongsTo(models.users, {
      foreignKey: 'doctorId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return DeletedAppointments;
};
