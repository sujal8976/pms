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
      new ErrorHandler("Authentication required", 401);
      return;
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      new ErrorHandler("Invalid or expired token", 401);
      return;
    }

    req.admin = { adminId: decoded.adminId };
    next();
  } catch (error) {
    new ErrorHandler("Authentication failed", 401);
    return;
  }
};