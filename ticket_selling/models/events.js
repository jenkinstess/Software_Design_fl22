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
const events = sequelize.define('events', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unsigned: true,
    primaryKey: true,

  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = events;