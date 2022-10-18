const db = require('/config/database');

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
const [results, metadata] = sequelize.query(
    "SELECT * from users",
  );
function Profile() {
    return <div>Users: {results}</div>
  }
  
  export default Profile