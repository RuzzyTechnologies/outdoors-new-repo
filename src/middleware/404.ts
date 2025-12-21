import { Request, Response, NextFunction } from "express";

export function invalidRoute(req: Request, res: Response) {
  return res.status(404).json({
    status: 404,
    message: ` Sorry, this route ${req.method}/ ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl} doesn't exist`,
  });
}

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  return res.status(err.status || 500).json({
    status: 500,
    message: err.message || "Internal Server Error",
  });
}
