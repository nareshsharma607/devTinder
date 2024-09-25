const express=require("express")
const connectDB=require('./config/database')
const User=require('./model/user')
const app=express()

app.use(express.json())

app.post('/signup',async(req,res)=>{
    console.log(req.body)
    const userObj=req.body
    try {
        console.log(User)
        const user=new User(userObj)
        console.log(user)
        await user.save()
        res.send("User added succesfully")
    } catch (error) {
        res.status(400).send("Error in saving the user "+ error)
    } 
  
})


app.get("/feed",async(req,res)=>{
    try {
        const users=await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("Error in getting the users",error)
    }
})

app.delete('/user',async(req,res)=>{
    const id=req.body.id
    try {
        const user=await User.findByIdAndDelete(id)
        res.send("user deleted succesfully")
    } catch (error) {
        res.send("error in deleting the user")


    }
})


app.patch('/user',async(req,res)=>{
    const id=req.body.id
    try {
        const user=await User.findByIdAndUpdate({_id:id},req.body,{runValidators:true})
        res.send("user updated succesfully")
    } catch (error) {
        res.send("error in updating the user")
    }
})

connectDB().then(()=>{
    console.log("connected to db succesfully")
    app.listen(3000,()=>{
        console.log("server is running")
    })
}).catch((err)=>console.log("error in connecting to db",err))


