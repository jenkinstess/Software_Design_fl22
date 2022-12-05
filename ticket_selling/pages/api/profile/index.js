

import Sequelize from 'sequelize'
import { server } from '../../../config';



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

const { QueryTypes } = require('sequelize');
async function findUser(){

  const {data, revalidate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  },{refreshInterval:10});
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  console.log("LOGGED IN: " + data)
  if (data.email) {
    loggedIn = true;
      const [resultFound] = await sequelize.query(
        "SELECT * FROM ticketsitedb.users WHERE userid =:email",
        {
          replacements: { email: data.email },
          type: QueryTypes.SELECT,
        }
      );
      return JSON.stringify(resultFound);
  }

}

async function getUsers(){
    const users_res = await fetch(`${server}/api/all_users`)
    const users = await users_res.json()
    return JSON.stringify(users);
}

async function getTickets(){
    const tickets_res = await sequelize.query("SELECT * FROM ticketsitedb.tickets",
    {
      type: QueryTypes.SELECT
    })
    return JSON.stringify(tickets_res);
}

async function getEvents(){
  const tickets_res = await sequelize.query("SELECT * FROM ticketsitedb.events",
  {
    type: QueryTypes.SELECT
  })
  return JSON.stringify(tickets_res);
}

  export default async function handler(req, res) {
    
    try {
      const users = await getUsers()
      const tickets = await getTickets()
      const events = await getEvents()
      res.status(200).json({ users: users, tickets: tickets, events: events})
    } catch (err) {
      res.status(500).json({ error: 'failed to load data' })
    }
  }
  
