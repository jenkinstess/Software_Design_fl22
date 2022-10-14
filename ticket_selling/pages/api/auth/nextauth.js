import NextAuth from 'next-auth'
import SequelizeAdapter, { models } from 'next-auth-sequelize-adapter'
import Sequelize, { DataTypes } from 'sequelize'

// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
const sequelize = new Sequelize('ticketsitedb', 'ticketgroup', 'partytixstinks',{
  host: 'ticket-site-db.cvddhqhvjcur.us-east-1.rds.amazonaws.com', 
  dialect: 'mysql',
  //dialectModule:'mysql2',
  operatorsAliases: false,

  pool: {
      max: 5,
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
})

const adapter = SequelizeAdapter(sequelize, {
  models: {
    User: sequelize.define("users", {
      ...models.User,
      idusers: DataTypes.INT,
      user_email: DataTypes.STRING,
      password: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone_number:  DataTypes.STRING,
    }),
  },
})

// Calling sync() is not recommended in production
sequelize.sync()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [],
  adapter,
})