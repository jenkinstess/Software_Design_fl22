import Sequelize from 'sequelize'

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
async function getEvents(){
    const resultFound = await sequelize.query("SELECT * FROM ticketsitedb.events",
    {
      type: QueryTypes.SELECT
    });
    return resultFound;
  }

  export default async function handler(req, res) {
    try {
      const result = await getEvents()
      console.log(result)
      res.status(200).json({ result })
    } catch (err) {
      res.status(500).json({ error: 'failed to load data' })
    }
  }
  
