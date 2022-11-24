
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

imgs.sync().then(() => {
    console.log("new syncing complete")
  });

async function uploadImgTicket(image_name, idimages, callback) {
    const [resultsCreate, metadataCreate] = await sequelize.query('INSERT INTO images(idimages, image_name) VALUES (:idimages, :image_name)',
    {
      replacements: {idimages: idimages, image_name: image_name},
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
        console.log(src);
        console.log(imgText);
        console.log("data grabbed");

        uploadImgTicket(src, imgText, function(info) {
            if(!info){
                res.status(401).json({error: true, message: 'error uploading ticket'});
                return;
            }
            else{
                res.status(404).json({error: false, message: 'ticket uploaded'});
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