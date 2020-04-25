//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 12;
var multer = require('multer');
var upload = multer();
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
  extended: true,
  limit: "5mb"
}));
app.set("view engine", "ejs");

/////////////////////////////////html2canvas/////////////////////////////////
app.get('/html2canvas.min.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/html2canvas/dist/html2canvas.min.js');
});
/////////////////////////Sequelize-authenticate///////////////////////////////
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
const admin = sequelize.import(__dirname + "/models/admin.js");



//////////////////////////////////Homepage////////////////////////////////////
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


//////////////////////////////Admin Login/////////////////////////////////////
app.route("/admin")
.get(function(req, res){
  res.render("login-admin");
})
.post(function(req, res){
  admin.findOne({where: {username: req.body.username} }).then(ad => {
    bcrypt.compare(req.body.password, ad.password, function(err, result) {
      if(result){
        res.render("admin-home");
      }else{
        res.render("login-admin");
      }
    });
  }).catch(err => {
    console.log("No admin found");
    res.render("login-admin");
  });
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
            res.redirect("/"+doc.id+"/doctor-home");

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
            res.redirect("/"+nur.name+"/nurse-home");
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
            res.redirect("/"+recp.name+"/reception-home");
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


/////////////////////////////Render Homepage//////////////////////////////////
app.get("/:id/doctor-home", function(req, res){
  doctor.findOne({where: {id: req.params.id}, attributes: ['name'] }).then(doc => {
    res.render("doctor-home", {id: req.params.id, name: doc.name});
  });
});

app.get("/:name/reception-home", function(req, res){
  res.render("reception-home", {recp_name: req.params.name});
});

app.get("/:name/nurse-home", function(req, res){
  res.render("nurse-home", {name: req.params.name});
});

app.get("/:pid/patient-home", function(req, res){
  patient.findOne({where: {pid: req.params.pid} }).then(pat => {
    appointments.findAll({where: {pid: pat.pid, done: "false"} }).then(appt => {
      //res.send(appt);
      records.findAll({where: {appt_no: appt.map(a => a.appt_no)} }).then(rec => {
        //res.send(rec);
        doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
          res.render("patient-home", {pat: pat, rec:rec, doc: doc});
        });
      });
    });
  });
});

app.get("/admin-home", function(req, res){
  res.render("admin-home");
});


///////////////////////////////Check Appointment///////////////////////////////
app.route("/check-appointment")
.post(function(req, res){
  console.log(req.body);
  appointments.findAll({where: {did: req.body.id, done: "false"},
  attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
    ongoing_patients.findAll({where: {is_ongoing: "true"},
    attributes: ['pid']}).then(on_pat => {
      //res.send(appt);
      //console.log(appt.map((a) => {return a.pid;}));
      var arrB = on_pat.map(on_p => on_p.pid);
      var arrA = appt.map((a) => a.pid );
      var aminusb = arrA.filter(x => !arrB.includes(x));
      //console.log(aminusb);
      appointments.findAll({where: {pid: aminusb, done: "false", did: req.body.id},
      attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(apptmt => {
        //res.send(apptmt);
        patient.findAll({where: {pid: aminusb},attributes: ['name', 'gender', 'age'] }).then(pat => {
          //res.send(pat);
          res.render("check-appointments", {appt: apptmt, pat: pat, id: req.body.id});
        });
      });
    });
  }).catch(err => {
    console.log(err);
  });
});


///////////////////////////Check Appointment for nurse/////////////////////////
app.route("/:name/check-appt-nurse")
.post(function(req, res){
  appointments.findAll({where: {done: "false"}, attributes: ['appt_no', 'pid', 'room_alloted', 'date_admitted'] }).then(appt => {
    //res.send(appt);
    ongoing_patients.findAll({where: {is_ongoing: "true"},
    attributes: ['pid']}).then(on_pat => {
      //res.send(on_pat);
      var arrB = on_pat.map(on_p => on_p.pid);
      var arrA = appt.map((a) => a.pid );
      var aminusb = arrA.filter(x => !arrB.includes(x));
      console.log(aminusb);
      appointments.findAll({where: {pid: aminusb, done: "false"} }).then(apptmt => {
        //res.send(apptmt);
        patient.findAll({where: {pid: aminusb},attributes: ['name', 'gender', 'age'] }).then(pat => {
          //res.send(pat);
          res.render("check-appointments-nurse", {appt: apptmt, pat: pat, name: req.params.name});
        });
      });
    });
  });
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


/////////////////////////Check prescription pharmacy///////////////////////////
app.route("/check-pharmacy")
.post(function(req, res){
  const pat_name = _.snakeCase(req.body.pat_name);
  patient.findOne({where: {username: pat_name}, attributes: ['pid'] }).then(pat => {
    //res.send(pat);
    records.findAll({where: {pid: pat.pid} }).then(rec => {
      //res.send(rec);
      doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
        res.render("check-history", {rec: rec, doc: doc});
      });
    }).catch(err => {
      res.render("notfound", {item: "History"});
    });
  });
});


/////////////////////////////Get And store presImage///////////////////////////
var cpUpload = upload.fields([{ name: 'id', maxCount: 1 }, { name: 'img', maxCount: 1 }]);
app.post("/presImage", cpUpload, function (req, res, next) {
  //console.log(req.files);
  //console.log(req.body);
  records.findOne({where: {appt_no: req.body.appt_no}}).then((rec) => {
    if(rec){
      //console.log(rec);
      rec.update({prescription: req.body.img}).then(updated_rec =>{
        //console.log(updated_rec);
      });
    }
  }).catch(err =>{
    console.log(err);
  });
  appointments.findOne({where: {appt_no: req.body.appt_no}}).then(appt => {
    if(appt){
      appt.update({done: "true"}).then(updated_appt => {
        //console.log(updated_appt);
      });
    }
  });
});


////////////////////////////////Add Prescription///////////////////////////////
let pres = [];
app.route("/:id/:appt_no/add-prescription")
.get(function(req, res){
  console.log(req.params);
  pres = [];
  appointments.findOne({where: {appt_no: req.params.appt_no}, attributes: ['appt_no', 'pid'] }).then(appt => {
    patient.findOne({where: {pid: appt.pid},attributes: ['name', 'gender', 'age'] }).then(pat => {
      //res.send(pat);
      res.render("add-prescription", {appt_no: req.params.appt_no, pat_name: pat.name, pres: pres, id: req.params.id });
    });
  });
})
.post(function(req, res){
  console.log(req.body);
  res.render("submit-prescription", {id: req.params.id, appt_no: req.params.appt_no, pat_name: req.body.pat_name, pres: pres, date: new Date().toDateString()});
});

///////////////////////Add medicine in prescription////////////////////////////
app.route("/add-med")
.post(function(req, res){
  console.log(req.body);
  const med = {
    med: req.body.med,
    qty: req.body.qty,
    dir: req.body.dir,
    food:req.body.food
  };
  pres.push(med);
  res.render("add-prescription", {id: req.body.id, appt_no: req.body.appt_no, pat_name: req.body.pat_name, pres: pres});
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
        res.redirect("/"+pat.pid+"/patient-home");
      }else{
        res.redirect("/login-patient");
      }
    });
  }).catch(err => {
    console.log("No patient found");
    res.redirect("/login-patient");
  });
});

/////////////////////////////////Check History/////////////////////////////////
app.route("/:pid/check-history")
.get(function(req, res){
  appointments.findAll({where: {pid: req.params.pid, done: true} }).then(appt => {
    //res.send(appt);
    records.findAll({where: { appt_no: appt.map(a => a.appt_no)} }).then(rec => {
      //res.send(rec);
      doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
        res.render("check-history", {rec: rec, doc: doc});
      });
    }).catch(err => {
      res.render("notfound", {item: "History"});
    });
  }).catch(err => {
    res.render("notfound", {item: "History"});
  });
})
.post(function(req, res){
  appointments.findAll({where: {pid: req.params.pid, done: "true"} }).then(appt => {
    //res.send(appt);
    records.findAll({where: {appt_no: appt.map(a => a.appt_no)} }).then(rec => {
      //res.send(rec);
      doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
        //res.send(doc);
        res.render("check-history", {rec: rec, doc: doc});
      });
    });
  });
});

////////////////////////////Check Prescription////////////////////////////////
app.route("/check-prescription")
.post(function(req, res){
  records.findOne({where: {record_no: req.body.record_no} }).then(rec => {
    res.render("show-prescription", {img: rec.prescription});
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


///////////////////////Add Appointment for reception///////////////////////////
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

///////////////////////Add Appointment for patient/////////////////////////////
app.route("/:pid/add-appt-patient")
.get(function(req, res){
  doctor.findAll({attributes: ['id', 'name']}).then(doc => {
    res.render("add-appt-patient", {doc: doc, pid: req.params.pid});
  });
})
.post(function(req, res){
  const appt = {
    pid: req.params.pid,
    did: req.body.did,
    date_admitted: new Date()
  };
  sequelize.sync({force: false}).then(() => {
    appointments.create(appt, {fields: ["pid", "did", "date_admitted", "createdAt", "updatedAt"]}).then(apptmt => {
      const rec = {
        appt_no: apptmt.appt_no,
        pid: req.params.pid,
        did: req.body.did,
        date_admitted: new Date(),
        is_ongoing: "false"
      };
      sequelize.sync({force: false}).then(() => {
        records.create(rec, {fields: ["appt_no", "pid", "did", "date_admitted", "is_ongoing", "createdAt", "updatedAt"]}).then(recrd => {
          //console.log(recrd);
        });
        patient.findOne({where: {pid: req.params.pid} }).then(pat => {
          appointments.findAll({where: {pid: pat.pid, done: "false"} }).then(appt => {
            records.findAll({where: {appt_no: appt.map(a => a.appt_no)} }).then(rec => {
              doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
                res.render("patient-home", {pat: pat, rec:rec, doc: doc});
              });
            });
          });
        });
      });
    });
  });
});


////////////////////////////Cancel Appointment////////////////////////////////
app.route("/cancel-appt")
.post(function(req, res){
  records.findOne({where: {record_no: req.body.record_no} }).then(rec => {
    const appt_no = rec.appt_no;
    const pid = rec.pid;
    rec.destroy().then(destroyed_row => {
      //console.log(destroyed_row);
      appointments.destroy({where: {appt_no: appt_no} }).then(destroyed_appt => {
        //console.log(destroyed_appt);
        patient.findOne({where: {pid: pid} }).then(pat => {
          appointments.findAll({where: {pid: pat.pid, done: "false"} }).then(appt => {
            records.findAll({where: {appt_no: appt.map(a => a.appt_no)} }).then(rec => {
              doctor.findAll({where: {id: rec.map(r => r.did)} }).then(doc => {
                res.render("patient-home", {pat: pat, rec:rec, doc: doc});
              });
            });
          });
        });
      });
    });
  });
});

////////////////////////////////Add Case//////////////////////////////////////
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
              res.render("admin-home");
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
              res.render("admin-home");
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
              res.render("admin-home");
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
