import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  const clientKey = req.header("x-api-key");
  const serverKey = process.env.API_KEY;

  if (!serverKey || clientKey !== serverKey) {
    res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
    return;
  }

  next();
}
