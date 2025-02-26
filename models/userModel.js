const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        lowercase : true
    },
    password:{
        type: String,
        require: true
    },
    gender:{
        type: String,
        enum: ['Female','Male'],
        require: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        require: true,
    },
    scoreId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'scores'
    }
},{timestamps: true})

const userModel =mongoose.model('users',UserSchema)

module.exports = userModel