import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ErrorHandler("no_access_token", 401);
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new ErrorHandler("Invalid or expired token", 401);
    }

    req.admin = { adminId: decoded.adminId };
    next();
  } catch (error) {
    throw new ErrorHandler("Authentication failed", 401);
  }
};