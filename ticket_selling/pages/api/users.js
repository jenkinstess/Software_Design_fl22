import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
import { Query } from 'pg';
//this is where connection to the DB will be made

//this link shows how you would connect data to a mongodb. should be similar for sql?
//https://dev.to/mgranados/how-to-build-a-simple-login-with-nextjs-and-react-hooks-255
import Sequelize, { QueryTypes } from 'sequelize'

const { DataTypes } = require('sequelize');
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const round = 10;
//const url = 'http://localhost:3000/';
//const dbName = 'ticketsdb';

const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
  host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
  dialect: 'mysql',
  define:{
    timestamps: false
  },
  // dialectModule:'mysql2',
  operatorsAliases: false,

  pool: {
      max: 5,
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
});

const users = require("../../models/users");
const tickets = require("../../models/tickets");

// creates a relation between tickets and users. each ticket belongs to a user
tickets.belongsTo(users);

// creates a relation between tickets and users. each user owns one or many tickets
// for somereason this didnt work. may have to manually make in workbench? look into
users.hasMany(tickets);

// syncs the models to the database
users.sync().then((result) => {
  tickets.sync().then(() =>{
    console.log("syncs occurring");
  })
  console.log("initial sync complete. table is: " + result);
}).catch((err) => {
  console.log(err);
});

// trys to find the user in the users table in the database
async function findUser(email){
  console.log("email: " + email);
  const [resultFound] = await sequelize.query("SELECT * FROM ticketsitedb.users WHERE email = :email", 
  {
    replacements: {email: email},
    type: QueryTypes.SELECT
  });
  if (resultFound){
    if (resultFound.length > 0){
    let result = resultFound[0];
    return JSON.stringify(result); //need to make sure this is the right user
    } 
    console.log("JSON DATA: " + JSON.stringify(resultFound))
    return JSON.stringify(resultFound);
  }
  else{
    return resultFound;
  }
  
}

// adds the user to the users table in the database
async function createUser(email, password) {
  console.log("test before create hash");
  bcrypt.hash(password, round, async function(err, hash) {
    console.log("test within create hash");
    console.log(hash)
    // Stores the hash in the password db
    const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO users(userid, email, password) VALUES (:userid, :email, :password)',
    {
      replacements: {userid: v4(), email: email, password: hash},
      type: QueryTypes.INSERT
    });
  })
  console.log("test after create hash");
}

export default (req, res) => {
    if (req.method === 'POST') {
      // signup!!
      try{
        assert.notStrictEqual(null, req.body.email, 'email required');
        assert.notStrictEqual(null, req.body.passowrd, 'password required');
      }
      catch(bodyError){
        res.status(403).json({error: true, message: bodyError.message});
      }
    
      // verify the email does not already exist in the system
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
      
        const email = req.body.email;
        const password = req.body.password;
        console.log("data grabbed");
        console.log(password);

        try{
          findUser(email);
          //findUser(email).then(function(result){
            console.log("result of findUser: " + JSON.stringify(findUser(email)));
          //})
          //console.log("result of findUser: " + findUser(email));
        }catch(e){
          console.log(e);
          res.status(403).json({error: true, message: 'email exists'});
          return;
        }

        console.log("length: "+ Object.keys(findUser(email)).length)

        // adds user to users table in database
        try{
          createUser(email, password);
        }
        catch(err){
          console.log(err);
          return;
        }
        
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });

      //syncs the new data to the users 
      users.sync().then(
        () => console.log("final sync complete")
      );
    }
  };
users.sync().then(
    () => console.log("final sync complete")
  );