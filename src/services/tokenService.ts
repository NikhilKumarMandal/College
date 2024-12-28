import jwt from "jsonwebtoken";
import { DecodedToken } from "../types/types";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

interface Payload {
  _id: string;
}

export class TokenService {
  genrateToken(playload: Payload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = jwt.sign(playload, accessTokenSecret!, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(playload, refreshTokenSecret!, {
      expiresIn: "10d",
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string) {
    return jwt.verify(token, accessTokenSecret!) as DecodedToken;
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, refreshTokenSecret!) as DecodedToken;
  }
}
