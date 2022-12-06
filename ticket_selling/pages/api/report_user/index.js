import { Query } from 'pg';
import Sequelize, { QueryTypes } from 'sequelize'

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

// async function numUserTixOnMarket(user_id){
//   const resultFound = await sequelize.query("SELECT * FROM ticketsitedb.tickets WHERE userUserid = :user_id AND is_sold = 1",
//   {
//     replacements: {user_id: user_id},
//     type: QueryTypes.SELECT
//   });
//   console.log("LENGTH OF RESULTTTTTTTTTTTTTTTTTTTTT " + resultFound.length )
//   return resultFound.length
// }

// async function takeTixOffMarket(user_id){
//   const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_sold = 0 WHERE userUserid = :user_id",
//   {
//     replacements: {user_id: user_id},
//     type: QueryTypes.UPDATE
//   })
// }
  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        reportUser(req.body.user_id),
        //takeTixOffMarket(req.body.user_id),

        res.status(200).json({error: false, message: 'user reported!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to report user'})
    }
  }