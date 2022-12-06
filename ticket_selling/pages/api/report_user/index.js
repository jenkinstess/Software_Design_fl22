import { Query } from 'pg';
import Sequelize, { QueryTypes } from 'sequelize'
import tickets from '../tickets';

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


async function reportUser(user_id){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.users SET is_reported = 1 WHERE userid = :user_id",
    {
      replacements: {user_id: user_id}, 
      type: QueryTypes.UPDATE
    });
  }

async function getReportedTickets(user_id, callback){
  const resultFound = await sequelize.query("SELECT * FROM ticketsitedb.tickets WHERE userUserid = :user_id AND is_sold = 1",
  {
    replacements: {user_id: user_id},
    type: QueryTypes.SELECT
  });
  console.log("LENGTH OF RESULTTTTTTTTTTTTTTTTTTTTT " + resultFound.length )
  callback(resultFound);
  return resultFound.length
}

async function decTicketCounter(event_name) {

  const resultFound = await sequelize.query("SELECT * FROM ticketsitedb.events WHERE name = :name",
  {
    replacements: {name: event_name},
    type: QueryTypes.SELECT
  });
  let curNumTickets = resultFound.numTickets -1;

  const eventUpdate = await sequelize.query("UPDATE ticketsitedb.events SET numTickets = :numTickets WHERE name = :name",
    {
      replacements: {numTickets: curNumTickets}, 
      type: QueryTypes.UPDATE
    });
}
async function takeTixOffMarket(user_id){
  const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_sold = 0 WHERE userUserid = :user_id",
  {
    replacements: {user_id: user_id},
    type: QueryTypes.UPDATE
  })
}
  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        reportUser(req.body.user_id),
        takeTixOffMarket(req.body.user_id),
        getReportedTickets(req.body.user_id, function(ticketsFound){
          if (!ticketsFound) {
            res.status(200).json({error: true, message: 'error finding tickets for reported user'});
          }
          else{
            for(let i = 0; i < ticketsFound.length; ++i) {
              decTicketCounter(ticketsFound[i].event)
              //console.log(ticketsFound[i]);
            }
          }
        }),

        res.status(200).json({error: false, message: 'user reported!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to report user'})
    }
  }