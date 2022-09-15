
const bcrypt = require("bcrypt");
var _ = require("lodash");


// HASHING THE PASSWORD
const hasPass = async (pass)=>{
    const passs = _.isEmpty(pass)

    if (passs) return false

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const passwords = await bcrypt.hash(pass, salt);
    console.log(passwords)
    return passwords
    
}


// CHECK PASS AFTER DECODING
const checkPass  = (pass,hash)=> bcrypt.compareSync(pass, hash);


// SUCCESS RESPONSE

const success_response = (code,message,response,status)=>{
    // CHECK IF ALL ARE EMPTY OR NOT
    
    
    // CHECK WRONG DATA TYPE
    if (!_.isInteger(code)) return "code is missing or invalid or not integer"
    if(!_.isString(message)) return "message is missing or invalid or not string"
    if(!_.isObject(response)) return "response is missing or invalid or not object"
    if(!_.isBoolean(status)) return "status is missing or invalid or not boolean"


     // INITIALIZED ALL
    const data = {
        code:code,
        message:message,
        response:response,
        status:status

    }

    return data
       
        
}

const failed_response = (code,message,status)=>{
   
    // CHECK WRONG DATA TYPE
    if (!_.isInteger(code)) return false
    if(!_.isString(message)) return false
    if(!_.isBoolean(status)) return false


     // INITIALIZED ALL
    const data = {
        code:code,
        message:message,
        response:{},
        status:status

    }

    return data
       
        
}

const validatePassword =(pass)=> {

    var result = false
    if(_.isEmpty(pass)) return result
    var newPassword = pass
    var minNumberofChars = 6;
    var maxNumberofChars = 16;
    var regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(newPassword.length < minNumberofChars || newPassword.length > maxNumberofChars){
        result= true;
    }
    if(!regularExpression.test(newPassword)) {
        result= true;
    }

    return result
  }



module.exports = {hasPass,checkPass,success_response, failed_response,validatePassword}