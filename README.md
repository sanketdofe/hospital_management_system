Project

Hospital Management System
Feb 2020 – Apr 2020

This project was undertaken by me as an academic project work in the field of 'Database Management System'. This project is a webapp built to address the following issues:

Multi-Speciality Hospitals are open and running 24/7. And these hospitals rely on a lot of
paperwork. Hospitals need to keep track of the records of the doctors working there, record of the
employees working there, etc.

They need to keep the records of the rooms like which room is used for which purpose and by whom
that room is used by, the allotment of free wards in room to patient and so on. They also need to keep
a track of the medical operations performed in the hospital, the doctor who performed it and who was
assisting him and so on. And it is needed to be stored for the future reference or use.
They also need to keep a track of patients currently admitted in the hospital and getting medical care.
They also need to keep a track of the appointments of the different doctors and share it with the
concerned doctor.

The patient’s medicinal history is not kept/stored at the hospital, instead it is (said to be) stored by the
patient itself. The doctor’s prescription, the lab reports, medical advice, etc are to be stored by the
patient himself/herself. This medicinal history is used by the doctor for future appointments of the
concerned patient. So, this invaluable medicinal history needs to be handled securely which some
patients do not. This can lead to problems for the doctor as well as the patients.
There is a need to keep the records of the different medicinal operations performed in the hospital like
on whom (patient) it was performed, by which doctor it was performed, who was assisting, where (in
the hospital) it was performed, was the doctor an attendee, permanent or a visiting one, etc. This is a
very critical and valuable data that is needed to be stored safely.
There is also a need to keep a track of ongoing patients (patients who is required to frequently visit the
hospital for scheduled medical care) in the hospital.

Ultimately, there is a need to reduce the paperwork at hospital and also to securely store the invaluable data.

Solution:
A webapp is built to address the above issues.

Technologies Used:
i.   NodeJS (with ExpressJS) is used as a backend for the web app.
ii.  Postgres SQL is used as a database storage and manager.
iii. Since access to database should be secure and limited to the type of person accessing it, our web app includes login system to limit access to the database. Thus, a password is needed to be stored in the database. To make password storage more secure, it is stored in encrypted form with the help of ‘bcrypt’ (a node package) which encrypts text by generating its hashes.
iv.  I am using ‘lodash’ (a node package) to generate usernames for the persons using the web app from their name.
v.   I am using ‘Sequelize’ (a node package) which is a NodeJS Object Relational Mapper (ORM) for Postgres. It is used to connect to the database, query the database, etc.
vi.  I am using EJS to implement views in the web app. It is a simple templating language that can generate HTML markup with plain JavaScript.
vii. Heroku is used as a hosting platform to host the app on the world wide web so that anyone can access it easily from anywhere on the go.
viii.Heroku postgres is used to host the database on the world wide web.


The webapp can be accessed at: https://mighty-chamber-15387.herokuapp.com/

Any suggestions on improving this webapp would be highly appreciated!!
