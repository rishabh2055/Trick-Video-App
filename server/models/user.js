import models from './index';
import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
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
      field: '"UserUID"'
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"FirstName"'
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"LastName"'
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: '"Email"'
    },
    mobileNo: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: '"MobileNo"'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: '"Active"'
    },
    isDoctor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: '"IsDoctor"'
    },
    invalidAttempt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"InvalidAttempt"'
    },
    firstLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: '"FirstLogin'
    },
    hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "Hash"
    },
    passwdLastChanged: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: '"PasswdLastChanged'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: '"LastLoggedIn"'
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
    table: '"User"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  return User;
};
