import mongoose from "mongoose";
import { IEvent } from "../types/types";

const eventSchema: mongoose.Schema<IEvent> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    maxTeams: {
      type: Number,
      required: true,
    },
    maxMembersPerTeam: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Hackathon", "Gaming"],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Event model and export the event model
export const Event = mongoose.model<IEvent>("Event", eventSchema);
