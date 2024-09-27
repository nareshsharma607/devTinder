function validateSignup(req){
if(!req.body.firstName){
    throw Error("Name is not correct")
}
}
function validateProfileEditData(req){
    const allowedFields=["firstName","lastName","gender","about","skills","photoUrl"]
  const isValidFields=Object.keys(req.body).every(field=>allowedFields.includes(field))
    
    return isValidFields
}

module.exports={validateSignup,validateProfileEditData}