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
  //notes: maybe we have to run a select query first to get the previous owner's id; then put that in the sold_from col
  //  set the is_confirmed col to false, will be handled on the profile side
async function transferOwner(ticket_id){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_sold = 0 WHERE id_tickets = :ticket_id",
    {
      replacements: {ticket_id: ticket_id}, 
      type: QueryTypes.UPDATE
    });
  }

  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        transferOwner(req.body.ticket_id),

        res.status(200).json({error: false, message: 'Ticket put on the market!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to put ticket on the market'})
    }
  }