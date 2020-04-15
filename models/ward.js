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
    }
  };
  const options = {
    tableName: "ward",
    comment: "",
    indexes: []
  };
  const WardModel = sequelize.define("ward_model", attributes, options);
  return WardModel;
};