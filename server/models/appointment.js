import models from './index';

module.exports = (sequelize, DataTypes) => {
  const Appointments = sequelize.define('appointments', {
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
      field: '"AppointmentUID"'
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"DoctorID"'
    },
    title : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"Title"'
    },
    description : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"Description"'
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: '"Active"'
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
    table: '"Appointments"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  Appointments.associate = (models) => {
    Appointments.belongsTo(models.users, {
      foreignKey: 'doctorId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Appointments;
};
