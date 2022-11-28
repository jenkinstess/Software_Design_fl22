import Sequelize, { QueryTypes } from 'sequelize'
//import users from './users';

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
  // dialectModule:'mysql2',
  operatorsAliases: false,

  pool: {
      max: 5,
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
});

//import model
const tickets = require("../../../models/tickets");

async function findTicket(specialID, eventName, callback) {
    const [resultFound] = await tickets.findAll({
        where:{
            specific_id : specialID,
            is_sold : 0,
            event : eventName
        }
    });
    callback(resultFound);
    console.log("finding tickets");
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
      
        const specialID = req.body.text;
        const eventName = req.body.eventName;
        console.log("data grabbed");
        console.log(specialID);
  
        findTicket(specialID, eventName, function(ticket){
          console.log("i am testing!!")
          // if no ticket object is returned, then no prior ticket exists and thus the uploaded image is verified
          if (!ticket){
            res.status(200).json({ticket});
            console.log("no prior ticket exists!")
            return;
          }
          else{
            res.status(404).json({error: true, message: 'Ticket is already being sold. Select a different ticket'});
            console.log('ticekt is already being sold')
            return;
          }
        })
        
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
    } else {
        // Handle any other HTTP method
          res.statusCode = 401;
          res.end();
      }
    };