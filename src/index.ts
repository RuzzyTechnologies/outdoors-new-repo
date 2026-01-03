import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { limiter } from "./middleware/limiter";
import { logger } from "./utils/logger";
import { invalidRoute, errorMiddleware } from "./middleware/404";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import locationRouter from "./routes/location";
import quoteRouter from "./routes/quote";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import { setupSwagger, specs } from "./swagger";
import { connectRedis } from "./redis/client";

import "./db/mongoose";

const app = express();
const port = process.env.PORT || 4500;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(helmet());
app.use(morgan("tiny"));
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", userRouter);
app.use("/api/v1/", adminRouter);
app.use("/api/v1/", locationRouter);
app.use("/api/v1/", productRouter);
app.use("/api/v1/", quoteRouter);
app.use("/api/v1/", orderRouter);

setupSwagger(app, specs);

app.use(invalidRoute);
app.use(errorMiddleware);

const server = app.listen(port, () => {
  connectRedis();
  logger.info(`Server listening on port ${port}!`);
});

process.on("SIGTERM", () => {
  logger.debug(`SIGTERM signal received: closing HTTP server`);
  server.close(() => {
    logger.debug("HTTP server closed!");
  });
});
