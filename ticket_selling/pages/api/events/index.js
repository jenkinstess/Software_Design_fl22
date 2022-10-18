import { events } from '../../../events-data'

export default function handler(req, res) {
  res.status(200).json(events)
}

// import Sequelize, { QueryTypes } from 'sequelize'

// const { DataTypes } = require('sequelize');
// const assert = require('assert');
// // const bcrypt = require('bcrypt');
// // const v4 = require('uuid').v4;
// // const jwt = require('jsonwebtoken');
// // const jwtSecret = 'SUPERSECRETE20220';

// const round = 10;
// //const url = 'http://localhost:3000/';
// //const dbName = 'ticketsdb';

// const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
//   host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
//   dialect: 'mysql',
//   define:{
//     timestamps: false
//   },
//   // dialectModule:'mysql2',
//   operatorsAliases: false,

//   pool: {
//       max: 5,
//       min: 0, 
//       acquire: 30000,
//       idle: 10000
//   },
// });
// //should clear the database every week if we're doing event as primary key
// const events = sequelize.define('events', {
//   id:{
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     primaryKey: true
//   },
//   date:{
//     type: DataTypes.DATE,
//     allowNull: false
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//     unique: true
//   }
// });

// events.sync().then(
//   () => console.log("initial sync complete")
// );

// async function findEvent(eventName){
//   console.log("event: " + eventName);
//   const [resultFound] = await sequelize.query("SELECT * FROM ticketsitedb.events WHERE name = eventName", 
//   {
//     replacements: {name: eventName},
//     type: QueryTypes.SELECT
//   });
//   return resultFound;
// }

// async function createEvent(name, date, description) {
//   // console.log("test before create hash");
//   // bcrypt.hash(password, round, async function(err, hash) {
//   //   console.log("test within create hash");
//   //   console.log(hash)
//   //   // Stores the hash in the password db
//   //   const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO users(userid, email, password) VALUES (:userid, :email, :password)',
//   //   {
//   //     replacements: {userid: v4(), email: email, password: hash},
//   //     type: QueryTypes.INSERT
//   //   });
//   // })
//   // console.log("test after create hash");

//   const [resultsCreate] = await sequelize.query('INSERT INTO events(name, date, description) VALUES (eventName, eventDate, eventDescription)');
// }


// // }
// export default (req, res) => {
//     if (req.method === 'POST') {
//       // signup!!
//       // try{
//       //   assert.notStrictEqual(null, req.body.date, 'email required');
//       //   assert.notStrictEqual(null, req.body.passowrd, 'password required');
//       // }
//       // catch(bodyError){
//       //   res.status(403).json({error: true, message: bodyError.message});
//       // }
    
//       // verify the email does not already exist in the system
//       sequelize.authenticate().then(() => {

//         console.log('connected to sequelize mysql server');
 
//         const eventName = req.body.eventName;
//         const eventDate = req.body.eventDate;
//         const eventDescription = req.body.eventDescription;
//         console.log("data grabbed");

//         try{
//           findUser(eventName);
//           //findUser(email).then(function(result){
//             console.log("result of findUser: " + JSON.stringify(findEvent(eventName)));
//           //})
//           //console.log("result of findUser: " + findUser(email));
//         }catch(e){
//           console.log(e);
//           res.status(403).json({error: true, message: 'event exists'});
//           return;
//         }

//         // tests that email (ie. user) does not already exist in the database



//         if(Object.keys(findEvent(eventName)).length == 0){
//             try{
//             createEvent(eventName, eventDate, eventDescription);
//           }
//           catch(err){
//             console.log(err);
//             return;
//           }
//         }
//         else{
//           console.log("didnt'work!!")
//         }
//       }).catch((error) => {
//         console.error ('unable to connect to the db: ', error);
//       });
//       events.sync().then(
//         () => console.log("final sync complete")
//       );
//     }
//   };
// events.sync().then(
//     () => console.log("final sync complete")
//   );