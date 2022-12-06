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

const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
  host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
  dialect: 'mysql',
  define:{
    timestamps: false
  },
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

// adds the user to the users table in the database
async function createUser(email, password, venmo, prof_pic, callback) {
  bcrypt.hash(password, round, async function(err, hash) {
    console.log(hash)
    // Stores the hash in the password db
    const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO users( email, password, venmo, prof_pic) VALUES (:email, :password, :venmo, :prof_pic)',
      {
        replacements: { email: email, password: hash, venmo: venmo, prof_pic: prof_pic },
        type: QueryTypes.INSERT
      },
      // function(err, userCreated){
      //   assert.strictEqual(err, null);
      //   callback(userCreated)
      // },
    );
    callback(resultsCreate);
    // function(err, resultsCreate){
    //   assert.strictEqual(err, null);
    //   callback(resultsCreate)
    // }
  });
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
        const venmo = req.body.venmo;
        if(!req.body.profPic) {
          const prof_pic = "https://partyticketsimages.s3.us-east-2.amazonaws.com/basic_prof_pic.jpg";
        }
        const prof_pic = req.body.profPic;
        console.log("data grabbed");
        console.log(prof_pic);
        console.log(password);

        findUser(email, function(user){
          console.log("testing for find user!");

          // if no user object is returned, then we should go ahead and create the user
          if (!user){
            // createUser(email, password, venmo, function(err, success){
            createUser(email, password, venmo, prof_pic, function(newUser){
              if (newUser) {
                console.log("user created!");
                const token = jwt.sign(
                  {email: email},
                  jwtSecret,
                  {
                    expiresIn: 3000, // 50 minutes
                  },
                );
                // res.status(200);
                res.status(200).json({token});
                return;
              }
              // if (success){
              //   console.log("user created!");
              //   const token = jwt.sign(
              //     {email: email},
              //     jwtSecret,
              //     {
              //       expiresIn: 3000, // 50 minutes
              //     },
              //   );
              //   // res.status(200);
              //   res.status(200).json({token});
              //   return;
              // }
              // else{
              //   res.status(401).json({error: true, message: 'User not created'});
              //   return;
              // }
            });
          }
          else{
            res.status(500).json({error: true, message: 'user already exists'});
            return;
          }
        })

        
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