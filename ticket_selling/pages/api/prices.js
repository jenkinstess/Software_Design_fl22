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

const tickets = require("../../models/tickets");
// const events = require("../../../models/events");

// events.sync()
// .then(() => {
//   tickets.sync().then(() => {
//     console.log("new syncing complete")
//   });
// })
tickets.sync().then(() => {
    console.log("new syncing complete")
});


async function findAllPrices(eventName, callback){
    console.log("eventName Test: " + eventName);
    //find all where isSold is false and event is event
    // console.log("finding event");
    const [resultFound] = await tickets.findAll({
      where:{
        event : eventName
      }
    });
    console.log("AIRPORT TEST " + resultFound.length)
    // this callback allows us to define a function in the exports statement parameterized with the result of find user
    callback(resultFound);
    console.log("LOOK HERE " + JSON.stringify(resultFound));
  }

export default (req, res) => {
    if (req.method === 'POST') {
      sequelize.authenticate().then(() => {
        console.log('connected to sequelize mysql server');
        // console.log('testing 11/29')
        const eventName = req.body.currentEvent;
        //console.log(eventName)
        var allPrices = [];
        var sum = 0;
        var averagePrice = 0;
        findAllPrices(eventName, async function(eventInfo){
            if(!eventInfo){
                console.log('event not found')
                return;
            }
            else{
                console.log("11/29 TEST" + eventInfo)
                for(let i=0; i<eventInfo.length; i++){
                    allPrices.push(eventInfo[i].price)
                }
                //do i need to check anything regarding confirmed? on market? etc.
                for(let i=0; i <allPrices.length; i++){
                    sum += allPrices[i]
                }
                averagePrice = sum/(allPrices.length)
                res.status(200).json({averagePrice});
                console.log("TESTING THE AVERAGE PRICE: " + averagePrice)
            }
        


        })


      }).catch((error) => {
        console.error ('unable to connect to the db: ', error);
      });
    //   events.sync().then(
    //     () => console.log("final sync complete")
    //   );
    }
  };
  
// events.sync().then(
//     () => console.log("final sync complete")
//   );
tickets.sync().then(
  () => console.log("final sync complete")
);