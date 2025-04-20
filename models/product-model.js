const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
   image:Buffer,
   productname:String,
   price:Number,
   discount:Number,
   description:String,
   owner:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"user"
   },
   ordered:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
   },
   date:{
      type:Date,
      default:Date.now()
  },
})

module.exports = mongoose.model("product",productSchema);