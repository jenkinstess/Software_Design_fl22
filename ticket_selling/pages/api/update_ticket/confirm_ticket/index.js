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


async function confirmTicket(ticket_id){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_confirmed = 1 WHERE id_tickets = :ticket_id",
    {
      replacements: {ticket_id: ticket_id}, 
      type: QueryTypes.UPDATE
    });
  }

  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        confirmTicket(req.body.ticket_id),

        res.status(200).json({error: false, message: 'Ticket removed!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to remove ticket'})
    }
  }