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

// events.hasMany(tickets, {
//   foreignKey: 'event_id',
//   as: 'new_event_id'
// });
// tickets.belongsTo(events);


events.sync()
.then(() => {
  tickets.sync().then(() => {
    console.log("new syncing complete")
  });
})


//flip events and tickets


// events.sync({force:true}).then(
//   () => console.log("initial sync complete")
// );
// tickets.sync({force:true}).then(
//   () => console.log("initial sync complete")
// );




//this is to find the eventID to use as the foreign key
// async function findEvent(eventName){
//   console.log("event: " + eventName);
//   //https://sebhastian.com/sequelize-where/
//   // const [resultFound] = await Event.findAll({
//   //   where: {name: eventName}
//   // })
//   const eventID = await sequelize.query("SELECT id FROM events WHERE name = :name", 
//   {
//     replacements: {name: eventName},
//     type: QueryTypes.SELECT
//   });
//   console.log("LOOK HERE " + JSON.stringify(eventID))
//   return JSON.stringify(eventID);
// }


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
  // console.log("WHAT IS THE CORRENT EVENTID? " + eventID);
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO tickets(price, event, event_id) VALUES (:price, :event, :event_id)',
  {
      replacements: { price: price, event: event, event_id: eventID},
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
        findEventID(eventName, function(eventInfo){
          if(!eventInfo){
            res.status(404).json({error: true, message: 'Event not found'});
            console.log('event not found')
            return;
          }
          else{
            createTicket(eventName, price, eventInfo.id);
          }
        })
        


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

        
        // if(Object.keys(findEvent(eventName)).length == 0){
        //     try{
        //     createTicket(eventName, price);
            
        //   }
        //   catch(err){
        //     console.log(err);
        //     console.log("test here");
        //     return;
        //   }
        // }
        // else{
        //   console.log("didnt'work!!")
        // }
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