const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    room_no: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "room_no",
      autoIncrement: false
    },
    room_type: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "room_type",
      autoIncrement: false
    },
    vacancy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "vacancy",
      autoIncrement: false
    },
    timings: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "timings",
      autoIncrement: false
    },
    wards_present: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "wards_present",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "room",
    comment: "",
    indexes: []
  };
  const RoomModel = sequelize.define("room_model", attributes, options);
  return RoomModel;
};