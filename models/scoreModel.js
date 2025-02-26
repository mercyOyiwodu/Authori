const mongoose = require('mongoose');
const ScoreSchema = new mongoose.Schema({
    week:{
        type: Number,
        require: true
    },
    puntuality:{
        type: Number,
        require: true
    },
    assignment:{
        type: Number,
        require: true
    },
    attendance:{
        type: Number,
        require: true
    },
    classAssessment:{
        type: Number,
        require: true
    },
    personalDefence:{
        type: Number,
        require: true
    },
    total:{
        type: Number,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
},{timestamps: true})

const scoreModel = mongoose.model('scores',ScoreSchema)

module.exports = scoreModel