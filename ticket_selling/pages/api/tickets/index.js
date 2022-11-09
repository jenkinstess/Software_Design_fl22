// import { tickets } from '../../../tickets-data'

// export default function handler(req, res) {
//   res.status(200).json(tickets)
// }
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
const tickets = require("../../../models/tickets");
const events = require("../../../models/events");
//should clear the database every week if we're doing event as primary key

events.sync()
.then(() => {
  tickets.sync().then(() => {
    console.log("new syncing complete")
  });
})

async function findEventID(eventName, callback){
  console.log("eventName Test: " + eventName);
  console.log("finding event");
  const [resultFound] = await events.findAll({
    where:{
      name : eventName
    }
  });
  // this callback allows us to define a function in the exports statement parameterized with the result of find user
  callback(resultFound);
  console.log("LOOK HERE " + JSON.stringify(resultFound));
}


async function createTicket(event, price, eventID) {
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO tickets(price, event, event_id) VALUES (:price, :event, :event_id)',
  {
      replacements: { price: price, event: event, event_id: eventID},
      type: QueryTypes.INSERT
    }
  );
}

export default (req, res) => {
    if (req.method === 'POST') {
    
      // verify the email does not already exist in the system
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const eventName = req.body.eventName;
        const price = req.body.ticketPrice;
        console.log("data grabbed");
        findEventID(eventName, function(eventInfo){
          if(!eventInfo){
            //res.status(404).json({error: true, message: 'Event not found'});
            console.log('event not found')
            return;
          }
          else{
            createTicket(eventName, price, eventInfo.id);
            res.status(404).json({error: false, message: 'Ticket on Market!'});
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
  
events.sync().then(
    () => console.log("final sync complete")
  );
tickets.sync().then(
  () => console.log("final sync complete")
);