import { User } from "../models/user.model";
import { ApiError } from "./ApiError";

export const generateAccessAndRefreshTokens = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Fetch the user by their ID
    const user = await User.findById(userId);

    // Ensure the user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update the user's refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return the tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Handle general errors, such as issues in token generation or database saving
    if (error instanceof Error) {
      throw new ApiError(500, "Error generating tokens", [
        { message: error.message },
      ]);
    }

    // Catch-all for unknown errors
    throw new ApiError(
      500,
      "Unknown error occurred while generating tokens",
      []
    );
  }
};
