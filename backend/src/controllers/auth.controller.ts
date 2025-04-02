import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
} from "../utils/jwt";
import { loginSchema, registerSchema } from "../schemas/auth";
import ErrorHandler from "../utils/ErrorHandler";
import { z } from "zod";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validateData = registerSchema.parse(req.body);

    const existingadmin = await prisma.admin.findUnique({
      where: { email: validateData.email },
    });

    if (existingadmin) throw new ErrorHandler("User already exists", 409);

    const hashedPassword = await bcrypt.hash(validateData.password, 10);

    //create admin
    const admin = await prisma.admin.create({
      data: {
        email: validateData.email,
        password: hashedPassword,
        name: validateData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const accessToken = generateAccessToken({ adminId: admin.id });
    const refreshToken = await generateRefreshToken(admin.id);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ErrorHandler("Provide all fields", 400));
    } else if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to create Admin", 500));
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validateData = loginSchema.parse(req.body);

    const admin = await prisma.admin.findUnique({
      where: { email: validateData.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!admin) throw new ErrorHandler("Invalid Credentials", 401);

    const isPasswordValid = await bcrypt.compare(
      validateData.password,
      admin.password
    );

    if (!isPasswordValid) throw new ErrorHandler("Invalid Credentials", 401);

    const accessToken = generateAccessToken({ adminId: admin.id });
    const refreshToken = await generateRefreshToken(admin.id);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ErrorHandler("Provide all fields", 400));
    } else if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to Login", 500));
    }
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new ErrorHandler("Refresh token required", 401);

    const adminId = await verifyRefreshToken(refreshToken);

    if (!adminId) {
      clearAccessToken(res);
      clearRefreshToken(res);
      throw new ErrorHandler("Invalid or expired refresh token", 401);
    }

    const newAccessToken = generateAccessToken({ adminId });
    const newRefreshToken = await generateRefreshToken(adminId);

    await deleteRefreshToken(refreshToken);

    setAccessToken(res, newAccessToken);
    setRefreshToken(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to refresh token", 500));
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Failed to logout", 401));
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.admin) throw new ErrorHandler("Not authenticated", 401);

    const admin = await prisma.admin.findUnique({
      where: {
        id: req.admin.adminId,
      },
      select: {
        name: true,
        id: true,
        email: true,
      },
    });

    if (!admin) throw new ErrorHandler("Admin not found", 404);

    res.status(200).json({
      success: true,
      message: "Admin found",
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to find Admin", 404));
  }
};
