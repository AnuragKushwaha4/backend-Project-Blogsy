const mongoose =require("mongoose");


const schema=mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"usermodel"
        },
    date:{
        type:Date,
        default:Date.now
    },
    content:String,
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"usermodel"
        }
    ]
})

module.exports=mongoose.model("userpost",schema);