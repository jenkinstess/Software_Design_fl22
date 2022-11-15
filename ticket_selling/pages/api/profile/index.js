

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
    console.log("HERE")
    console.log("RES>JSON: " + JSON.stringify(res.json()))
    return res.json();
  },{refreshInterval:10});
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  console.log("LOGGED IN: " + data)
  if (data.email) {
    console.log("EMAILLLLLL: " + data.email)
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
//   async function getUser() {
//     console.log("HELLLOOOOOOOOOOOOO from inside get user1")
//           // get logged in user's email
//           const loggedin_user_res = await fetch(`${server}/api/me`)
//           const loggedin_user = await loggedin_user_res.json()
//           console.log(JSON.stringify(loggedin_user))
          
//           // get logged in user's id
//           const users_res = await fetch(`${server}/api/all_users`)
//           const users = await users_res.json()
//           console.log("BUTTS")
//           console.log("USERS: " + JSON.stringify(users))
//           const current_user = users.result.filter((user) => user.email.toString() == loggedin_user.email.toString())[0]
//           console.log(current_user)
//           console.log('logged in ID: ' + current_user.userid)
          
//           const user_id = current_user.userid
//           // console.log("!!!!!!!!!!!!!!!!!!!!!!!!! user id: " + user_id)
//           return user_id
//   }

// async function findUser(){
//   console.log("HELLLOOOOOOOOOOOOO")
//     const user_id = await getUser();

//     console.log("!!!!!!!!!!!!!!!!!!!!!!!!! user id: " + user_id)
//     const [resultFound] = await sequelize.query("SELECT * FROM ticketsitedb.users WHERE userid =:user_id",
//     {
//       replacements: {user_id: user_id},
//       type: QueryTypes.SELECT
//     });
//     return JSON.stringify(resultFound);
//   }

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

  export default async function handler(req, res) {
    
    try {
      const users = await getUsers()
      const tickets = await getTickets()
      res.status(200).json({ users: users, tickets: tickets })
    } catch (err) {
      res.status(500).json({ error: 'failed to load data' })
    }
  }
  
