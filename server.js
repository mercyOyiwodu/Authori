const express = require('express')
require('./cofig/database')
const userRouter = require('./routes/userRouter')
const scoreRouter = require('./routes/scoreRouter')

const port = process.env.PORT || 3232
const app = express()

app.use(express.json())
app.use('/api/v1',userRouter)
app.use('/api/v1',scoreRouter)
const swaggerJsdoc = require('swagger-jsdoc');
const swagger_Ui = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World, This is my first swagger documentation ❤❤',
      version: '1.0.0',
    },
  },
  apis: ['./routes*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swagger_Ui.serve, swagger_Ui.setup(openapiSpecification));


app.listen(port,()=>{
    console.log(`My Server Is Up And On Port ${port}`)
})