const express=require('express')
const { userAuth } = require('../middlewares/authMddleware')
const ConnectionRequest=require("../model/connectionRequest")
const router=express.Router()

router.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status
        const allowedStatus=["ignored","interested"]
        console.log(fromUserId,toUserId,status)
        if(!allowedStatus.includes(status)){
            throw Error("Invalid status")
        }
        const connectionRequestExistedOrNot=await ConnectionRequest.findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]})
        if(connectionRequestExistedOrNot){
            throw Error("Connection already existed")
        }
        const toUser=ConnectionRequest.findOne({toUserId})
        if(!toUser){ 
            throw Error("Invalid userId")
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        const data=await connectionRequest.save()
        res.send("connection request send "+data)
    } catch (error) {
        res.status(400).send("Request failed: "+error)
    }
})


router.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
try {
    const loggedInUser=req.user
    const allowedStatus=["accepted","rejected"]
    const {status,requestId}=req.params
    if(!allowedStatus.includes(status)){
        throw Error("Invalid status")
    }
    const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    })
    if(!connectionRequest){
        throw Error("Connection request not found Request")
    }
    connectionRequest.status=status
    const data=await connectionRequest.save()
    res.send(`connection request ${status}: `+data)
} catch (error) {
    res.status(400).send("Error: "+error)
}})

module.exports=router