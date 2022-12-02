// import { tickets } from '../../../tickets-data'

// export default function handler(req, res) {
//   res.status(200).json(tickets)
// }
import { NEXT_CLIENT_SSR_ENTRY_SUFFIX } from 'next/dist/shared/lib/constants';
import { Query } from 'pg';
import Sequelize, { QueryTypes } from 'sequelize'
import { isConditionalExpression } from 'typescript';
import { server } from "../../../config";

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

tickets.sync().then(() => {
  console.log("new syncing complete")
});

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


//COME BACK TO HERE!!!!
// async function addNumTicketToEvents();

// //updatenumticket(int) {
//   insert into eventsdb where eventid=eventID values (int)
//    ++ counter
// }

async function addNumTicketToEvents(eventID, currentNumTickets){
  events.update(
    { numTickets: currentNumTickets + 1},
    { where: { id:  eventID} }
  )
  .catch(err =>
    console.error ('cannot add to events: ', err));
  
}

async function createTicket(event, price, sellerID, eventID, specID, confirmed, uploadedFile) {
  const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO tickets(price, event, userUserid, event_id, specific_id, is_confirmed, uploaded_img) VALUES (:price, :event, :userUserid, :event_id, :specific_id, :is_confirmed, :uploaded_img)',
  {
      replacements: { price: price, event: event, userUserid: sellerID, event_id: eventID, specific_id: specID, is_confirmed: confirmed, uploaded_img: uploadedFile},
      type: QueryTypes.INSERT
    }
  );
  //updatenum
}


export default (req, res) => {
    if (req.method === 'POST') {
      //console.log(req)
      // verify the email does not already exist in the system
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const eventName = req.body.eventName;
        const price = req.body.ticketPrice;
        const specificID = req.body.text;
        const seller_id = req.body.ownerID;
        const uploadedFile = req.body.uploadedFile;
        // console.log("the specific id lenght is: ");

        // console.log(specificID.length);
        
        if(specificID.length == 0){
          res.status(404).json({error: true, message: 'no image sent'});
          console.log('no image sent')
          return;
        }
        // console.log("data passed: "+ req.body);
        // console.log("SEE IF THERE IS A VALUE HERE: " + specificID);
        // console.log("data grabbed");


        findEventID(eventName, async function(eventInfo){
          if(!eventInfo){
            //res.status(404).json({error: true, message: 'Event not found'});
            console.log('event not found')
            return;
          }
          else{
            //const seller_id = await findSellerID();
            console.log("INA IS HERE: " + seller_id);
            let confirmed = true;
            createTicket(eventName, price, seller_id, eventInfo.id, specificID, confirmed, uploadedFile);
            //fetch event numTickets
            //add one to that
            console.log("INA IS TESTING RIGHT HERE: " + eventInfo.numTickets);
            addNumTicketToEvents(eventInfo.id, eventInfo.numTickets)
            res.status(200).json({eventInfo});
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