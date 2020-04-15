const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    appt_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "appt_no",
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
    did: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "did",
      autoIncrement: false,
      references: {
        key: "id",
        model: "doctor_model"
      }
    },
    room_alloted: {
      type: DataTypes.CHAR(4),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "room_alloted",
      autoIncrement: false
    },
    date_admitted: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "date_admitted",
      autoIncrement: false
    },
    date_discharged: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "date_discharged",
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
    tableName: "appointments",
    comment: "",
    indexes: []
  };
  const AppointmentsModel = sequelize.define("appointments_model", attributes, options);
  return AppointmentsModel;
};