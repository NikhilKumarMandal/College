import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import axios from "axios";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { generateAccessAndRefreshTokens } from "../utils/genrateToken";
import { Logger } from "winston";

// Define the structure of the Google OAuth response
interface GoogleOAuthResponse {
  email: string;
  email_verified: boolean;
  sub: string;
  name: string;
  picture: string;
}

export class AuthController {
  constructor(private logger: Logger) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      throw new ApiError(400, "Token is required and should be a valid string");
    }

    const googleToken = token;
    const googleOauthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthUrl.searchParams.set("id_token", googleToken);
    try {
      const { data } = await axios.get<GoogleOAuthResponse>(
        googleOauthUrl.toString(),
        {
          responseType: "json",
        }
      );

      // Validate Google OAuth response
      if (!data.email || !data.email_verified || !data.sub) {
        throw new ApiError(400, "Invalid token response from Google");
      }

      let user = await User.findOne({ email: data.email });

      // If the user does not exist, create a new user with googleId
      if (!user) {
        user = await User.create({
          username: data.name,
          email: data.email,
          isVerified: data.email_verified,
          avatar: data.picture,
          googleId: data.sub,
        });
      }

      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id as string);

      // Set cookies
      const options = {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user,
              accessToken,
              refreshToken,
            },
            "User logged in successfully"
          )
        );
    } catch (error) {
      this.logger.error("Error during Google authentication:", error);
      if (axios.isAxiosError(error)) {
        throw new ApiError(500, "Error during Google authentication request", [
          { message: error.message },
        ]);
      }

      if (error instanceof Error) {
        throw new ApiError(500, "Error during Google authentication", [
          { message: error.message },
        ]);
      } else {
        throw new ApiError(
          500,
          "Unknown error occurred during authentication",
          []
        );
      }
    }
  });
}
