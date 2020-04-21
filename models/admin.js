const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    username: {
      type: DataTypes.CHAR,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "username",
      autoIncrement: false
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "password",
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
    tableName: "admin",
    comment: "",
    indexes: []
  };
  const AdminModel = sequelize.define("admin_model", attributes, options);
  return AdminModel;
};