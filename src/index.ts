import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { limiter } from "./middleware/limiter.ts";
import { logger } from "./utils/logger.ts";
import { invalidRoute, errorMiddleware } from "./middleware/404.ts";
import userRouter from "./routes/user.ts";
import adminRouter from "./routes/admin.ts";
import locationRouter from "./routes/location.ts";
import quoteRouter from "./routes/quote.ts";
import productRouter from "./routes/product.ts";
import orderRouter from "./routes/order.ts";
import { setupSwagger, specs } from "./swagger.ts";

import "./db/mongoose.ts";

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
  logger.info(`Server listening on port ${port}!`);
});

process.on("SIGTERM", () => {
  logger.debug(`SIGTERM signal received: closing HTTP server`);
  server.close(() => {
    logger.debug("HTTP server closed!");
  });
});
