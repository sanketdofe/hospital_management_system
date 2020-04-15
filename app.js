//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const Sequelize = require('sequelize');
const sequelize = new Sequelize('hospital', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
  // "define": {
  //   defaultScope: {
  //     attributes: {
  //       exclude: ['createdAt', 'updatedAt']
  //     }
  //   }
  // }
});


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


///////////////////////////////Models/////////////////////////////////////////

const appointments = sequelize.import(__dirname + "/models/appointments.js");
const doctor = sequelize.import(__dirname + "/models/doctor.js");
const employee = sequelize.import(__dirname + "/models/employee.js");
const nurse = sequelize.import(__dirname + "/models/nurse.js");
const ongoing_patients = sequelize.import(__dirname + "/models/ongoing_patients.js");
const patient = sequelize.import(__dirname + "/models/patient.js");
const receptionist = sequelize.import(__dirname + "/models/receptionist.js");
const records = sequelize.import(__dirname + "/models/records.js");
const room_alloted = sequelize.import(__dirname + "/models/room_alloted.js");




////////////////////////////////Fetch Employees///////////////////////////////
app.get("/d", function(req, res) {

  sequelize.sync({
    force: false
  }).then(() => {
    employee.findAll().then(employee => {
      //console.log(employee);
      res.send(employee);
    });
    console.log("sync is completed");
  });

});


/////////////////////////Homepage////////////////////////////////////
app.route("/")
  .get(function(req, res) {
    res.render("home");
  })
  .post(function(req, res) {
    const loginTo = req.body.name;
    if (loginTo === "Patient") {
      res.render("login-patient");
    } else {
      res.render("login-employee");
    }
  });



///////////////////////////////Employee Login//////////////////////////////////
app.route("/login-employee")
  .get(function(req, res){
  res.render("login-employee");
})
  .post(function(req, res) {
    const {
      type,
      username,
      password
    } = req.body;


    if (type === "Doctor") {
      doctor.findOne({where: {username: req.body.username} }).then(doc => {
        //console.log(doc);
        bcrypt.compare(password, doc.password, function(err, result) {
          if(result){
            res.render("doctor-home", {name: doc.name, id: doc.id});

          }else{
            res.redirect("/login-employee");
          }
        });
      }).catch(err => {
        console.log("No doctor found");
        res.redirect("/login-employee");
      });

    } else if (type === "Nurse") {
      nurse.findOne({where: {username: req.body.username} }).then(nur => {
        //console.log(doc);
        bcrypt.compare(password, nur.password, function(err, result) {
          if(result){
            res.render("nurse-home", {name: nur.name});
          }else{
            res.redirect("/login-employee");
          }
        });
      }).catch(err => {
        console.log("No nurse found");
        res.redirect("/login-employee");
      });

    } else if (type === "Receptionist") {
      receptionist.findOne({where: {username: req.body.username} }).then(recp => {
        //console.log(doc);
        bcrypt.compare(password, recp.password, function(err, result) {
          if(result){
            res.render("reception-home", {recp_name: recp.name});
          }else{
            res.redirect("/login-employee");
          }
        });
      }).catch(err => {
        console.log("No receptionist found");
        res.redirect("/login-employee");
      });

    } else if (type === "Laboratorist") {
      res.render("laboratory-home");
    } else if (type === "Pharmacist") {
      res.render("pharmacy-home");
    }
  });


///////////////////////////////Check Appointment///////////////////////////////
app.route("/check-appointment")
.post(function(req, res){
  console.log(req.body);
  if (req.body.id) {
    appointments.findAll({where: {did: req.body.id},
    attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
      ongoing_patients.findAll({where: {is_ongoing: "true"},
      attributes: ['pid']}).then(on_pat => {
        //res.send(appt);
        //console.log(appt.map((a) => {return a.pid;}));
        var arrB = on_pat.map(on_p => on_p.pid);
        var arrA = appt.map((a) => a.pid );
        var aminusb = arrA.filter(x => !arrB.includes(x));
        appointments.findAll({where: {pid: aminusb},
        attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(apptmt => {
          patient.findAll({where: {pid: aminusb},attributes: ['name', 'gender', 'age'] }).then(pat => {
            //res.send(pat);
            res.render("check-appointments", {appt: apptmt, pat: pat});
          });
        });
      });
    }).catch(err => {
      console.log(err);
    });
  } else {
    appointments.findAll({ attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
      patient.findAll({where: {pid: appt.map(a => a.pid)},attributes: ['name', 'gender', 'age'] }).then(pat => {
        //res.send(pat);
        res.render("check-appointments", {appt: appt, pat: pat});
      });
    });
  }

});


////////////////////////////////Check Case/////////////////////////////////////
app.route("/check-case")
.post(function(req, res){
  //console.log(req.body);
  if (req.body.id) {
    ongoing_patients.findAll({where: {is_ongoing: "true"},
    attributes: ['pid']}).then(on_pat => {
      //res.send(on_pat);
      appointments.findAll({where: {did: req.body.id, pid: on_pat.map(apt => apt.pid)},
      attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
        //res.send(appt);
        patient.findAll({where: {pid: appt.map((a) => a.pid )},
        attributes: ['name', 'gender', 'age'] }).then(pat => {
          //console.log(pat);
          res.render("check-case", {appt: appt, pat: pat});
        });
      }).catch(err => {
        console.log(err);
        res.render("doctor-home", {name: req.body.name, id: req.body.id} );
      });
    });
  } else {
    ongoing_patients.findAll({where: {is_ongoing: "true"},
    attributes: ['pid']}).then(on_pat => {
      //res.send(on_pat);
      appointments.findAll({where: {pid: on_pat.map(apt => apt.pid)},
      attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
        //res.send(appt);
        patient.findAll({where: {pid: appt.map((a) => a.pid )},
        attributes: ['name', 'gender', 'age'] }).then(pat => {
          //console.log(pat);
          res.render("check-case", {appt: appt, pat: pat});
        });
      }).catch(err => {
        console.log(err);
        res.render("nurse-home", {name: req.body.name, id: req.body.id} );
      });
    });
  }

});


////////////////////////////////Patient Login//////////////////////////////////
app.route("/login-patient")
.get(function(req, res){
  res.render("login-patient");
})
.post(function(req, res){
  patient.findOne({where: {username: req.body.username} }).then(pat => {
    //console.log(doc);
    bcrypt.compare(req.body.password, pat.password, function(err, result) {
      if(result){
        res.render("patient-home", {pat_name: pat.name});
      }else{
        res.redirect("/login-patient");
      }
    });
  }).catch(err => {
    console.log("No patient found");
    res.redirect("/login-patient");
  });
});


//////////////////////////////////Add Patient//////////////////////////////////
app.route("/:recp_name/add-patient")
  .get(function(req, res) {
    //console.log(req.params);
    res.render("add-patient", {recp_name: req.params.recp_name});
  })
  .post(function(req, res) {
    //console.log(req.body);
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      const patient_data = {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        contact: req.body.contact,
        address: req.body.address,
        username: _.snakeCase(req.body.name),
        password: hash
      };
      sequelize.sync({
        force: false
      }).then(() => {
        patient.create(patient_data, {
          fields: ["name", "gender", "age", "contact", "address", "username", "password"]
        }).then(() => {
          console.log('patient table updated');
          res.render("reception-home", {recp_name: req.params.recp_name});
        });
      });
    });

  });


///////////////////////////////Add Appointment/////////////////////////////////
app.route("/:recp_name/add-appointment")
  .get(function(req, res) {
    res.render("add-appointment", {recp_name: req.params.recp_name});
  })
  .post(function(req, res) {
    //console.log(req.body);
    patient.findOne({ where: {name: req.body.pname} }).then(pat => {
      //console.log(pat);
      doctor.findOne({where: {name: req.body.doc_name} }).then(doc => {
        //console.log(doc);
        const appt = {
          pid: pat.pid,
          did: doc.id,
          date_admitted: new Date()
        };
        sequelize.sync({force: false}).then(() => {
          appointments.create(appt, {fields: ["pid", "did", "date_admitted", "createdAt", "updatedAt"]}).then(apptmt => {
            const rec = {
              appt_no: apptmt.appt_no,
              pid: pat.pid,
              did: doc.id,
              date_admitted: new Date(),
              is_ongoing: "false"
            };
            sequelize.sync({force: false}).then(() => {
              records.create(rec, {fields: ["appt_no", "pid", "did", "date_admitted", "is_ongoing", "createdAt", "updatedAt"]}).then(recrd => {
                //console.log(recrd);
                res.render("reception-home", {recp_name: req.params.recp_name});

              });
            });
          });
        });
      });
    });
  });


////////////////////////////Add Case//////////////////////////////////////
app.route("/:recp_name/add-case")
  .get(function(req, res) {
    res.render("add-case", {recp_name: req.params.recp_name});
  })
  .post(function(req, res) {
    //console.log(req.body);
    patient.findOne({ where: {name: req.body.pname} }).then(pat => {
      //console.log(pat);
      doctor.findOne({where: {name: req.body.doc_name} }).then(doc => {
        //console.log(doc);
        nurse.findOne({where: {name: req.body.nurse} }).then(nur => {
          //console.log(nur);
          const room = {
            pid: pat.pid,
            room_no: req.body.room_alloted,
            ward_no: req.body.ward_alloted
          };
          sequelize.sync({force: false}).then(() => {
            room_alloted.create(room, {fields: ["pid", "room_no", "ward_no", "createdAt", "updatedAt"]}).then(room_data => {
              //console.log(room_data.id);
              sequelize.sync({force: false}).then(() => {
                const appt = {
                  pid: pat.pid,
                  did: doc.id,
                  room_alloted: room_data.id,
                  date_admitted: new Date()
                };
                appointments.create(appt, {fields: ["pid", "did", "date_admitted", "room_alloted", "createdAt", "updatedAt"]}).then(apptmt => {
                  //console.log(apptmt.appt_no);
                  sequelize.sync({force: false}).then(() => {
                    const rec = {
                      appt_no: apptmt.appt_no,
                      pid: pat.pid,
                      did: doc.id,
                      nid: nur.id,
                      room_alloted: room_data.id,
                      date_admitted: new Date(),
                      is_ongoing: "true"
                    };
                    records.create(rec, {fields: ["appt_no", "pid", "did", "nid", "room_alloted", "date_admitted", "is_ongoing", "createdAt", "updatedAt"]}).then(recd => {
                      //console.log(recd.record_no);
                      sequelize.sync({force: false}).then(() => {
                        const on_pat = {
                          pid: pat.pid,
                          is_ongoing: "true"
                        };
                        ongoing_patients.create(on_pat, {fields: ["pid", "is_ongoing", "createdAt", "updatedAt"]});
                        res.render("reception-home", {recp_name: req.params.recp_name});
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });


////////////////////////////Add Employee Home//////////////////////////////////
app.route("/add-employee")
  .get(function(req, res) {
    res.render("add-employee");
  })
  .post(function(req, res) {
    let type = req.body.type;
    if (type === "Doctor") {
      res.render("add-doctor", {
        type: req.body.type
      });
    } else if (type === "Nurse") {
      res.render("add-nurse", {
        type: req.body.type
      });
    } else if (type === "Receptionist") {
      res.render("add-receptionist", {
        type: req.body.type
      });
    } else {
      res.render("add-default-employee");
    }
    //console.log(req.body);
  });


/////////////////////////Add Employee Submit///////////////////////////////////
app.post("/submit-employee", function(req, res) {
  //console.log(req.body);
  const emp = {
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    department: req.body.department,
    designation: req.body.type,
    contact: req.body.mobile,
    address: req.body.address
  };


  sequelize.sync({
    force: false
  }).then(() => {
    employee.create(emp, {
      fields: ["name", "gender", "age", "department", "designation", "contact", "address", "createdAt", "updatedAt"]
    }).then((emp) => {
      console.log('table updated');
      //console.log(em.id);

      if (req.body.type === "Doctor") {
        //console.log(req.body);
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          const doc = {
            eid: emp.id,
            name: emp.name,
            med_degree: req.body.med_degree,
            specialization: req.body.specialization,
            experience: req.body.experience,
            shift: req.body.shift,
            doc_type: req.body.doc_type,
            username: _.snakeCase(req.body.name),
            password: hash
          };
          //console.log((doc));
          sequelize.sync({
            force: false
          }).then(() => {
            doctor.create(doc, {
              fields: ["eid", "name", "med_degree", "specialization", "experience", "shift", "doc_type", "username", "password"]
            }).then(() => {
              console.log('table updated');
              res.redirect("/");
            });
          });
        });



      } else if (req.body.type === "Nurse") {

        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          const nurseEmp = {
            eid: emp.id,
            name: emp.name,
            shift: req.body.shift,
            username: _.snakeCase(req.body.name),
            password: hash
          };
          sequelize.sync({
            force: false
          }).then(() => {
            nurse.create(nurseEmp, {
              fields: ["eid", "name", "shift", "username", "password"]
            }).then(() => {
              console.log('nurse table updated');
              res.redirect("/");
            });
          });
        });



      } else if (req.body.type === "Receptionist") {

        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          const receptionistEmp = {
            eid: emp.id,
            name: emp.name,
            shift: req.body.shift,
            username: _.snakeCase(req.body.name),
            password: hash
          };
          sequelize.sync({
            force: false
          }).then(() => {
            receptionist.create(receptionistEmp, {
              fields: ["eid", "name", "shift", "username", "password"]
            }).then(() => {
              console.log('receptionist table updated');
              res.redirect("/");
            });
          });
        });


      }

    });
  });
});


/////////////////////////////Logout For All///////////////////////////////////
app.route("/logout")
.get(function(req, res){
  res.redirect("/");
});


///////////////////////////////Port Setup//////////////////////////////////////
app.listen("3000", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is up on port 3000");
  }
});
