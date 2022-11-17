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
const events = require("../../../models/events");
const tickets = require("../../../models/tickets");

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
async function transferOwner(ticket_id, new_owner_id, prev_owner){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET userUserid = :user_id, is_sold = 1, is_confirmed = 0, sold_from = :prev_owner WHERE id_tickets = :ticket_id",
    {
      replacements: {user_id: new_owner_id, ticket_id: ticket_id, prev_owner: prev_owner}, 
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
        let prev_owner = req.body.prev_owner_email;
        console.log("GETTING PREVIOUS OWNER: " + prev_owner)
        transferOwner(req.body.ticket_id, req.body.user_id, prev_owner),

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
        

        res.status(200).json({error: false, message: 'Ownership Transferred!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to update ticket owner'})
    }
  }