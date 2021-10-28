const passwordValidator = require('password-validator');

const passSchema = new passwordValidator();

passSchema
.is().min(5)                                    
.is().max(50)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

module.exports = (req, res, next) => {
    if(passSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error : `Le mot de passe est incorrect : ${passSchema.validate("req.body.password", {list : true})}`})
    }
}