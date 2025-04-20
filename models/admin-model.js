const mongoose=require('mongoose');
const adminSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:true,
        // required:true,
    },
    date:{
        type:Date,
        default:Date.now()
    },
})

module.exports=mongoose.model("admin",adminSchema);