const express = require('express');
require('./cofig/database');
const userRouter = require('./routes/userRouter');
const scoreRouter = require('./routes/scoreRouter');

const port = process.env.PORT || 3232;
const app = express();

app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1', scoreRouter);

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World, This is my first swagger documentation ❤❤',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3232',
        description: 'Development server',
      },
      {
        url: 'https://myapp.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
  apis: ['./routes/*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(port, () => {
  console.log(`My Server Is Up And On Port ${port}`);
});