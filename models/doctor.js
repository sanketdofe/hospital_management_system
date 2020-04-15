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
    eid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "eid",
      autoIncrement: false,
      references: {
        key: "id",
        model: "employee_model"
      }
    },
    med_degree: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "med_degree",
      autoIncrement: false
    },
    specialization: {
      type: DataTypes.CHAR(30),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "specialization",
      autoIncrement: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "experience",
      autoIncrement: false
    },
    shift: {
      type: DataTypes.CHAR(5),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "shift",
      autoIncrement: false
    },
    doc_type: {
      type: DataTypes.CHAR(9),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "doc_type",
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
    },
    name: {
      type: DataTypes.CHAR(30),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "name",
      autoIncrement: false
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "username",
      autoIncrement: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "password",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "doctor",
    comment: "",
    indexes: []
  };
  const DoctorModel = sequelize.define("doctor_model", attributes, options);
  return DoctorModel;
};