import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP. Please try again in 10 minutes.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 60,
});
