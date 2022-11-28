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
const tickets = sequelize.define('images', {
  idimages:{
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: 'tickets',
        key: 'specific_id'
      }
  },

  image_name: {
    type: DataTypes.STRING,
    
  },
  event_name:{
    type: DataTypes.STRING,
  }
});

module.exports = tickets;