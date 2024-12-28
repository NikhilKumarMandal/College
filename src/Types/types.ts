import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  maxTeams?: number;
  maxMembersPerTeam: number;
  type: "Hackathon" | "Gaming";
}

export interface EventData {
  name: string;
  description: string;
  date: Date;
  location: string;
  maxTeams?: number;
  maxMembersPerTeam: number;
  type: "Hackathon" | "Gaming";
}

export interface DecodedToken extends JwtPayload {
  id: string;
}
