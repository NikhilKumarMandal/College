import { Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  maxTeams: number;
  maxMembersPerTeam: number;
  type: "Hackathon" | "Gaming";
}
