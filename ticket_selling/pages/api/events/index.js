// import { events } from '../../../events-data'

// export default function handler(req, res) {
//   res.status(200).json(events)
// }
import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
import { Query } from 'pg';
import Sequelize, { QueryTypes } from 'sequelize'
import React, {useState, useRef} from 'react';

const { DataTypes } = require('sequelize');
const assert = require('assert');
const v4 = require('uuid').v4;
// const [numTickets, setNumTickets] = useState('');

//have to pull the current counter value and then add one
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

async function findEvent(eventName, callback){
  console.log("eventName Test: " + eventName);
  console.log("finding event");
  const [resultFound] = await events.findAll({
    where:{
      name : eventName
    }
  });
  // this callback allows us to define a function in the exports statement parameterized with the result of find user
  callback(resultFound);
  console.log("found event");
}


async function createEvent(name, date, description) {
  
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO events(name, date, description, numTickets) VALUES (:name, :date, :description, :numTickets)',
  {
      replacements: {name: name, date: date, description: description, numTickets: 0},
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

        findEvent(eventName, function(event){
          if(!event){
            createEvent(eventName, eventDate, eventDescription);
            res.status(200).json({message: 'Event Created'});
            //res.status(404).json({error: false, message: 'Event Created'});
            //add one to counter after pulling the existing counter
          }
          else{
            
            // setNumTickets(event.numTickets)
            // console.log("TESTING RIGHT HERE INA: " + numTickets)
            //have to make numTickets global variable 
            res.status(401).json({error: true, message: 'Event Already Exists'});
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
events.sync().then(
    () => console.log("final sync complete")
  );