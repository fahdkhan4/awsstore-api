import express, { NextFunction, Request, Response } from "express";
import config from "config";
import { errors } from "celebrate";
import { errorMiddleware } from "./middleware/error.middleware";
import defaultRoutesHandler from "./middleware/defaultRoute.middleware";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";

const port = config.get<number>("port");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  //Database Connection
  await connect();

  //Routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    routes(req, res, next);
  });

  //UnKnown Routing
  app.all("*", defaultRoutesHandler);

  //Error Handling
  app.use(errors());
  app.use(errorMiddleware);
});
