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


function Profile() {
  sequelize.authenticate().then(() => {
    console.log('connected to sequelize mysql server');
    let userlist = models.Users.findall();
    let username = "not initialized"
    if (length(userlist) > 0){
        username = userlist[0].username;
    } else {
        console.log("!!!!!!!!!!!!!!!!!!!!found no users!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
    alert("!!!!!!!!!!!!!!!!!!!!!!!!!!"+username+"!!!!!!!!!!!!!!!!!!!!!!!!");

  }).catch((error) => {
    console.error ('unable to connect to the db: ', error);
  });
  
}



  
  export default Profile