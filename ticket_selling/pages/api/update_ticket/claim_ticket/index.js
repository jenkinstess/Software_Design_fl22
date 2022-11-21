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
//decrement counter when ticket transferred
const events = require("../../../../models/events");
const tickets = require("../../../../models/tickets");

async function findEventNumTickets(eventID, callback){
  const [resultFound] = await events.findAll({
    where:{
      id : eventID
    }
  });
//   // this callback allows us to define a function in the exports statement parameterized with the result of find user
  callback(resultFound);
  console.log(JSON.stringify(resultFound));
}

async function findEventID(ticketID, callback){
  const [resultFound] = await tickets.findAll({
    where:{
      id_tickets : ticketID
    }
  });
  // this callback allows us to define a function in the exports statement parameterized with the result of find user
  callback(resultFound);
  console.log(JSON.stringify(resultFound));
}


// TODO: update func. to transfer ownership of ticket to new user 
  //notes: maybe we have to run a select query first to get the previous owner's id; then put that in the sold_from col
  //  set the is_confirmed col to false, will be handled on the profile side
async function transferOwner(ticket_id){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_sold = 1 WHERE id_tickets = :ticket_id",
    {
      replacements: {ticket_id: ticket_id}, 
      type: QueryTypes.UPDATE
    });
  }
  async function subtractNumTicketToEvents(eventID, currentNumTickets){
    events.update(
      { numTickets: currentNumTickets - 1},
      { where: { id:  eventID} }
    )
      .catch(err =>
        console.error ('cannot add to events: ', err));
      
  }


  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        transferOwner(req.body.ticket_id),
        findEventID(req.body.ticket_id, function(eventID){
          findEventNumTickets(eventID.event_id, function(ticketNum){
            if(!ticketNum){
              //res.status(404).json({error: true, message: 'Event not found'});
              console.log('event not found')
              return;
            }
            else{
              subtractNumTicketToEvents(ticketNum.id, ticketNum.numTickets);
            }
          })


        })

        res.status(200).json({error: false, message: 'Ticket put on the market!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to put ticket on the market'})
    }
  }