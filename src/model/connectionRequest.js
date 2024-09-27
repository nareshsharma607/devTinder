const mongoose=require("mongoose")

const connectionSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:"{VALUE} is incorrect status type"
        }
    }
},{timestamps:true})

connectionSchema.pre("save",function(next){
   const user=this
   console.log("jj",user)
   if(user.fromUserId.equals(user.toUserId)){
    throw Error("Can not send request to self")
   }
   next()
})
const connectionRequestModel=mongoose.model("ConnectionRequest",connectionSchema)

module.exports=connectionRequestModel