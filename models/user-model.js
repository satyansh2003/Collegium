const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    image:Buffer,
    username:String,
    email:String,
    password:String,
    phoneNumber:Number,
    Year:String,
    about:String,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
    }],
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    date:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationCode:String
})

module.exports = mongoose.model("user",userSchema);