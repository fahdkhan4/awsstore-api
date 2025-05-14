import express, { NextFunction, Request, Response } from "express";
import config from "config";
import { errors } from "celebrate";
import { errorMiddleware } from "./middleware/error.middleware";
import defaultRoutesHandler from "./middleware/defaultRoute.middleware";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import dotenv from "dotenv";
// 👇 Add this import
import { setupSwagger } from "./swagger";

const port = config.get<number>("port");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  // Register all routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    routes(req, res, next);
  });

  // Setup Swagger
  setupSwagger(app);

  // Unknown route handler
  app.all("*", defaultRoutesHandler);

  // Error handling
  app.use(errors());
  app.use(errorMiddleware);
});