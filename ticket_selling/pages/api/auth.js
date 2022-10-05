const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

export default (req, res) => {
    if (req.method === 'POST') {
      //login
     
        const token = jwt.sign(
            {userId: user.userId, email: user.email},
            jwtSecret,
            {
            expiresIn: 3000, //50 minutes
            },
        );
        res.status(200).json({token});
        return; 
            
    } else {
      // Handle any other HTTP method
        res.statusCode = 401;
        res.end();
    }
  };