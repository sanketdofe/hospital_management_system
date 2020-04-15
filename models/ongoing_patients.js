const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    pid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "pid",
      autoIncrement: false
    },
    is_ongoing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "is_ongoing",
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "updatedAt",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "ongoing_patients",
    comment: "",
    indexes: []
  };
  const OngoingPatientsModel = sequelize.define("ongoing_patients_model", attributes, options);
  return OngoingPatientsModel;
};