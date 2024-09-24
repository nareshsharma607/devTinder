const mongoose=require("mongoose")

const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://nareshsharma607:9313259541@nodefirst.5ypah.mongodb.net/devTinder")
}


  



 

module.exports=connectDB