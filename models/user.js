const mongoose = require("mongoose");
const {Schema}=mongoose

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique : true,
        required : true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    bookings: [
        {
          carDetails : {type :Object},
          from: { type: String},
          to: { type: String},
        },
      ],
})
const userModel = mongoose.model('users', userSchema)

module.exports = userModel