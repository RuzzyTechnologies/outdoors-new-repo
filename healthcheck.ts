import http from "http";
import { logger } from "./src/utils/logger";

const options = {
  timeout: 2000,
  host: "localhost",
  port: process.env.PORT || 4500,
  path: "/ping",
};

const request = http.request(options, (res) => {
  logger.info("STATUS: " + res.statusCode);
  process.exitCode = res.statusCode === 200 ? 0 : 1;
  process.exit();
});

request.on("error", (err: any) => {
  logger.error("ERROR", err);
  process.exit(1);
});

request.end;
