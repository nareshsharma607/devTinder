const express=require('express')
const router=express.Router()
const User = require("../model/user");
const {validateProfileEditData}=require("../utils/validator")
const { userAuth } = require("../middlewares/authMddleware");
const bcrypt = require("bcrypt");
const validator=require("validator")

router.get("/profile/view", userAuth, (req, res) => {
    console.log(req.user);
    res.send(req.user);
  });

  router.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
       const validEditable= validateProfileEditData(req)
       if(!validEditable){
        throw Error("Check your field they are not editable")
       }
       const loggedInUser=req.user
       Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])
       await loggedInUser.save()
    //    const user=await User.findByIdAndUpdate({_id},req.body)
       if(!loggedInUser){
        throw Error("user not found")

       }
       res.send("User Edited succesfully")
    } catch (error) {
        res.status(400).send("Unable to edit: "+error) 
    }
  })

router.patch("/profile/password",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user
        const {password,newPassword}=req.body
        console.log("ooo",password,newPassword)
        const isValidPassword=await loggedInUser.validatePassword(password)
        if(!isValidPassword){
            throw Error("Incorrect Password")
        }else if(!validator.isStrongPassword(newPassword)){
            throw Error("weak Password")
        }
        const encryptedPass = await bcrypt.hash(newPassword, 10);
        loggedInUser.password=encryptedPass
        await loggedInUser.save()
        res.send("Password changed Succesfully"+loggedInUser)
    } catch (error) {
        res.status(400).send("Error: "+error)
    }

})

module.exports=router