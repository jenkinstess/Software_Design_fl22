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

const users = sequelize.define('users', {
  userid:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  },
  venmo:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  prof_pic:{
    type: DataTypes.STRING
  }
});

module.exports = users;