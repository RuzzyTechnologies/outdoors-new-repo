import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import type { Express } from "express";
import expressBasicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";

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
  externalDocs: {
    url: "docs",
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/openapi/*.ts", "./src/routes/*.ts"],
};

export const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express, specs: object) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const swaggerAuth = expressBasicAuth({
    users: {
      [process.env.SWAGGER_USER as string]: process.env.SWAGGER_PASS as string,
    },
    challenge: true,
    realm: "API Documentation",
  });

  app.use(
    "/docs",
    swaggerAuth,
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        supportedSubmitMethods: [],
      },
    })
  );
}
