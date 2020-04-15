const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: true
    },
    pid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "pid",
      autoIncrement: false,
      references: {
        key: "pid",
        model: "patient_model"
      }
    },
    room_no: {
      type: DataTypes.CHAR(4),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "room_no",
      autoIncrement: false
    },
    ward_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ward_no",
      autoIncrement: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "updatedAt",
      autoIncrement: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "createdAt",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "room_alloted",
    comment: "",
    indexes: []
  };
  const RoomAllotedModel = sequelize.define("room_alloted_model", attributes, options);
  return RoomAllotedModel;
};