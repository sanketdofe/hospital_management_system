const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    record_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "record_no",
      autoIncrement: true
    },
    appt_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "appt_no",
      autoIncrement: false,
      references: {
        key: "appt_no",
        model: "appointments_model"
      }
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
    nid: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nid",
      autoIncrement: false,
      references: {
        key: "id",
        model: "nurse_model"
      }
    },
    room_alloted: {
      type: DataTypes.BIGINT,
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
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "prescription",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "records",
    comment: "",
    indexes: []
  };
  const RecordsModel = sequelize.define("records_model", attributes, options);
  return RecordsModel;
};