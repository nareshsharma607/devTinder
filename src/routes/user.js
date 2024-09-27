const express=require("express")
const { userAuth } = require("../middlewares/authMddleware")
const router =express.Router()
const ConnectionRequest=require('../model/connectionRequest')
const USER_SAFE_DATA=["firstName","lastName","about","skills","age","photoUrl"]
const User=require("../model/user")
//get Received requests
router.get('/user/requests/received',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        res.json({data:connectionRequest})

    } catch (error) {
        res.status(400).send("Error in fatching the request data: "+error)
    }
})

//Get all connections
router.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user
    const connectionRequest=await ConnectionRequest.find({$or:[{
        toUserId:loggedInUser._id,
        status:"accepted"
    },   {fromUserId:loggedInUser._id,
    status:"accepted"
}]}).populate("fromUserId",USER_SAFE_DATA).populate('toUserId',USER_SAFE_DATA)

const data=connectionRequest.map(row=>{
    return row.fromUserId._id.toString()===loggedInUser._id.toString()?row.toUserId:row.fromUserId
})
    res.send(data)
    } catch (error) {
        res.status(400).send("Error in fatching the connections: "+error)
    }
})

//Get All the feed

router.get("/user/feed",userAuth,async(req,res)=>{
    try {
    const loggedInUser=req.user
    const page=req.query.page || 1
    let limit=req.query.limit || 10
    limit=limit>=50?50:limit

    const connectionRequest=await ConnectionRequest.find({$or:[
            {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}
 ]

        })

        const hiddenUsers=new Set()
        connectionRequest.forEach((field)=>{
            hiddenUsers.add(field.toUserId)
            hiddenUsers.add(field.fromUserId)
        })
        const feedUsers=await User.find({
            _id:{$nin:Array.from(hiddenUsers)}
        }).select(USER_SAFE_DATA).skip((page-1)*limit+1).limit(limit)
        res.send(feedUsers)

    } catch (error) {
        res.status(400).send("ERROR in fatching feed: "+error)
    }
})

module.exports=router