const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLegth:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        lowercase:true
        ,
        validate(value){
        if(!["male",'female','other'].includes(value)){
            throw Error("Invalid gender")
        }
        }
    },
    photoUrl:{
     type:String,
    default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fblank-profile-picture-vectors&psig=AOvVaw28_fEncl1Lj4Abk5W_a1b9&ust=1727340594388000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOi0pKfb3YgDFQAAAAAdAAAAABAE"
    },
    about:{
        type:String,
        default:"asdadsaasddsfgfgerf"
    },
    skills:{
        type:[String],
        
    }
},{timestamps:true})

const userModel=mongoose.model("User",userSchema)

module.exports=userModel