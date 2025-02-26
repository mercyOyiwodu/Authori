const mongoose = require('mongoose')
require('dotenv').config()
const db = process.env.MONGO_DB

mongoose.connect(db)
.then(()=>{
    console.log('Connection to Database Has Been Established Successfully');
})
.catch((err)=>{
    console.log('Error Connecting To Database ' + err.message);
    
})