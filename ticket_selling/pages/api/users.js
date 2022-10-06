//this is where connection to the DB will be made

//this link shows how you would connect data to a mongodb. should be similar for sql?
//https://dev.to/mgranados/how-to-build-a-simple-login-with-nextjs-and-react-hooks-255

const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

export default (req, res) => {
    if (req.method === 'POST') {
  
                const token = jwt.sign(
                  {userId: "user.userId", email: "user.email"},
                  jwtSecret,
                  {
                    expiresIn: 3000, //50 minutes
                  },
                );
                res.status(200).json({token});
                return;
         
    } else {
      // Handle any other HTTP method
      res.status(200).json({users: ['John Doe']});
    }
  };