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
    aadharNo : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"AadharNo"'
    },
    consultationFee : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"ConsultationFee"'
    },
    departmentIds : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"DepartmentId"'
    },
    specialization : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"Specialization"'
    },
    experience : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"Experience"'
    },
    qualification : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"Qualification"'
    },
    address : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"Address"'
    },
    profileImage : {
      type: DataTypes.TEXT,
      allowNull: true,
      field: '"ProfileImage"'
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

