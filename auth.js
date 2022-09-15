
var jwt = require("jsonwebtoken");
var _ = require("lodash");
const db = require("./db");
const User = require("./models/user");
// FOR JWT TOKEN SECURED MIDDLEWARE
const {success_response,failed_response} = require ("./helpers")

const auth = async (req,res,next)=>{
    // CHECK AUTH TOKEN IN HEADER
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (_.isEmpty(token)) return res.status(400).json(failed_response(400,"token is missing or expired",false));
  
    // VERIFY TOKEN AND RETURN USER
    jwt.verify(token, process.env.PRIVATE_KEY, async (err, user) => {
      //console.log(err)
      if (err !== null) {
        console.log(err)
        return res.status(400).json(failed_response(400,"You must login first",false));
      }
      console.log(user.email)
      
      if(_.isEmpty(user.email)){
        return res.status(404).json(failed_response(400,"Token is invalid or user not found",false));
      }

      // Verify user here
      verify_users = await User.findOne({email: user.email})
      //console.log(verify_users)
      if(_.isEmpty(verify_users)){
        return res.status(400).json(failed_response(400,"You must login first",false));
      }
      if(verify_users == null){
        return res.status(400).json(failed_response(400,"You must login first",false));
      }

      req.user = verify_users.email
      req.user_id = verify_users.id
      // req.user_details = verify_users
      next()
    })

}


module.exports = auth;