const express=require('express')
const router=express.Router()
const User = require("../model/user");
const { validateSignup } = require("../utils/validator");
const bcrypt = require("bcrypt");
const validator=require("validator")

router.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password } = req.body;
  
    try {
      validateSignup(req);
      const encryptedPass = await bcrypt.hash(password, 10);
      if(!validator.isStrongPassword(password)){
        throw Error("weak Password")
    }
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: encryptedPass,
      });
      console.log(user);
      await user.save();
      res.send("User added succesfully");
    } catch (error) {
      res.status(400).send("Error in saving the user " + error);
    }
  });
  
  router.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
  
    try {
      const user = await User.findOne({ emailId });
      console.log(user);
      if(!user){
          throw Error("Invalid email/password")
      }
      await user.validatePassword(password);
  
      const token = await user.getJwt();
      res.cookie("token", token);
      res.send("User Login succesfully");
    } catch (error) {
      res.status(401).send("Unable to login " + error);
    }
  });

  router.post('/logout',(req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())}).send("Logout succesfully")
  })

module.exports=router