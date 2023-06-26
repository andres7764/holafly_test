const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Holafly Rest',
      description: 'This is a service to grant access to endpoints at the developers',
      version: '1.0.0',
    },
  },
  apis: ['./endpoints/swapiEndpoints.js'],
};

const specs = swaggerJsDoc(options);

module.exports = (server) => {
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};