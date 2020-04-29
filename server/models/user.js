import models from './index';
import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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
    Hash: {
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

  // define some required methods
  User.prototype.hashPassword = ()  => {
    return bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
  };

  User.prototype.comparePassword = function (passw, err, cb) {
    if (err) {
      return cb(err, false, false);

    } else {
        bcrypt.compare(passw, this.Hash, function (err, isMatch) {
        if (err) {
            return cb(err, false, false);
        }
        cb(null, isMatch, false);
      });
    }

  };
  return User;
};
