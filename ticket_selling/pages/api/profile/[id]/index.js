import Sequelize from 'sequelize'
const models = require('models/index.js')



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


// function getUser(id){
//     const found = users.findAll({
//           where:{
//             id: id
//           }
//         });
//     return found;
//   }
const { QueryTypes } = require('sequelize');
const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
// We didn't need to destructure the result here - the results were returned directly
export default (req, res) => {
  sequelize.authenticate().then(() => {
    console.log('connected to sequelize mysql server');
    if (users.length > 0){
        username = users[0].username;
    } else {
        console.log("!!!!!!!!!!!!!!!!!!!!found no users!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
    alert("!!!!!!!!!!!!!!!!!!!!!!!!!!"+username+"!!!!!!!!!!!!!!!!!!!!!!!!");

  }).catch((error) => {
    console.error ('unable to connect to the db: ', error);
  });
  
}