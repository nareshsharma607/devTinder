const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"value must be of minimum 3 it is {value}"],
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
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error("Invalid Email formate")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw Error("Choose a strong password")
            }
        }
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
     validate(value){
        if(!validator.isURL(value)){
            throw Error("Invalid URL formate")
        }
    },
    default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vectors%2Fblank-profile-picture-vectors&psig=AOvVaw28_fEncl1Lj4Abk5W_a1b9&ust=1727340594388000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOi0pKfb3YgDFQAAAAAdAAAAABAE"
    },
    about:{
        type:String,
        default:"asdadsaasddsfgfgerf"
    },
    skills:{
        type:[String],
       validate(value){
        console.log(value)
        if(value.length>5){
            throw Error("Five skills only")
        }
       }
        
    }
},{timestamps:true})
userSchema.methods.getJwt=async function(){
    const user=this
    const token= await jwt.sign({_id:user._id},"dev@Tinder",{expiresIn:"1d"})
    return token;

}
userSchema.methods.validatePassword=async function(userInputPassword){
    const {emailId,password}=this
   
    const isPasswordValid=await bcrypt.compare(userInputPassword,password)
    if(!isPasswordValid){
        throw Error("Invalid email/password")
    }
    return isPasswordValid

}

const userModel=mongoose.model("User",userSchema)

module.exports=userModel