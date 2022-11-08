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

events.sync().then(
  () => console.log("initial sync complete")
);
tickets.sync().then(
  () => console.log("initial sync complete")
);

async function findEvent(eventName){
  console.log("event: " + eventName);
  //https://sebhastian.com/sequelize-where/
  // const [resultFound] = await Event.findAll({
  //   where: {name: eventName}
  // })
  const [resultFound] = await sequelize.query("SELECT * FROM events WHERE name = :name", 
  {
    replacements: {name: eventName},
    type: QueryTypes.SELECT
  });
  console.log("JSON DATA: " + JSON.stringify(resultFound))
  return JSON.stringify(resultFound);
}



async function createTicket(event, price) {
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO tickets(id_tickets, price, event) VALUES (:id_tickets, :price, :event)',
  {
      replacements: {id_tickets: v4(), price: price, event: event},
      type: QueryTypes.INSERT
    }
  );
}


// }
export default (req, res) => {
    if (req.method === 'POST') {
    
      // verify the email does not already exist in the system
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const eventName = req.body.eventName;
        const price = req.body.ticketPrice;
        console.log("data grabbed");

        // try{
        //   findEvent(eventName);
        //   //findUser(email).then(function(result){
        //     console.log("result of findEvent: " + JSON.stringify(findEvent(eventName)));
        //   //})
        //   //console.log("result of findUser: " + findUser(email));
        // }catch(e){
        //   console.log(e);
        //   res.status(403).json({error: true, message: 'event exists'});
        //   return;
        // }

        // // tests that email (ie. user) does not already exist in the database
        // findTicketPrices(eventName, function(coolEvent){
        //   console.log("test!!!");

        //   if (!coolEvent) {
        //     res.status(404).json({error: true, message: 'Tickets not found'});
        //     console.log('cool event not found')
        //     return;
        //   }
        //   else{
        //     console.log(coolEvent)
        //     res.status(200).json({coolEvent})
        //     return;
        //   }
        // })


        if(Object.keys(findEvent(eventName)).length == 0){
            try{
            createTicket(eventName, price);
            
          }
          catch(err){
            console.log(err);
            console.log("test here");
            return;
          }
        }
        else{
          console.log("didnt'work!!")
        }
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