// import NextAuth from 'next-auth'
// import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter"
// import Sequelize, { DataTypes } from 'sequelize'
// import CredentialsProvider from "next-auth/providers/credentials"

// const jwt = require('jsonwebtoken');
// const jwtSecret = 'SUPERSECRETE20220';

// const users = require("../../../models/users");
// const events = require("../../../models/events");
// const tickets = require("../../../models/tickets");

// // https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
// const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
//   host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
//   dialect: 'mysql',
//   //dialectModule:'mysql2',
//   operatorsAliases: false,

//   pool: {
//       max: 5,
//       min: 0, 
//       acquire: 30000,
//       idle: 10000
//   },
// })

// // const adapter = SequelizeAdapter(sequelize, {
// //   models: {
// //     User: users,
// //     Ticket: tickets,
// //     Event: events,
// //   },
// // })

// // Calling sync() is not recommended in production
// sequelize.sync()

// export default NextAuth({
//   session:{
//     jwt: true,
//   },
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: 'Credentials',
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       // You can pass any HTML attribute to the <input> tag through the object.
//       credentials:{
//         email: { label: "Email", type: "text", placeholder: "jdoe@wustl.edu" },
//         password: { label: "Password", type: "password"}
//       },
//       async authorize(credentials) {

//         // // You need to provide your own logic here that takes the credentials
//         // // submitted and returns either a object representing a user or value
//         // // that is false/null if the credentials are invalid.
//         // // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
//         // // You can also use the `req` object to obtain additional parameters
//         // // (i.e., the request IP address)
//         const res = await fetch("../auth", {
//           method: 'POST',
//           body: JSON.stringify(credentials),
//           headers: { "Content-Type": "application/json" }
//         })
//         const user = await res.json()

//         // If no error and we have user data, return it
//         if (res.ok && user) {
//           return user
//         }
//         // Return null if user data could not be retrieved
//         return null
//       }
//     })
//   ],
//   adapter: SequelizeAdapter(sequelize, {
//     models: {
//       User: users,
//       Ticket: tickets,
//       Event: events,
//     },
//   }),
//   pages:{
//     signIn: '../../login',
//     newUser: '../../signup'
//   },
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       return true
//     },
//   },
//   events: {
//     async signIn(message) { /* on successful sign in */ },
//     async createUser(message) { /* user created */ },
//   }
// })