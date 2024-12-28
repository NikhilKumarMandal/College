import { Response } from "express";
import { Request, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const canAccess = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.user?.role;
  if (userRole !== "admin") {
    throw new ApiError(403, "Permission denied. Admins only.");
  }
  next();
};
