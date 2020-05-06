import models from './index';

module.exports = (sequelize, DataTypes) => {
  const Doctors = sequelize.define('doctors', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"UserID"'
    },
    clinicName : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"ClinicName"'
    },
    registrationNo : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"RegistrationNo"'
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
    table: '"Doctors"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  Doctors.associate = (models) => {
    Doctors.belongsTo(models.users, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Doctors;
};
