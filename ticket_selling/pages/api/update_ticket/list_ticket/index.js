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

const events = require("../../../../models/events");
const tickets = require("../../../../models/tickets");
// TODO: update func. to transfer ownership of ticket to new user 
  //notes: maybe we have to run a select query first to get the previous owner's id; then put that in the sold_from col
  //  set the is_confirmed col to false, will be handled on the profile side
async function transferOwner(ticket_id, new_price){
    const resultFound = await sequelize.query("UPDATE ticketsitedb.tickets SET is_sold = 0, price = :new_price  WHERE id_tickets = :ticket_id",
    {
      replacements: {new_price, new_price, ticket_id: ticket_id}, 
      type: QueryTypes.UPDATE
    });
  }
//this adds the functionality to incremenet the counter once reselling
  async function findEventNumTickets(eventID, callback){
    const [resultFound] = await events.findAll({
      where:{
        id : eventID
      }
    });
  
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
  async function addNumTicketToEvents(eventID, currentNumTickets){
    events.update(
      { numTickets: currentNumTickets + 1},
      { where: { id:  eventID} }
    )
      .catch(err =>
        console.error ('cannot add to events: ', err));
      
  }

  // TODO: update to accept request with new ticket owner id, 
  export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {

        transferOwner(req.body.ticket_id, req.body.new_price),
        console.log("HERE IS SOME IMPORTANT INFORMATION !!!!!!!!!!!!!!!!!!! " + req.body.new_price)

        //add 1 to ticket counter
        findEventID(req.body.ticket_id, function(eventID){
          findEventNumTickets(eventID.event_id, function(ticketNum){
            if(!ticketNum){
              //res.status(404).json({error: true, message: 'Event not found'});
              console.log('event not found')
              return;
            }
            else{
              addNumTicketToEvents(ticketNum.id, ticketNum.numTickets);
            }
          })


        })

        res.status(200).json({error: false, message: 'Ticket put on the market!'});
      }
    } catch (err) {
      res.status(500).json({ error: 'failed to put ticket on the market'})
    }
  }