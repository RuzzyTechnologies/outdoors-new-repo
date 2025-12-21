import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";

const PORT = process.env.PORT || 4500;

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Boilerplate Express API with swagger",
    version: "1.0.0",
    description: "API documentation of Outdoors backend service",
  },
  servers: [
    {
      url: `http://localhost:${PORT}/`,
      description: "Local server",
    },
    {
      // fill in later
      url: "",
      description: "Live server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  externalDocs: {
    url: "docs",
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJSDoc(options);
