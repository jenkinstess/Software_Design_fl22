import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
import { Query } from 'pg';
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
  // dialectModule:'mysql2',
  operatorsAliases: false,

  pool: {
      max: 5,
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
});

//import models
const tickets = require("../../models/tickets");
//should clear the database every week if we're doing event as primary key

tickets.sync().then(
  () => console.log("initial sync complete")
);

async function findTicketPrices(eventName, callback){
    const [resultFound] = await tickets.findAll({
      where:{
        event: eventName
      }
    });
  
    callback(resultFound);
    // return 
}
export default (req, res) => {
    if (req.method === 'POST') {
    
      // verify the email does not already exist in the system
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const eventName = req.body.eventName;
        console.log("data grabbed");

        findTicketPrices(eventName, function(coolEvent){
          console.log("test!!!");

          if (!coolEvent) {
            res.status(404).json({error: true, message: 'Tickets not found'});
            console.log('cool event not found')
            return;
          }
          else{
            console.log(coolEvent)
            res.status(200).json({coolEvent})
            return;
          }
        })
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
      events.sync().then(
        () => console.log("final sync complete")
      );
    }
  };
tickets.sync().then(
    () => console.log("final sync complete")
  );