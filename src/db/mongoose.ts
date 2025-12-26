import mongoose from "mongoose";
import { logger } from "../utils/logger";

mongoose.connect(`${process.env.MONGO_URL}`).then(() => {
  logger.info("Database Connected!");
});
