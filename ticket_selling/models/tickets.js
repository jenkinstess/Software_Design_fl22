import Sequelize from 'sequelize'

const { DataTypes } = require('sequelize');

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

//should clear the database every week if we're doing event as primary key
const tickets = sequelize.define('tickets', {
  id_tickets:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  event:{
    type: DataTypes.STRING,
    allowNull: false
  },

  userUserid:{
    type: DataTypes.STRING,
  },

  event_id:{
    type: DataTypes.INTEGER,
    allowNul: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },

  specific_id:{
    type: DataTypes.STRING,
  }
});

module.exports = tickets;