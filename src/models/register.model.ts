import mongoose, { Document, Schema, Model } from "mongoose";
import { IEvent } from "../types/types";

// Define the interface for the Registration document
export interface IRegistration extends Document {
  eventId: mongoose.Schema.Types.ObjectId | IEvent;
  teamName: string;
  teamCode: string;
  members: { name: string; email: string }[];
  createdAt: Date;
}

// Define the Registration schema
const registrationSchema: Schema<IRegistration> = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    teamCode: {
      type: String,
      unique: true,
      required: true,
    },
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Registration model and export the Registeration model

export const Register = mongoose.model<IRegistration>(
  "Register",
  registrationSchema
);
