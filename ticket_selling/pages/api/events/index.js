// import { events } from '../../../events-data'

// export default function handler(req, res) {
//   res.status(200).json(events)
// }
import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
import { Query } from 'pg';
import Sequelize, { QueryTypes } from 'sequelize'

const { DataTypes } = require('sequelize');
const assert = require('assert');
const v4 = require('uuid').v4;

const round = 10;
//const url = 'http://localhost:3000/';
//const dbName = 'ticketsdb';
//make eventName not unique key, but just make it so you cant add new
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
const events = require("../../../models/events");
//should clear the database every week if we're doing event as primary key

events.sync().then(
  () => console.log("initial sync complete")
);

async function findEvent(eventName){
  console.log("event: " + eventName);
  const [resultFound] = await sequelize.query("SELECT * FROM ticketsitedb.events WHERE name = :name", 
  {
    replacements: {name: eventName},
    type: QueryTypes.SELECT
  });
  return resultFound;
}

async function createEvent(name, date, description) {
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO events(name, date, description) VALUES (:name, :date, :description)',
  {
      replacements: {name: name, date: date, description: description},
      type: QueryTypes.INSERT
    }
  );
}

// }
export default (req, res) => {
    if (req.method === 'POST') {
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const eventName = req.body.eventName;
        const eventDate = req.body.eventDate;
        const eventDescription = req.body.eventDescription;
        console.log("data grabbed");

        try{
          findEvent(eventName);
            console.log("result of findEvent: " + JSON.stringify(findEvent(eventName)));
        }catch(e){
          console.log(e);
          res.status(403).json({error: true, message: 'event exists'});
          return;
        }

        if(Object.keys(findEvent(eventName)).length == 0){
            try{
            createEvent(eventName, eventDate, eventDescription);
          }
          catch(err){
            console.log(err);
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