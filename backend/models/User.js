const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");



const UserSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profileImageUrl :{
        type : String,
        default : null,

    }
},{
    timestamps : true 
})


//hashpawword before saving to database


//Compare password 

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}


module.exports = mongoose.model("User",UserSchema)