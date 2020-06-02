import models from './index';

module.exports = (sequelize, DataTypes) => {
  const Communications = sequelize.define('communications', {
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
      field: '"CommunicationUID"'
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"FromUserID"'
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"ToUserID"'
    },
    roomName : {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: '"RoomName"'
    },
    message : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: '"Message"'
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
    table: '"Communications"',
    schema: 'videoapp',
    createdAt: false,
    updatedAt: false

  });
  Communications.associate = (models) => {
    Communications.belongsTo(models.users, {
      foreignKey: 'fromUserId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    Communications.belongsTo(models.users, {
      foreignKey: 'toUserId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Communications;
};
