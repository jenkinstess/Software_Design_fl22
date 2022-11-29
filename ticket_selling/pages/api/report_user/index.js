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

  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        reportUser(req.body.user_id),

        res.status(200).json({error: false, message: 'user reported!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to report user'})
    }
  }