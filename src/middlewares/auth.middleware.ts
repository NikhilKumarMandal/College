import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

interface DecodedToken {
  _id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

export const verifyUser = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    try {
      const token: string =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as DecodedToken;

      const decodedTokenId = decodedToken._id;
      const user = await User.findById(decodedTokenId).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user as IUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(401, "Invalid Access Token or token expired", [
          { message: error.message },
        ]);
      }
    }
  }
);
