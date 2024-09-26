const jwt=require("jsonwebtoken")
const User = require("../model/user")
const userAuth=async(req,res,next)=>{
try{
    const {token}=req.cookies
    if(!token){
        throw Error("Token not exist")
    }
    const {_id}=jwt.verify(token,"dev@Tinder")
    const user=await User.findById({_id})
    if(!user){
        throw Error("User not exist")
    }
    req.user=user
    next()

}catch(err){
        res.status(400).send("Unauthorised user: "+err)
    }
    
}
module.exports={userAuth}