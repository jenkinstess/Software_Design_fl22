import Sequelize, { QueryTypes } from 'sequelize'
//import users from './users';

const { DataTypes } = require('sequelize');
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const round = 10;
const users = require("../../models/users");

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


async function findUser(email, callback){
  console.log("email: " + email);
  console.log("finding user");
  const [resultFound] = await users.findAll({
    where:{
      email : email
    }
  });
  // this callback allows us to define a function in the exports statement parameterized with the result of find user
  callback(resultFound);
  console.log("found user");
}

//to beter understand callbacks check out
// https://developer.mozilla.org/en-US/docs/Glossary/Callback_function
// https://flaviocopes.com/how-to-return-result-asynchronous-function/

async function authUser(email, password, hash, callback){
  console.log("email: " + email);
  console.log("authing user");
  // compares the users password to the hashed password
  bcrypt.compare(password, hash, callback)
  
}


export default (req, res) => {
  if (req.method === 'POST') {
    // login!!
    try{
      assert.notStrictEqual(null, req.body.email, 'email required');
      assert.notStrictEqual(null, req.body.passowrd, 'password required');
    }
    catch(bodyError){
      res.status(403).json({error: true, message: bodyError.message});
    }
  
    // connect to database
    sequelize.authenticate().then(() => {

      console.log('connected to sequelize mysql server');
    
      const email = req.body.email;
      const password = req.body.password;
      console.log("data grabbed");
      console.log(password);

      // function used in line 76 is the call back defined aboce
      findUser(email, function(user){
        console.log("i am testing!!")
        // if no user object is returned, then no user was found for the associated data.
        if (!user){
          res.status(404).json({error: true, message: 'User not found'});
          console.log('User not found')
          return;
        }
        else{
          // user found, now authenticating 
          authUser(email, password, user.password, function(err, match){ 
            if(err) {
              res.status(500).json({error: true, message: 'Auth Failed'});
              console.log("auth failed");
            }
            if(match){
              console.log("auth success!")
              const token = jwt.sign(
                {email: user.email},
                jwtSecret,
                {
                expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            }
            else{
              res.status(401).json({error: true, message: 'Auth Failed'});
              return;
            }
          })
        }
      })
      
    }).catch((error) => {
      console.error ('unable to connect to the db: ', error);
    });

    //syncs the new data to the users 
    users.sync().then(
      () => console.log("final sync complete")
    );
  } else {
      // Handle any other HTTP method
        res.statusCode = 401;
        res.end();
    }
  };