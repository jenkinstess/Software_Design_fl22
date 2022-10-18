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

const users = sequelize.define('users', {
  userid:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  }
});

users.sync().then(
  () => console.log("initial sync complete")
);

async function findUser(email){
  console.log("email: " + email);
  const [resultFound] = await sequelize.query("SELECT * FROM ticketsitedb.users WHERE email = :email", 
  {
    replacements: {email: email},
    type: QueryTypes.SELECT
  });
  // const found = users.findAll({
  //       where:{
  //         email: email
  //       }
  //     });
  return resultFound;
}

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
    // const newUser = users.create({
    //   userid: v4(),
    //   email: email,
    //   password: hash
    // });
    // return newUser;
  })
  console.log("test after create hash");
}

// function findUser(email, callback) {
//   console.log("test beginning of find");
//   const found = users.findAll({
//     where:{
//       email: email
//     },
//     function(err, found){
//       assert.strictEqual(err, null);
//       callback(found);
//     }
//   });
//   console.log("test after find");
// }

// function createUser(email, password, callback) {
//   function createUser(email, password) {
//   console.log("test before create hash");
//   bcrypt.hash(password, round, function(err, hash) {
//     console.log("test within create hash");
//     console.log(hash)
//     // Stores the hash in the password db
//     const newUser = users.create({
//       userid: v4(),
//       email: email,
//       password: hash,
//       // function(err, userCreated) {
//       //   assert.strictEqual(err, null);
//       //   callback(userCreated);
//       // }
//     });
//   })
//   console.log("test after create hash");

// }
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

        // tests that email (ie. user) does not already exist in the database

        console.log("length: "+ Object.keys(findUser(email)).length)

        if(Object.keys(findUser(email)).length == 0){
            try{
            createUser(email, password);
          }
          catch(err){
            console.log(err);
            return;
          }
        }
        else{
          console.log("didnt'work!!")
        }
        
        // const found = users.findAll({
        //   where:{
        //     email: email
        //   }
        // }).then(function(found){
        //   return found;
        // });

        // console.log("found filled");
        // console.log(found);
        
        // if(found == []){
        //   console.log("found nothing");
        //   createUser(email, password);
        //   res.status(200).json({token});
        //   return;
        // }
        // else{
        //     // user already exists
        //     console.log("found user");
        //     res.status(403).json({error: true, message: 'email exists'});
        //     return;
        // }

        // findUser(email, function(err, user) {
        //   console.log("beginning here!!!");
        //   if(err) {
        //     console.log("error finding user");
        //     res.status(500).json({error: true, message: 'Error finding user'});
        //     return;
        //   }
        //   console.log("before if user");
        //   if(!user){
        //     console.log("after if user");
        //     // create a user
        //     createUser(email, password, function(creationResult) {
        //       console.log("before creation result call");
        //       if(creationResult.ops.length == 1) {
        //         console.log("before creation result call");
        //         const user1 = creationResult.ops[0];
        //         //const token = {userid: user1.userid, email: user1.email, password: user1.password};
        //         const token = jwt.sign(
        //           {userid: user1.userid, email: user1.email, password: user1.password},
        //           jwtSecret,
        //           {
        //             expiresIn: 3000, //50 mins
        //           },
        //         );
        //         res.status(200).json({token});
        //         return;
        //       }
        //     });
        //   }
        //   else {
        //     // user already exists
        //     res.status(403).json({error: true, message: 'email exists'});
        //     return;
        //   }
        // });
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
      users.sync().then(
        () => console.log("final sync complete")
      );
    }
  };
users.sync().then(
    () => console.log("final sync complete")
  );