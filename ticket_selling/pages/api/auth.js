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

async function findUser(email){
  console.log("email: " + email);
  const [resultFound] = await users.findAll({
    where:{
      email : email
    }
  });
  return resultFound;
}

async function authUser(email, password){
  console.log("email: " + email);
  const [resultFound] = await users.findAll({
    where:{
      email : email
    }
  });
  if (resultFound){
    if (resultFound.length > 0){
      bcrypt.compare(password, resultFound.password, function(err, result){
        if(err){
          console.log(err);
          return false;
        }
        else if (result){
          console.log("result of pw comparison: " + result);
          return JSON.stringify(resultFound);
        }
        else{
          console.log("result of pw comparison: " + result);
          res.status(403).json({error: true, message: 'incorrect pw'});
          return false;
        }
      })
    }
  }
  else{
    console.log("user does not exist in system");
    res.status(403).json({error: true, message: 'email does not exist in system'});
    return false;
  }
  
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

      try{
        authUser(email, password)
        const token = jwt.sign(
          {userId: "user.userId", email: "user.email"},
          jwtSecret,
          {
          expiresIn: 3000, //50 minutes
          },
        );
        res.status(200).json({token});
        return authUser(email, password);
        //findUser(email);
        //findUser(email).then(function(result){
         // console.log("result of findUser: " + JSON.stringify(findUser(email)));
        //})
        //console.log("result of findUser: " + findUser(email));
      }catch(e){
        console.log(e);
        res.status(500).json({error: true, message: 'auth failed'});
        return false;
      }
      
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