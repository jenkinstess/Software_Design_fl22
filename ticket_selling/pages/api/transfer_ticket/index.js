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

// TODO: update func. to transfer ownership of ticket to new user 
async function transferOwner(ticket_id, new_owner_id){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET userUserid = :user_id, is_sold = 1 WHERE id_tickets = :ticket_id",
    {
      replacements: {user_id: new_owner_id, ticket_id: ticket_id}, 
      type: QueryTypes.UPDATE
    });
  }

  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    
    try {
      if (req.method === 'POST') {
        transferOwner(req.body.ticket_id, req.body.user_id)
        res.status(200).json({error: false, message: 'Ownership Transferred!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to update ticket owner'})
    }
  }