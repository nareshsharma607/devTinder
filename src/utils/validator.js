function validateSignup(req){
if(!req.body.firstName){
    throw Error("Name is not correct")
}
}


module.exports={validateSignup}