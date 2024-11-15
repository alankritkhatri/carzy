import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Carzy API Documentation",
      version: "1.0.0",
      description: "API documentation for the Carzy car management platform",
    },
    servers: [
      {
        url: "https://carzy-314787054684.asia-south2.run.app",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./server.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs;
