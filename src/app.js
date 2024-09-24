const express=require("express")
const connectDB=require('./config/database')
const User=require('./model/user')
const app=express()


app.post('/signup',async(req,res)=>{
    const userObj={
        firstName:"Naresh",
        lastName:"Sharma",
        emailId:"nareshsharma607@gmail.com",
        age:27,
        password:"1234567890"
    }
    const user=new User(userObj)
   await user.save()
   res.send("User added succesfully")
})



connectDB().then(()=>{
    console.log("connected to db succesfully")
    app.listen(3000,()=>{
        console.log("server is running")
    })
}).catch((err)=>console.log("error in connecting to db",err))


