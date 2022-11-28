
import Sequelize, { QueryTypes } from 'sequelize'
import React, {useState, useRef} from 'react';
import { isConstructorDeclaration, isMappedTypeNode } from 'typescript';


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
const events = require("../../../models/events");
const tickets = require("../../../models/tickets");
const imgs = require("../../../models/imgs");
//should clear the database every week if we're doing event as primary key

events.sync()
.then(() => {
  tickets.sync().then(() => {
      imgs.sync().then(() => {
        console.log("new syncing complete")  
      });
  });
});

tickets.sync().then(() => {
  imgs.sync().then(() => {
    console.log("new syncing complete")  
  });
});

imgs.sync().then(() => {
  console.log("new syncing complete")  
});


async function uploadImgTicket(image_name, idimages, event_name, callback) {
    const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO images(idimages, image_name, event_name) VALUES (:idimages, :image_name, :event_name)',
    {
      replacements: {idimages: idimages, image_name: image_name, event_name: event_name},
      type: QueryTypes.INSERT
    }
  );
  callback(resultsCreate);
}

export default (req, res) => {
    if (req.method === 'POST') {
      sequelize.authenticate().then(() => {

        console.log('connected to sequelize mysql server');
 
        const src = req.body.image;
        const imgText = req.body.text;
        const eventname = req.body.eventName;
        //const imgData = req.body.imgData;
        console.log(src);
        console.log(imgText);
        //console.log(imgData);
        console.log("data grabbed");

        if(imgText.length == 0){
          res.status(404).json({error: true, message: 'no image sent'});
          console.log('no image sent')
          return;
        }

        uploadImgTicket(src, imgText, eventname, function(info) {
          console.log("info" + info);
            if(info!=0){
                res.status(401).json({error: true, message: 'error uploading ticket'});
                return;
            }
            else{
                res.status(200).json({info});
                return;
            }
        })

        
      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
      tickets.sync().then(
        () => console.log("final sync complete")
      );
    }
  };
  tickets.sync().then(
    () => console.log("final sync complete")
  );
  imgs.sync().then(
    () => console.log("final sync complete")
  );