import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";

// Interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  role: "user" | "admin";
  bio?: string;
  avatar?: string;
  lastActive: Date;
  refreshToken?: string;
  googleId?: string;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Define the schema
const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w.-]+@[\w.-]+\.\w{2,4}$/, "Please provide a valid email"],
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      maxLength: [200, "Bio cannot exceed 200 characters"],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "10d",
    }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
