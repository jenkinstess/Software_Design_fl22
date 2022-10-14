import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
//this is where connection to the DB will be made

//this link shows how you would connect data to a mongodb. should be similar for sql?
//https://dev.to/mgranados/how-to-build-a-simple-login-with-nextjs-and-react-hooks-255
import Sequelize from 'sequelize'

const { DataTypes } = require('sequelize');
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const round = 10;
const url = 'http://localhost:3000/';
const dbName = 'ticketsdb';

const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
  host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
  dialect: 'mysql',
  // dialectModule:'mysql2',
  operatorsAliases: false,

  pool: {
      max: 5,
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
});

const users = sequelize.define('users', {
  userid:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password:{
    tyoe: DataTypes.STRING,
    allowNull: false
  }
});


function findUser(email, callback) {
  const found = users.findAll({
    where:{
      email: email
    },
    function(err, found){
      assert.strictEqual(err, null);
      callback(userFound);
    }
  });
}

function createUser(email, password, callback) {

  bcrypt.hash(password, round, function(err, hash) {
    console.log(hash)
    // Stores the hash in the password db
    const newUser = users.create({
      userid: v4(),
      email: email,
      password: hash,
      function(err, userCreated) {
        assert.strictEqual(err, null);
        callback(userCreated);
      }
    });
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
        //dbName.
    
        //const db = (dbName);
        const email = req.body.email;
        const password = req.body.password;
        console.log("data grabbed");
        console.log(password);

        findUser(email, function(err, user) {
          if(err) {
            res.status(500).json({error: true, message: 'Error finding user'});
            return;
          }
          if(!user){
            // create a user
            createUser(email, password, function(creationResult) {
              if(creationResult.ops.length == 1) {
                const user = creationResult.ops[0];
                const token = jwt.sign(
                  {userid: user.userid, email: user.email},
                  jwtSecret,
                  {
                    expiresIn: 3000, //50 mins
                  },
                );
                res.status(200).json({token});
                return;
              }
            });
          }
          else {
            // user already exists
            res.status(403).json({error: true, message: 'email exists'});
            return;
          }
        });
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
    }
  };
