import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "config";
import express from "express";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AWS Store API Documentation",
      version: "1.0.0",
      description: "API documentation for AWS Store built with Express + Swagger",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || config.get<number>("port")}`,
      },
    ],
  },
  apis: ["./src/**/routes.ts"], // <-- no extra / after src // Path to route files containing annotations
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};