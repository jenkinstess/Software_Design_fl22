import { UV_FS_O_FILEMAP } from 'constants';
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

// syncs the models to the database
users.sync().then((result) => {
  tickets.sync().then(() =>{
    console.log("syncs occurring");
  })
  console.log("initial sync complete. table is: " + result);
}).catch((err) => {
  console.log(err);
});


// adds the user to the users table in the database
async function createUser(email, password, callback) {
  bcrypt.hash(password, round, async function(err, hash) {
    console.log(hash)
    // Stores the hash in the password db
    const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO users( email, password) VALUES (:email, :password)',
    {
      replacements: { email: email, password: hash},
      type: QueryTypes.INSERT
    },
    function(err, userCreated){
      assert.strictEqual(err, null);
      callback(userCreated)
    },);
  })
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

        //findUser(email, function(err, user){
          // if (err) {
          //   res.status(500).json({error: true, message: 'Error finding User'});
          //   return;
          // }
          // if (!user){
            // create user
            createUser(email, password, function(err, success){
              if (err) {
                res.status(500).json({error: true, message: 'error creating user'});
                return;
              }
              if (success){
                const token = jwt.sign(
                {email: email},
                jwtSecret,
                {
                  expiresIn: 3000, // 50 minutes
                }
              );
              res.status(200).json({token});
              return;
              }
              
            });
        //   }
        //   else{
        //     // User exists
        //     res.status(403).json({error: true, message: 'Email exists'});
        //   }
        // });

        // try{
        //   findUser(email);
        //   //findUser(email).then(function(result){
        //     console.log("result of findUser: " + JSON.stringify(findUser(email)));
        //   //})
        //   //console.log("result of findUser: " + findUser(email));
        // }catch(e){
        //   console.log(e);
        //   res.status(403).json({error: true, message: 'email exists'});
        //   return;
        // }

        // console.log("length: "+ Object.keys(findUser(email)).length)

        // // adds user to users table in database
        // try{
        //   createUser(email, password);
        // }
        // catch(err){
        //   console.log(err);
        //   return;
        // }
        
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });

      //syncs the new data to the users 
      users.sync().then(
        () => console.log("final sync complete")
      );
    }
    else{
      res.status(200).json({users: ['John Doe']});
    }
  };
users.sync().then(
    () => console.log("final sync complete")
  );