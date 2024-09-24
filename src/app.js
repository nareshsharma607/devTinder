const express=require("express")
const connectDB=require('./config/database')
const User=require('./model/user')
const app=express()

app.use(express.json())

app.post('/signup',async(req,res)=>{
    console.log(req.body)
    const userObj=req.body
    try {
        const user=new User(userObj)
        await user.save()
        res.send("User added succesfully")
    } catch (error) {
        res.status(400).send("Error in saving the user",error)
    }
  
})



connectDB().then(()=>{
    console.log("connected to db succesfully")
    app.listen(3000,()=>{
        console.log("server is running")
    })
}).catch((err)=>console.log("error in connecting to db",err))


