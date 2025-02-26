const express = require('express')
require('./cofig/database')
const userRouter = require('./routes/userRouter')
const scoreRouter = require('./routes/scoreRouter')

const port = process.env.PORT || 3232
const app = express()

app.use(express.json())
app.use('/api/v1',userRouter)
app.use('/api/v1',scoreRouter)

app.listen(port,()=>{
    console.log(`My Server Is Up And On Port ${port}`)
})